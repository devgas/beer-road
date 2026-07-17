'use strict';

const express = require('express');
const { db } = require('../database/db');

const router = express.Router();

/**
 * GET /api/beers
 * Query: ?brewery_id= ?style= ?q=
 */
router.get('/', async (req, res, next) => {
  try {
    const { brewery_id, style, q } = req.query;
    const conditions = [];
    const params = [];

    if (brewery_id) {
      conditions.push('brewery_id = ?');
      params.push(brewery_id);
    }
    if (style) {
      conditions.push('style = ?');
      params.push(style);
    }
    if (q) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const clause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await db.prepare(`SELECT * FROM beers ${clause} ORDER BY name ASC`).all(...params);
    res.json({ data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/beers/styles
 */
router.get('/meta/styles', async (req, res, next) => {
  try {
    const styles = await db.prepare('SELECT DISTINCT style FROM beers WHERE style IS NOT NULL ORDER BY style ASC').all();
    res.json(styles.map((s) => s.style));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/breweries/:breweryId/beers
 */
router.get('/brewery/:breweryId', async (req, res, next) => {
  try {
    const { breweryId } = req.params;
    const rows = await db.prepare('SELECT * FROM beers WHERE brewery_id = ? ORDER BY name ASC').all(breweryId);
    res.json({ data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/beers/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const beer = await db.prepare('SELECT * FROM beers WHERE id = ?').get(req.params.id);
    if (!beer) {
      const err = new Error('Beer not found');
      err.status = 404;
      throw err;
    }
    res.json({ beer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
