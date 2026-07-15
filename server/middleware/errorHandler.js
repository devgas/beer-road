'use strict';

/**
 * 404 handler for unmatched routes. Must be registered after all routers.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

/**
 * Centralized error handler. Pulls a numeric `status` off thrown errors so
 * route code can signal HTTP semantics (e.g. 409, 400) via `err.status`.
 * The 4-arg signature is required for Express to treat this as an error handler.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) {
    // Log server-side failures for observability; avoid leaking internals to client.
    console.error('[error]', err);
  }
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = { notFoundHandler, errorHandler };
