'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { initializeDatabase, db } = require('./database/db');
const authRoutes = require('./routes/auth');
const breweryRoutes = require('./routes/breweries');
const tripRoutes = require('./routes/trips');
const favoriteRoutes = require('./routes/favorites');
const reviewRoutes = require('./routes/reviews');
const beerRoutes = require('./routes/beers');
const challengeRoutes = require('./routes/challenges');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3001;
// Frontend dev server (Vite default).
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Aggregate dashboard stats ---
app.get('/api/stats', async (req, res, next) => {
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

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/breweries', breweryRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/beers', beerRoutes);
app.use('/api/challenges', challengeRoutes);

// Serve a basic static client build if present (optional production asset).
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// --- Error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize DB then start server.
async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Beer Road Save API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
