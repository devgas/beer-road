'use strict';

const express = require('express');
const { db } = require('../database/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/reviews/brewery/:breweryId
 * Public list of reviews for a brewery, newest first, with author names.
 */
router.get('/brewery/:breweryId', async (req, res, next) => {
  try {
    const brewery = await db
      .prepare('SELECT id FROM breweries WHERE id = ?')
      .get(req.params.breweryId);
    if (!brewery) {
      const err = new Error('Brewery not found');
      err.status = 404;
      throw err;
    }

    const rows = await db
      .prepare(
        `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS author_name, u.id AS author_id
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.brewery_id = ?
         ORDER BY r.created_at DESC`
      )
      .all(req.params.breweryId);

    // Aggregate average rating alongside the list.
    const { avg, count } = await db
      .prepare(
        'SELECT AVG(rating) AS avg, COUNT(*) AS count FROM reviews WHERE brewery_id = ?'
      )
      .get(req.params.breweryId);

    res.json({
      data: rows,
      averageRating: avg != null ? Number(avg.toFixed(2)) : null,
      count,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/reviews
 * Protected: one review per user per brewery (UNIQUE constraint enforces it).
 * Body: { brewery_id, rating, comment? }
 */
router.post('/', auth, async (req, res, next) => {
  try {
    const { brewery_id, rating, comment } = req.body;
    if (!brewery_id || rating == null) {
      const err = new Error('brewery_id and rating are required');
      err.status = 400;
      throw err;
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      const err = new Error('Rating must be an integer between 1 and 5');
      err.status = 400;
      throw err;
    }

    const brewery = await db.prepare('SELECT id FROM breweries WHERE id = ?').get(brewery_id);
    if (!brewery) {
      const err = new Error('Brewery not found');
      err.status = 404;
      throw err;
    }

    const info = await db
      .prepare(
        'INSERT INTO reviews (user_id, brewery_id, rating, comment) VALUES (?, ?, ?, ?)'
      )
      .run(req.user.id, brewery_id, numericRating, comment || null);

    const review = await db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ review });
  } catch (err) {
    // UNIQUE(user_id, brewery_id) violation -> already reviewed.
    if (err.code === '23505') {
      err.status = 409;
      err.message = 'You have already reviewed this brewery';
    }
    next(err);
  }
});

module.exports = router;
