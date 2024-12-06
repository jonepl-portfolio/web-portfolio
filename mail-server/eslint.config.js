// import globals from 'globals';
const globals = require('globals');
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
      files: ["**/*.js"],
      rules: {
          semi: ["warn", "always"]
      },
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.jest,
          myCustomGlobal: "readonly"
      }
    }
  },
  {
    ignores: ["coverage/*"]
  }
];
