const express = require('express');
const request = require('supertest');
const nodemailer = require('nodemailer');
const emailRoute = require('./email.route');

jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn();
  return {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock,
    })),
  };
});

const sendMailMock = nodemailer.createTransport().sendMail;

describe('Email Route', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/send-email', emailRoute);

    sendMailMock.mockClear();
  });

  it('should send an email successfully', async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(null, { response: 'Email sent successfully' });
    });

    // Make a POST request to the /send-email route
    const response = await request(app)
    .post('/send-email')
    .send({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!',
    });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Email sent');
    expect(sendMailMock).toHaveBeenCalledTimes(1); // Ensure sendMail was called
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'john@example.com',
        to: process.env.FORWARD_EMAIL_USER,
        subject: 'Web Portfolio message from John Doe',
        text: 'Hello!. \n\nEmail: john@example.com',
      }),
      expect.any(Function)
    );
  });

  it('should return an error if there is an error sending the email', async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(new Error('Email sending error'), null);
    });

    const response = await request(app)
      .post('/send-email')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello!',
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error sending email');
  });
});