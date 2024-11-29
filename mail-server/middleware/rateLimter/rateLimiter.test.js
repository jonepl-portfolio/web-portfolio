// /tests/rateLimiter.test.js
const request = require('supertest');
const express = require('express');
const emailRateLimiter = require('./rateLimiter'); // Path to your rate limiter

describe('Rate Limiter Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/send-email', emailRateLimiter, (req, res) => res.status(200).send('Email Sent'));
  });

  it('should allow up to 5 requests in 15 minutes', async () => {
    const response = await request(app).post('/send-email');
    expect(response.status).toBe(200);

    // Simulate 5 more requests
    for (let i = 0; i < 4; i++) {
      await request(app).post('/send-email');
    }

    // Sixth request should be blocked
    const blockedResponse = await request(app).post('/send-email');
    expect(blockedResponse.status).toBe(429); // Too many requests
    expect(blockedResponse.text).toBe('Too many email requests from this IP, please try again later.');
  });
});
