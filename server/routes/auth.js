'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { db } = require('../database/db');
const { auth, generateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { email, password, name }
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.status = 400;
      throw err;
    }
    if (String(password).length < 6) {
      const err = new Error('Password must be at least 6 characters');
      err.status = 400;
      throw err;
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      const err = new Error('Email already registered');
      err.status = 409;
      throw err;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const info = await db
      .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
      .run(normalizedEmail, passwordHash, name ? String(name).trim() : null);

    const user = await db
      .prepare('SELECT id, email, name, created_at FROM users WHERE id = ?')
      .get(info.lastInsertRowid);

    res.status(201).json({ token: generateToken(user), user });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.status = 400;
      throw err;
    }

    const user = await db
      .prepare('SELECT id, email, name, password_hash FROM users WHERE email = ?')
      .get(String(email).toLowerCase().trim());
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    const safeUser = { id: user.id, email: user.email, name: user.name };
    res.json({ token: generateToken(safeUser), user: safeUser });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile.
 */
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await db
      .prepare('SELECT id, email, name, created_at FROM users WHERE id = ?')
      .get(req.user.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
