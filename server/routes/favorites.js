'use strict';

const express = require('express');
const { db } = require('../database/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Favorites are always scoped to the authenticated user.
router.use(auth);

/**
 * GET /api/favorites
 * Return the user's saved breweries, joined with brewery details.
 */
router.get('/', async (req, res, next) => {
  try {
    const rows = await db
      .prepare(
        `SELECT b.*, f.created_at AS favorited_at
         FROM favorites f
         JOIN breweries b ON b.id = f.brewery_id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`
      )
      .all(req.user.id);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/favorites/:breweryId
 * Toggle-friendly: adding an existing favorite is a no-op (returns 200).
 */
router.post('/:breweryId', async (req, res, next) => {
  try {
    const brewery = await db
      .prepare('SELECT id FROM breweries WHERE id = ?')
      .get(req.params.breweryId);
    if (!brewery) {
      const err = new Error('Brewery not found');
      err.status = 404;
      throw err;
    }

    const existing = await db
      .prepare('SELECT id FROM favorites WHERE user_id = ? AND brewery_id = ?')
      .get(req.user.id, req.params.breweryId);

    if (existing) {
      return res.json({ favorite: existing, created: false });
    }

    const info = await db
      .prepare('INSERT INTO favorites (user_id, brewery_id) VALUES (?, ?)')
      .run(req.user.id, req.params.breweryId);

    const favorite = await db.prepare('SELECT * FROM favorites WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ favorite, created: true });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/favorites/:breweryId
 */
router.delete('/:breweryId', async (req, res, next) => {
  try {
    const info = await db
      .prepare('DELETE FROM favorites WHERE user_id = ? AND brewery_id = ?')
      .run(req.user.id, req.params.breweryId);
    if (info.changes === 0) {
      const err = new Error('Favorite not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
