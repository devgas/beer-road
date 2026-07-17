// Vercel Node serverless functions invoke `module.exports(req, res)` natively.
// The Express app is a (req, res) => void handler, so we export it directly
// instead of wrapping in serverless-http (which hangs on Vercel's runtime).
const app = require('../server/server');
const { initializeDatabase } = require('../server/database/db');

// On Vercel the app is required without running `start()`, so we must ensure
// the database schema/seed exists (Postgres) before serving requests.
// Memoize so initialization runs at most once per function instance.
let ready;
function ensureDb() {
  if (!ready) ready = initializeDatabase().catch((err) => {
    ready = null;
    console.error('[api] database init failed:', err.message);
    throw err;
  });
  return ready;
}

module.exports = async (req, res) => {
  await ensureDb();
  return app(req, res);
};
