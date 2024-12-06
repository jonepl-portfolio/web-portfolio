const rateLimit = require('express-rate-limit');

const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many email requests from this IP, please try again later.'
});

module.exports = emailRateLimiter;