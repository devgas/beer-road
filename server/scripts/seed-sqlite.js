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

  // 2) Seed only when the breweries table is empty (idempotent).
  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM breweries')
    .get();

  if (count === 0) {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    db.exec(seed);
    console.log('[seed:sqlite] Inserted seed data (breweries, beers, challenges).');
  } else {
    console.log('[seed:sqlite] Breweries already present; skipping seed.');
  }

  // 3) Final pragmas: DELETE journal mode is read-only friendly, enable FKs.
  db.exec('PRAGMA journal_mode = DELETE;');
  db.exec('PRAGMA foreign_keys = ON;');

  console.log('[seed:sqlite] SQLite database ready at', dbPath);
} finally {
  db.close();
}
