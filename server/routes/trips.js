'use strict';

const express = require('express');
const { db } = require('../database/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All trip operations are scoped to the authenticated user.
router.use(auth);

/**
 * GET /api/trips
 * List the current user's trips (without full stop details).
 */
router.get('/', async (req, res, next) => {
  try {
    const trips = await db
      .prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC')
      .all(req.user.id);
    res.json({ data: trips });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/trips/:id
 * Return a single trip with its ordered stops joined to brewery info.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const trip = await db
      .prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!trip) {
      const err = new Error('Trip not found');
      err.status = 404;
      throw err;
    }

    const stops = await db
      .prepare(
        `SELECT ts.*, b.name AS brewery_name, b.city, b.state, b.lat, b.lng, b.type AS brewery_type
         FROM trip_stops ts
         JOIN breweries b ON b.id = ts.brewery_id
         WHERE ts.trip_id = ?
         ORDER BY ts.stop_order ASC`
      )
      .all(trip.id);

    res.json({ ...trip, stops });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/trips
 * Body: { title, description?, start_date?, end_date? }
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    if (!title) {
      const err = new Error('Trip title is required');
      err.status = 400;
      throw err;
    }

    const info = await db
      .prepare(
        'INSERT INTO trips (user_id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)'
      )
      .run(req.user.id, title, description || null, start_date || null, end_date || null);

    const trip = await db.prepare('SELECT * FROM trips WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/trips/:id
 * Update mutable trip fields. Only the owner may update.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await db
      .prepare('SELECT id FROM trips WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!existing) {
      const err = new Error('Trip not found');
      err.status = 404;
      throw err;
    }

    const { title, description, start_date, end_date } = req.body;
    await db.prepare(
      `UPDATE trips
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           start_date = COALESCE(?, start_date),
           end_date = COALESCE(?, end_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(
      title != null ? title : null,
      description != null ? description : null,
      start_date != null ? start_date : null,
      end_date != null ? end_date : null,
      req.params.id
    );

    const trip = await db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    res.json({ trip });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/trips/:id
 * Cascade removes trip_stops due to the FK ON DELETE CASCADE.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const info = await db
      .prepare('DELETE FROM trips WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    if (info.changes === 0) {
      const err = new Error('Trip not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/trips/:id/stops
 * Body: { brewery_id, notes?, visited_at? }
 * The new stop is appended to the end of the current stop order.
 */
router.post('/:id/stops', async (req, res, next) => {
  try {
    const trip = await db
      .prepare('SELECT id FROM trips WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!trip) {
      const err = new Error('Trip not found');
      err.status = 404;
      throw err;
    }

    const { brewery_id, notes, visited_at } = req.body;
    if (!brewery_id) {
      const err = new Error('brewery_id is required');
      err.status = 400;
      throw err;
    }

    const brewery = await db.prepare('SELECT id FROM breweries WHERE id = ?').get(brewery_id);
    if (!brewery) {
      const err = new Error('Brewery not found');
      err.status = 404;
      throw err;
    }

    // Determine the next stop order from the highest existing one.
    const { maxOrder } = await db
      .prepare('SELECT COALESCE(MAX(stop_order), 0) AS maxOrder FROM trip_stops WHERE trip_id = ?')
      .get(req.params.id);

    const info = await db
      .prepare(
        'INSERT INTO trip_stops (trip_id, brewery_id, stop_order, notes, visited_at) VALUES (?, ?, ?, ?, ?)'
      )
      .run(req.params.id, brewery_id, maxOrder + 1, notes || null, visited_at || null);

    const stop = await db
      .prepare('SELECT * FROM trip_stops WHERE id = ?')
      .get(info.lastInsertRowid);
    res.status(201).json({ stop });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/trips/:id/stops/:stopId
 * Update notes, visited_at, or reorder via stop_order.
 */
router.put('/:id/stops/:stopId', async (req, res, next) => {
  try {
    const stop = await db
      .prepare('SELECT * FROM trip_stops WHERE id = ? AND trip_id = ?')
      .get(req.params.stopId, req.params.id);
    if (!stop) {
      const err = new Error('Stop not found');
      err.status = 404;
      throw err;
    }

    const { notes, visited_at, stop_order } = req.body;
    await db.prepare(
      `UPDATE trip_stops
       SET notes = COALESCE(?, notes),
           visited_at = COALESCE(?, visited_at),
           stop_order = COALESCE(?, stop_order)
       WHERE id = ?`
    ).run(
      notes != null ? notes : null,
      visited_at != null ? visited_at : null,
      stop_order != null ? Number(stop_order) : null,
      req.params.stopId
    );

    const updated = await db.prepare('SELECT * FROM trip_stops WHERE id = ?').get(req.params.stopId);
    res.json({ stop: updated });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/trips/:id/stops/:stopId
 */
router.delete('/:id/stops/:stopId', async (req, res, next) => {
  try {
    const info = await db
      .prepare('DELETE FROM trip_stops WHERE id = ? AND trip_id = ?')
      .run(req.params.stopId, req.params.id);
    if (info.changes === 0) {
      const err = new Error('Stop not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/trips/:id/stops/reorder
 * Body: { stops: [stopId1, stopId2, ...] }
 * Updates stop_order for each stop based on the array position.
 */
router.put('/:id/stops/reorder', async (req, res, next) => {
  try {
    const trip = await db
      .prepare('SELECT id FROM trips WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!trip) {
      const err = new Error('Trip not found');
      err.status = 404;
      throw err;
    }

    const { stops } = req.body;
    if (!Array.isArray(stops)) {
      const err = new Error('stops must be an array of stop IDs');
      err.status = 400;
      throw err;
    }

    const updateStmt = db.prepare(
      'UPDATE trip_stops SET stop_order = ? WHERE id = ? AND trip_id = ?'
    );

    for (let i = 0; i < stops.length; i++) {
      await updateStmt.run(i, stops[i], req.params.id);
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
