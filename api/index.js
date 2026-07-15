const serverless = require('serverless-http');
const { app } = require('../server/server');

// Vercel serverless handler
module.exports = serverless(app);

// Support direct local execution
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Beer Road Save API listening on http://localhost:${PORT}`);
  });
}
