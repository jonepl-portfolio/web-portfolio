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

// Middlewares
applyCorsMiddleware(app);

// Setup routes
app.use('/send-email', emailRateLimiter, sendEmailRoutes);

const PORT = process.env.PORT || 3000; 
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;