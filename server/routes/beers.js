'use strict';

const express = require('express');
const { db } = require('../database/db');
const { auth } = require('../middleware/auth');

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

/**
 * POST /api/beers
 * Protected: create a beer for a brewery.
 * Body: { brewery_id, name, style, abv, ibu, description, image_url }
 */
router.post('/', auth, async (req, res, next) => {
  try {
    const { brewery_id, name, style, abv, ibu, description, image_url } = req.body;
    if (!brewery_id) {
      const err = new Error('brewery_id is required');
      err.status = 400;
      throw err;
    }
    if (!name) {
      const err = new Error('Beer name is required');
      err.status = 400;
      throw err;
    }

    const info = await db
      .prepare(
        `INSERT INTO beers (brewery_id, name, style, abv, ibu, description, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        brewery_id,
        name,
        style || null,
        abv != null && abv !== '' ? Number(abv) : null,
        ibu != null && ibu !== '' ? Number(ibu) : null,
        description || null,
        image_url || null
      );

    const beer = await db.prepare('SELECT * FROM beers WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ beer });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/beers/:id
 * Protected: update an existing beer's fields.
 */
router.put('/:id', auth, async (req, res, next) => {
  try {
    const existing = await db.prepare('SELECT * FROM beers WHERE id = ?').get(req.params.id);
    if (!existing) {
      const err = new Error('Beer not found');
      err.status = 404;
      throw err;
    }

    const fields = ['brewery_id', 'name', 'style', 'abv', 'ibu', 'description', 'image_url'];
    const sets = [];
    const params = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        sets.push(`${f} = ?`);
        if (['abv', 'ibu'].includes(f)) {
          params.push(req.body[f] != null && req.body[f] !== '' ? Number(req.body[f]) : null);
        } else if (f === 'brewery_id') {
          params.push(Number(req.body[f]));
        } else {
          params.push(req.body[f] === '' ? null : req.body[f]);
        }
      }
    }

    if (sets.length) {
      params.push(req.params.id);
      await db.prepare(`UPDATE beers SET ${sets.join(', ')} WHERE id = ?`).run(...params);
    }

    const beer = await db.prepare('SELECT * FROM beers WHERE id = ?').get(req.params.id);
    res.json({ beer });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/beers/:id
 * Protected: remove a beer.
 */
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const existing = await db.prepare('SELECT id FROM beers WHERE id = ?').get(req.params.id);
    if (!existing) {
      const err = new Error('Beer not found');
      err.status = 404;
      throw err;
    }
    await db.prepare('DELETE FROM beers WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
