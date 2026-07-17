'use strict';

const express = require('express');
const { db } = require('../database/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

function normalizeRating(rating) {
  const numericRating = Number(rating ?? 5);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    const err = new Error('Rating must be an integer between 1 and 5');
    err.status = 400;
    throw err;
  }
  return numericRating;
}

router.get('/', async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    let query = 'SELECT * FROM challenges WHERE is_active = 1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY points ASC';
    const challenges = await db.prepare(query).all(...params);
    res.json({ data: challenges, total: challenges.length });
  } catch (err) {
    next(err);
  }
});

router.get('/random', async (req, res, next) => {
  try {
    const challenge = await db.prepare('SELECT * FROM challenges WHERE is_active = 1 ORDER BY RANDOM() LIMIT 1').get();
    res.json({ challenge });
  } catch (err) {
    next(err);
  }
});

router.get('/my-challenges', auth, async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT uc.*, c.title, c.description, c.difficulty, c.points, c.category, c.image_url
      FROM user_challenges uc
      JOIN challenges c ON uc.challenge_id = c.id
      WHERE uc.user_id = ?
    `;
    const params = [req.user.id];

    if (status) {
      query += ' AND uc.status = ?';
      params.push(status);
    }

    query += ' ORDER BY uc.created_at DESC';
    const rows = await db.prepare(query).all(...params);
    res.json({ data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
});

router.get('/meta/categories', async (req, res, next) => {
  try {
    const categories = await db.prepare('SELECT DISTINCT category FROM challenges WHERE is_active = 1 ORDER BY category ASC').all();
    res.json(categories.map((c) => c.category));
  } catch (err) {
    next(err);
  }
});

router.post('/:id/accept', auth, async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;

    const challenge = await db.prepare('SELECT id FROM challenges WHERE id = ? AND is_active = 1').get(challengeId);
    if (!challenge) {
      const err = new Error('Challenge not found');
      err.status = 404;
      throw err;
    }

    const existing = await db.prepare(
      'SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ?'
    ).get(userId, challengeId);

    if (existing) {
      const err = new Error('You have already accepted this challenge');
      err.status = 400;
      throw err;
    }

    const info = await db.prepare(
      "INSERT INTO user_challenges (user_id, challenge_id, status) VALUES (?, ?, 'pending')"
    ).run(userId, challengeId);

    const userChallenge = await db.prepare(
      'SELECT * FROM user_challenges WHERE id = ?'
    ).get(info.lastInsertRowid);

    res.status(201).json({ userChallenge });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/complete', auth, async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;
    const { proof_image_url, review, brewery_id } = req.body;

    const userChallenge = await db.prepare(
      'SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ? AND status = ?'
    ).get(userId, challengeId, 'pending');

    if (!userChallenge) {
      const err = new Error('Challenge not found or already completed');
      err.status = 404;
      throw err;
    }

    if (review && brewery_id) {
      const brewery = await db.prepare('SELECT id FROM breweries WHERE id = ?').get(brewery_id);
      if (!brewery) {
        const err = new Error('Brewery not found');
        err.status = 404;
        throw err;
      }

      const rating = normalizeRating(review.rating);
      const comment = review.comment || '';
      const existingReview = await db
        .prepare('SELECT id FROM reviews WHERE user_id = ? AND brewery_id = ?')
        .get(userId, brewery_id);

      if (existingReview) {
        await db.prepare(
          'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?'
        ).run(rating, comment, existingReview.id);
      } else {
        await db.prepare(
          'INSERT INTO reviews (user_id, brewery_id, rating, comment) VALUES (?, ?, ?, ?)'
        ).run(userId, brewery_id, rating, comment);
      }
    }

    await db.prepare(
      "UPDATE user_challenges SET status = 'completed', proof_image_url = ?, review = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(proof_image_url || null, review?.comment || null, userChallenge.id);

    const updated = await db.prepare('SELECT * FROM user_challenges WHERE id = ?').get(userChallenge.id);
    res.json({ userChallenge: updated });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const challenge = await db.prepare('SELECT * FROM challenges WHERE id = ?').get(req.params.id);
    if (!challenge) {
      const err = new Error('Challenge not found');
      err.status = 404;
      throw err;
    }
    res.json({ challenge });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
