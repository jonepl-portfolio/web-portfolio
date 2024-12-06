const fs = require('fs');
const path = require('path');

const SECRETS_PATH = '/run/secrets/mail_server_secret';
const REQUIRED_SECRET_VALS = ['EMAIL', 'EMAIL_PASS', 'FORWARDING_EMAIL'];
const CONFIG_PATH = '/run/config/mail_server_config';
const REQUIRED_CONFIG_VALS = ['SMTP_HOST', 'SMTP_PORT'];

// Load environment variables
function loadEnv() {
  loadEnvFromFile(SECRETS_PATH);
  loadEnvFromFile(CONFIG_PATH);
  validateRequiredEnvVariables();
  loadEnvDefaults();
}

function loadEnvFromFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf-8').trim();
      const lines = fileContents.split('\n');

      lines.forEach((line) => {
        // Ignore empty lines and comments
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key && value) {
            process.env[key.trim()] = value.trim();
            console.log(`Loaded environment variable ${key.trim()} from ${filePath}`);
          } else {
            console.warn(`Malformed line in ${filePath}: "${line}"`);
          }
        }
      });
    } else {
      console.warn(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

function validateRequiredEnvVariables() {
  let errors = [];

  const missingSecrets = REQUIRED_SECRET_VALS.filter((varName) => !process.env[varName]);
  const missingConfigs = REQUIRED_CONFIG_VALS.filter((varName) => !process.env[varName]);

  if (missingSecrets.length > 0) {
    errors.push(`Missing required secret environment variables: ${missingSecrets.join(', ')}`);
  }

  if (missingConfigs.length > 0) {
    errors.push(`Missing required config environment variables: ${missingConfigs.join(', ')}`);
  }

  if (missingSecrets.length > 0 || missingConfigs.length > 0) {
    if (errors.length > 0) {
      console.error(errors.join('\n'));
      throw new Error(errors.join('\n'));
    }
  } 
}

function loadEnvDefaults() {
  process.env.NODE_ENV ? 
    console.info(`NODE_ENV is set to ${process.env.NODE_ENV}`) : 
    console.info("NODE_ENV is undefined, defaulting to 'production'");

  process.env.APP_PORT ? 
    console.info(`EMAIL_PORT is set to ${process.env.APP_PORT}`) : 
    console.info("EMAIL_PORT is undefined, defaulting to 3000");

  process.env["NODE_ENV"] = process.env.NODE_ENV || 'production';
  process.env["APP_PORT"] = process.env.APP_PORT || 3000;
}

module.exports = loadEnv;
