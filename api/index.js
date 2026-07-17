// Vercel Node serverless functions invoke `module.exports(req, res)` natively.
// The Express app is a (req, res) => void handler, so we export it directly
// instead of wrapping in serverless-http (which hangs on Vercel's runtime).
const app = require('../server/server');

module.exports = app;
