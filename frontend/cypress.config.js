const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Directorio donde Cypress buscará los tests E2E
    specPattern: "cypress/e2e/**/*.cy.js",
    // Base URL de la aplicación Vue para que Cypress la use.
    baseUrl: "http://localhost:8080",
    setupNodeEvents(on, config) {
      // Implement node event functions here
    },
  },
});
