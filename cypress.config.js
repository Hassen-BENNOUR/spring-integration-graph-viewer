const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4199',
    supportFile: 'cypress/support/e2e.js'
  }
});
