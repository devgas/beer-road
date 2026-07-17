'use strict';

const fs = require('fs');
const path = require('path');

// Pick the database backend:
//   - Postgres when DATABASE_URL is set (local dev / Neon).
//   - SQLite (read-only, prebuilt at build time) otherwise (Vercel).
const connectionString = process.env.DATABASE_URL;

// Error code label for unique constraint violations.
// Postgres: '23505'. SQLite: 'SQLITE_CONSTRAINT_UNIQUE' (2067). We expose a
// single constant so callers can branch without knowing the backend.
const PG_UNIQUE_VIOLATION = '23505';

let mode; // 'pg' | 'sqlite'
let pgPool = null; // pg Pool (pg mode)
let sqliteDb = null; // better-sqlite3 instance (sqlite mode)

if (connectionString) {
  mode = 'pg';
  const { Pool } = require('pg');
  pgPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} else {
  mode = 'sqlite';
  const Database = require('better-sqlite3');
  const sourceDbPath = path.join(__dirname, 'beer-road.db');
  const dbPath = process.env.SQLITE_DB_PATH || (process.env.VERCEL ? path.join('/tmp', 'beer-road.db') : sourceDbPath);

  if (dbPath !== sourceDbPath && !fs.existsSync(dbPath)) {
    fs.copyFileSync(sourceDbPath, dbPath);
  }

  sqliteDb = new Database(dbPath, { fileMustExist: true });
  sqliteDb.pragma('foreign_keys = ON');
}

/**
 * Convert SQLite-style ? placeholders to Postgres $1, $2, ... style.
 */
function convertPlaceholders(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

/**
 * Run a raw query against the Postgres pool, returning the pg Result.
 */
function pgQuery(sql, params) {
  return new Promise((resolve, reject) => {
    pgPool.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/**
 * Prepare a SQL statement that can be executed with .get(), .all(), or .run().
 * Works in BOTH modes and returns the same statement-shaped interface:
 *   - pg:      async methods backed by the pool.
 *   - sqlite:  better-sqlite3 statement (synchronous get/all/run; await is safe).
 */
function prepare(sql) {
  if (mode === 'pg') {
    const pgSql = convertPlaceholders(sql);

    function get(...params) {
      return pgQuery(pgSql, params).then((result) => result.rows[0] || null);
    }

    function all(...params) {
      return pgQuery(pgSql, params).then((result) => result.rows);
    }

    function run(...params) {
      const runnableSql = /^\s*INSERT\b/i.test(pgSql) && !/\bRETURNING\b/i.test(pgSql)
        ? `${pgSql} RETURNING id`
        : pgSql;

      return pgQuery(runnableSql, params).then((result) => ({
        lastInsertRowid: result.rows[0]?.id || 0,
        changes: result.rowCount,
      }));
    }

    return { get, all, run };
  }

  // SQLite: ? placeholders are used directly (no conversion needed).
  return sqliteDb.prepare(sql);
}

/**
 * Execute raw / multi-statement SQL (DDL, PRAGMA, seeding).
 */
function exec(sql) {
  if (mode === 'pg') {
    return new Promise((resolve, reject) => {
      pgPool.query(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  sqliteDb.exec(sql);
  return Promise.resolve();
}

/**
 * Initialize database schema and seed data. Safe to call multiple times.
 * On SQLite this is a no-op: the DB is prebuilt at build time by
 * server/scripts/seed-sqlite.js.
 */
async function initializeDatabase() {
  if (mode === 'pg') {
    const schema = await fs.promises.readFile(path.join(__dirname, 'schema.sql'), 'utf-8');
    await exec(schema);
    await seedIfMissing();
    return pgPool;
  }

  const schema = await fs.promises.readFile(path.join(__dirname, 'schema.sqlite.sql'), 'utf-8');
  await exec(schema);
  await seedIfMissing();
  return sqliteDb;
}

/**
 * Insert seed data without clobbering existing user/runtime data.
 */
async function runSeedSql() {
  const seed = await fs.promises.readFile(path.join(__dirname, 'seed.sql'), 'utf-8');
  const statements = seed
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    if (!/\bINSERT\s+INTO\b/i.test(statement)) {
      await exec(`${statement};`);
      continue;
    }

    if (mode === 'pg') {
      await exec(`${statement} ON CONFLICT (id) DO NOTHING;`);
    } else {
      await exec(`${statement.replace(/\bINSERT\s+INTO\b/i, 'INSERT OR IGNORE INTO')};`);
    }
  }
}

async function seedIfMissing() {
  await runSeedSql();
  if (mode === 'pg') await syncSequences();
}

/**
 * Postgres SERIAL sequences are NOT advanced by explicit-id INSERTs in the
 * seed, so the next auto-generated id would collide with a seeded id.
 * Reset each table's id sequence to MAX(id) + 1.
 */
async function syncSequences() {
  const tables = ['users', 'breweries', 'beers', 'challenges', 'trips', 'trip_stops', 'favorites', 'reviews', 'user_challenges'];
  for (const table of tables) {
    try {
      await exec(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, false);`
      );
    } catch (err) {
      // Table may not have a serial sequence; ignore.
      console.error(`[db] syncSequences skipped ${table}:`, err.message);
    }
  }
}

// The `db` property is the handle routes consume (db.prepare / db.exec).
// In sqlite mode it is the better-sqlite3 instance; in pg mode it is a thin
// wrapper exposing the same prepare/exec interface.
const db = mode === 'sqlite' ? sqliteDb : { prepare, exec };

module.exports = {
  db,
  pool: connectionString ? pgPool : null,
  prepare,
  exec,
  initializeDatabase,
  seedIfEmpty: seedIfMissing,
  seedIfMissing,
  PG_UNIQUE_VIOLATION,
};
