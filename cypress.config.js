const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://urban-monitoring-stg.advasmart.in",
    specPattern: "login.cy.js",
    supportFile: "cypress/support/e2e.js",
    defaultCommandTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true
  }
});
