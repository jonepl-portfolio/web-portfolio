const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const REQUIRED_ENV_VARS = ['SERVICE', 'EMAIL_USER', 'EMAIL_PASS', 'FORWARD_EMAIL_USER'];
const SECRETS_PATH = '/run/secrets/mail_server_secret';
const CONFIG_PATH = '/run/config/mail_server_config';

// Load environment variables
function loadEnv() {
  loadEnvFromFile(SECRETS_PATH);
  loadEnvFromFile(CONFIG_PATH);
  process.env["NODE_ENV"] = process.env.NODE_ENV || 'production';
};

function loadEnvFromFile(filePath) {

  if (process.env.NODE_ENV === 'development') {
    return;
  }

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

      // Check for missing required environment variables
      const missingVars = REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);
      if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

    } else {
      console.warn(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

module.exports = loadEnv;
