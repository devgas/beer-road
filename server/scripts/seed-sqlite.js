'use strict';

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const databaseDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(databaseDir, 'beer-road.db');
const schemaPath = path.join(databaseDir, 'schema.sqlite.sql');
const seedPath = path.join(databaseDir, 'seed.sql');

// Open read-write (create if missing). The runtime opens this file read-only.
const db = new Database(dbPath);

try {
  // 1) Apply the SQLite schema (CREATE TABLE IF NOT EXISTS ...).
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  // Add the image_url column for existing databases created before it existed.
  // SQLite lacks ADD COLUMN IF NOT EXISTS, so ignore a duplicate-column error.
  try {
    db.exec('ALTER TABLE breweries ADD COLUMN image_url TEXT;');
  } catch (err) {
    if (!/duplicate column/i.test(err.message)) throw err;
  }

  // 2) Seed every table idempotently so a partially seeded DB can recover.
  const seed = fs.readFileSync(seedPath, 'utf-8');
  const statements = seed
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    if (/\bINSERT\s+INTO\b/i.test(statement)) {
      db.exec(`${statement.replace(/\bINSERT\s+INTO\b/i, 'INSERT OR IGNORE INTO')};`);
    } else {
      db.exec(`${statement};`);
    }
  }

  console.log('[seed:sqlite] Seed data ensured (breweries, beers, challenges).');

  // 3) Final pragmas: DELETE journal mode is read-only friendly, enable FKs.
  db.exec('PRAGMA journal_mode = DELETE;');
  db.exec('PRAGMA foreign_keys = ON;');

  console.log('[seed:sqlite] SQLite database ready at', dbPath);
} finally {
  db.close();
}
