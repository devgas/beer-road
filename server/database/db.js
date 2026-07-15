'use strict';

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Connection pooling for serverless / Vercel.
// DATABASE_URL should be set (e.g. from Neon).
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[db] DATABASE_URL not set. Database operations will fail.');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Error code for unique constraint violations in Postgres
const PG_UNIQUE_VIOLATION = '23505';

/**
 * Convert SQLite-style ? placeholders to Postgres $1, $2, ... style.
 */
function convertPlaceholders(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

/**
 * Wrap a SQL statement so it can be executed with .get(), .all(), or .run().
 */
function prepare(sql) {
  const pgSql = convertPlaceholders(sql);

  function get(...params) {
    return new Promise((resolve, reject) => {
      pool.query(pgSql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0] || null);
      });
    });
  }

  function all(...params) {
    return new Promise((resolve, reject) => {
      pool.query(pgSql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      });
    });
  }

  function run(...params) {
    return new Promise((resolve, reject) => {
      pool.query(pgSql, params, (err, result) => {
        if (err) return reject(err);
        resolve({
          lastInsertRowid: result.rows[0]?.id || 0,
          changes: result.rowCount,
        });
      });
    });
  }

  return { get, all, run };
}

/**
 * Execute raw SQL (for DDL like CREATE TABLE).
 */
function exec(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Initialize database schema and seed data.
 * Safe to call multiple times (idempotent).
 */
async function initializeDatabase() {
  const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf-8');
  await exec(schema);
  await seedIfEmpty();
  return pool;
}

/**
 * Insert seed data only when tables are empty.
 */
async function seedIfEmpty() {
  const result = await pool.query('SELECT COUNT(*) AS count FROM breweries');
  const breweryCount = parseInt(result.rows[0]?.count || '0', 10);

  if (breweryCount > 0) return;

  const seed = await fs.readFile(path.join(__dirname, 'seed.sql'), 'utf-8');
  await exec(seed);
}

module.exports = { pool, prepare, exec, initializeDatabase, seedIfEmpty, PG_UNIQUE_VIOLATION };
