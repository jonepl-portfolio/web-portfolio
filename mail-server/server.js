require('dotenv').config(); 

const express = require('express');

const applyCorsMiddleware = require('./middleware/cors/corsMiddleware');
const emailRateLimiter = require('./middleware/rateLimter/rateLimiter');
const loadEnv = require('./utils/envHelper');
const sendEmailRoutes = require('./routes/email.route');

// Setting express server
const app = express();

// Load environment variables
loadEnv();

app.use(express.json());
app.set('trust proxy', 1);

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