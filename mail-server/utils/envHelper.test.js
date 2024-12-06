
const fs = require('fs');
const path = require('path');
const loadEnv = require('./envHelper'); 

jest.mock('fs');
jest.mock('path');
jest.mock('process', () => ({
  ...jest.requireActual('process'),
  exit: jest.fn()
}));

describe('loadEnv', () => {
  const mockSecretFilePath = '/run/secrets/mail_server_secret';
  const mockConfigFilePath = '/run/config/mail_server_config';
  const REQUIRED_ENV_VARS = ['EMAIL', 'EMAIL_PASS', 'FORWARDING_EMAIL', 'SMTP_HOST', 'SMTP_PORT'];
  const DEFAULT_ENV_VARS = ['NODE_ENV', 'APP_PORT'];

  beforeEach(() => {
    REQUIRED_ENV_VARS.forEach((varName) => {
      delete process.env[varName];
    });
    DEFAULT_ENV_VARS.forEach((varName) => {
      delete process.env[varName];
    });
    jest.clearAllMocks();
  });

  it('should load environment variables from valid secret and config files', () => {
    path.resolve.mockImplementation((filePath) => filePath);
    fs.existsSync.mockImplementation((filePath) => [mockSecretFilePath, mockConfigFilePath].includes(filePath));
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath === mockSecretFilePath) {
        return 'EMAIL=test@example.com\nEMAIL_PASS=supersecret\nFORWARDING_EMAIL=forward@example.com';
      } else if (filePath === mockConfigFilePath) {
        return 'SMTP_HOST=smtp.example.com\nSMTP_PORT=587\nAPP_PORT=4000\nNODE_ENV=test';
      }
    });

    expect(() => loadEnv()).not.toThrow();

    expect(process.env.EMAIL).toBe('test@example.com');
    expect(process.env.EMAIL_PASS).toBe('supersecret');
    expect(process.env.FORWARDING_EMAIL).toBe('forward@example.com');
    expect(process.env.SMTP_HOST).toBe('smtp.example.com');
    expect(process.env.SMTP_PORT).toBe('587');
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.APP_PORT).toBe('4000');
  });

  it('should load default environment variables if values are not set and files', () => {
    path.resolve.mockImplementation((filePath) => filePath);
    fs.existsSync.mockImplementation((filePath) => [mockSecretFilePath, mockConfigFilePath].includes(filePath));
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath === mockSecretFilePath) {
        return 'EMAIL=test@example.com\nEMAIL_PASS=supersecret\nFORWARDING_EMAIL=forward@example.com';
      } else if (filePath === mockConfigFilePath) {
        return 'SMTP_HOST=smtp.example.com\nSMTP_PORT=587';
      }
    });

    loadEnv();

    expect(process.env.APP_PORT).toBe('3000');
    expect(process.env.NODE_ENV).toBe('production');
  });

  it('should throws an error if secrets file is missing', () => {
    fs.existsSync.mockImplementation((filePath) =>
      filePath === mockConfigFilePath
    );

    expect(() => loadEnv()).toThrow('File not found: /run/secrets/mail_server_secret');
  });

  it('should throws an error if config file is missing', () => {
    fs.existsSync.mockImplementation((filePath) =>
      filePath === mockSecretFilePath
    );

    expect(() => loadEnv()).toThrow('File not found: /run/config/mail_server_config');
  });

  it('should logs warnings for malformed lines in the files', () => {
    console.warn = jest.fn();
    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation(() =>
      'EMAIL=test@example.com\nINVALID_LINE\nSMTP_HOST'
    );

    expect(() => loadEnv()).toThrow('Missing required secret environment variables');

    expect(console.warn).toHaveBeenCalledWith(
      'Malformed line in /run/secrets/mail_server_secret: "INVALID_LINE"'
    );
    expect(console.warn).toHaveBeenCalledWith(
      'Malformed line in /run/secrets/mail_server_secret: "SMTP_HOST"'
    );
  });

  it('should log a warning if required secret environment variables are missing', () => {
    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation(() => '');

    expect(() => loadEnv()).toThrow(
      'Missing required secret environment variables: EMAIL, EMAIL_PASS, FORWARDING_EMAIL\n' +
        'Missing required config environment variables: SMTP_HOST, SMTP_PORT'
    );
  });
});
