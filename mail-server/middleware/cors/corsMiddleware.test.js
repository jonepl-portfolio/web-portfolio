// /tests/middleware.test.js
const request = require('supertest');
const express = require('express');
const applyCorsMiddleware = require('./corsMiddleware');

describe('CORS Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    applyCorsMiddleware(app); // Apply middleware to the app
    app.get('/test', (req, res) => res.status(200).send('OK'));
  });

  it('should apply CORS headers to the response', async () => {
    const response = await request(app).get('/test');

    // Check if the response contains CORS headers
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
