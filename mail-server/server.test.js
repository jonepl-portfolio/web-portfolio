const request = require('supertest');
const app = require('./server');

jest.mock('./routes/email.route', () => {
  const router = require('express').Router();
  router.post('/', (req, res) => res.status(200).send('Email route reached'));
  return router;
});

jest.mock('./utils/envHelper', () => {
  return jest.fn();
});

describe('sever', () => {
  it('should forward requests to the /send-email route', async () => {
    const response = await request(app)
      .post('/send-email')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, world!',
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Email route reached');
  });
});
