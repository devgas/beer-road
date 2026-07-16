'use strict';

const express = require('express');
const { db } = require('../database/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * Build a parameterized WHERE clause from the provided filters.
 * Returns { clause, params } where clause is "" or "WHERE ...".
 */
function buildBreweryFilters({ city, state, type, country, q }) {
  const conditions = [];
  const params = [];

  if (city) {
    conditions.push('city LIKE ?');
    params.push(`%${city}%`);
  }
  if (state) {
    conditions.push('state LIKE ?');
    params.push(`%${state}%`);
  }
  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (country) {
    conditions.push('country = ?');
    params.push(country);
  }
  if (q) {
    // Free-text search across the most useful columns.
    conditions.push('(name LIKE ? OR description LIKE ? OR city LIKE ? OR address LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }

  const clause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { clause, params };
}

/**
 * GET /api/breweries/filters/cities
 * Returns distinct list of cities for filter dropdowns.
 */
router.get('/filters/cities', async (req, res, next) => {
  try {
    const cities = await db.prepare('SELECT DISTINCT city FROM breweries WHERE city IS NOT NULL ORDER BY city ASC').all();
    res.json(cities.map((row) => row.city));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/breweries/filters/states
 * Returns distinct list of states for filter dropdowns.
 */
router.get('/filters/states', async (req, res, next) => {
  try {
    const states = await db.prepare('SELECT DISTINCT state FROM breweries WHERE state IS NOT NULL ORDER BY state ASC').all();
    res.json(states.map((row) => row.state));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/breweries/filters/types
 * Returns distinct list of brewery types for filter dropdowns.
 */
router.get('/filters/types', async (req, res, next) => {
  try {
    const types = await db.prepare('SELECT DISTINCT type FROM breweries WHERE type IS NOT NULL ORDER BY type ASC').all();
    res.json(types.map((row) => row.type));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/breweries
 * Query: ?city= ?state= ?type= ?country= ?q= ?page= ?limit=
 */
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const { clause, params } = buildBreweryFilters(req.query);

    const { total } = await db
      .prepare(`SELECT COUNT(*) AS total FROM breweries ${clause}`)
      .get(...params);

    const rows = await db
      .prepare(
        `SELECT * FROM breweries ${clause} ORDER BY name ASC LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset);

    res.json({
      data: rows,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/breweries/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const brewery = await db
      .prepare('SELECT * FROM breweries WHERE id = ?')
      .get(req.params.id);
    if (!brewery) {
      const err = new Error('Brewery not found');
      err.status = 404;
      throw err;
    }
    res.json({ brewery });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/breweries
 * Protected: any authenticated user may add a brewery (admin-style in demo).
 * Body mirrors the breweries columns.
 */
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, address, city, state, country, lat, lng, website, phone, description, type } = req.body;
    if (!name) {
      const err = new Error('Brewery name is required');
      err.status = 400;
      throw err;
    }

    const info = await db
      .prepare(
        `INSERT INTO breweries (name, address, city, state, country, lat, lng, website, phone, description, type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        name,
        address || null,
        city || null,
        state || null,
        country || 'USA',
        lat != null ? Number(lat) : null,
        lng != null ? Number(lng) : null,
        website || null,
        phone || null,
        description || null,
        type || null
      );

    const brewery = await db.prepare('SELECT * FROM breweries WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ brewery });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/breweries/country/:countryName
 * Proxy to Open Brewery DB for international brewery data.
 * Normalizes the response to match our schema.
 */
router.get('/country/:countryName', async (req, res, next) => {
  try {
    const { countryName } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 50;

    const url = `https://api.openbrewerydb.org/v1/breweries?by_country=${encodeURIComponent(countryName)}&page=${page}&per_page=${perPage}`;
    const response = await fetch(url);

    if (!response.ok) {
      const err = new Error(`Open Brewery DB proxy failed: ${response.statusText}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();

    const normalized = data.map((b) => ({
      id: b.id || null,
      name: b.name || null,
      address: b.address_1 || null,
      city: b.city || null,
      state: b.state_province || b.state || null,
      country: b.country || null,
      lat: b.latitude != null ? Number(b.latitude) : null,
      lng: b.longitude != null ? Number(b.longitude) : null,
      website: b.website_url || null,
      phone: b.phone || null,
      description: null,
      type: b.brewery_type ? b.brewery_type.charAt(0).toUpperCase() + b.brewery_type.slice(1) : null,
      isExternal: true,
    }));

    res.json({
      data: normalized,
      page,
      perPage,
      total: normalized.length,
      totalPages: 1,
      source: 'Open Brewery DB',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stats
 * Returns aggregate counts for the dashboard.
 */
router.get('/stats', async (req, res, next) => {
  try {
    const { count: breweries } = await db.prepare('SELECT COUNT(*) AS count FROM breweries').get();
    const { count: trips } = await db.prepare('SELECT COUNT(*) AS count FROM trips').get();
    const { count: users } = await db.prepare('SELECT COUNT(*) AS count FROM users').get();
    const { count: reviews } = await db.prepare('SELECT COUNT(*) AS count FROM reviews').get();
    res.json({ breweries, trips, users, reviews });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
