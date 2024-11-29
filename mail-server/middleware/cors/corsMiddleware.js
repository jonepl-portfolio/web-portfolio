const cors = require('cors');

// Apply CORS middleware
function applyCorsMiddleware(app) {
  app.use(cors());
  app.use((req, res, next) => {
    console.log('CORS Middleware Applied:', res.getHeaders());
    next();
  });
};

module.exports = applyCorsMiddleware;
