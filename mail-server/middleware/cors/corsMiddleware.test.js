const request = require('supertest');
const express = require('express');
const applyCorsMiddleware = require('./corsMiddleware');

describe('CORS Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    applyCorsMiddleware(app);
    app.get('/test', (req, res) => res.status(200).send('OK'));
  });

  it('should apply CORS headers to the response', async () => {
    const response = await request(app).get('/test');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
