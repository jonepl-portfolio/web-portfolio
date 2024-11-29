// loadEnv.test.js
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const loadEnv = require('./envHelper'); // Path to your loadEnv.js file

// Mock the external dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('process', () => ({
  ...jest.requireActual('process'),
  exit: jest.fn()
}));

describe('loadEnv', () => {
  const requiredEnvVars = ['SERVICE', 'EMAIL_USER', 'EMAIL_PASS', 'FORWARD_EMAIL_USER'];
  const SECRETS_PATH = '/run/secrets/mail_server_secret';
  const CONFIG_PATH = '/run/config/mail_server_config';

  beforeEach(() => {
    // Clear process.env before each test to ensure a clean environment
    requiredEnvVars.forEach((varName) => {
      delete process.env[varName];
    });
    jest.clearAllMocks();
  });

  it('should load environment variables from valid files', () => {
    // Arrange: mock fs to simulate file existence and content
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('SERVICE=value1\nEMAIL_USER=value2\nEMAIL_PASS=value3\nFORWARD_EMAIL_USER=value4');

    loadEnv();

    // Assert: verify that the environment variables are set correctly
    expect(process.env.SERVICE).toBe('value1');
    expect(process.env.EMAIL_USER).toBe('value2');
    expect(process.env.EMAIL_PASS).toBe('value3');
    expect(process.env.FORWARD_EMAIL_USER).toBe('value4');
    expect(exit).not.toHaveBeenCalled();
  });

  it('should log a warning and exit if a file does not exist', () => {
    // Arrange: mock fs to simulate file not found
    fs.existsSync.mockReturnValue(false);

    expect(() => loadEnv()).toThrow('File not found: /run/secrets/mail_server_secret');
  });

  it('should log a warning and exit if required environment variables are missing', () => {
    // Arrange: mock fs to simulate file existence and content
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('SERVICE=value1\nEMAIL_USER=value2\nEMAIL_PASS=value3');

    expect(() => loadEnv()).toThrow('Missing required environment variables: FORWARD_EMAIL_USER');
  });

  it('should log a warning if a line in the file is malformed', () => {
    // Arrange: mock fs to simulate file with malformed line
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('SERVICE=value1\nEMAIL_USER=value2\nFORWARD_EMAIL_USER= value3\nEMAIL_PASS=\n\nBAD_LINE');

    expect(() => loadEnv()).toThrow('Missing required environment variables: EMAIL_PASS');
  });

  it('should not load environment variables if NODE_ENV is "development"', () => {
    // Arrange: mock fs to simulate file existence and content
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('SERVICE=value1\nEMAIL_USER=value2\nEMAIL_PASS=value3\nFORWARD_EMAIL_USER=value4');
    process.env.NODE_ENV = 'development';

    loadEnv();

    // Assert: verify that the environment variables are not loaded in development mode
    expect(process.env.SERVICE).toBeUndefined();
    expect(process.env.EMAIL_USER).toBeUndefined();
    expect(process.env.EMAIL_PASS).toBeUndefined();
    expect(process.env.FORWARD_EMAIL_USER).toBeUndefined();
    expect(exit).not.toHaveBeenCalled();
  });
});
