const rateLimit = require('express-rate-limit');

// Setup rate limiter
const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many email requests from this IP, please try again later.'
});

module.exports = emailRateLimiter;
