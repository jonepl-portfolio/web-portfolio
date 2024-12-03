// Load environment variables
require('dotenv').config(); 
const loadEnv = require('./utils/envHelper');
loadEnv();

const express = require('express');
const applyCorsMiddleware = require('./middleware/cors/corsMiddleware');
const emailRateLimiter = require('./middleware/rateLimter/rateLimiter');
const sendEmailRoutes = require('./routes/email.route');


// Setting express server
const app = express();

app.use(express.json());
app.set('trust proxy', 1);

app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  next();
});

app.use((req, res, next) => {
  console.log('Request:', req.body);
  next();
});

// Middlewares
applyCorsMiddleware(app);

// Setup routes
app.use('/send-email', emailRateLimiter, sendEmailRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.EMAIL_PORT, () => {
    console.log(`Server running on port ${process.env.EMAIL_PORT}`);
  });
}

module.exports = app;