const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      apiUrl: "http://localhost:3000",
      adminEmail: "admin@oxiessence.com",
      adminPassword: "password",
      userEmail: "teszt@oxiessence.com",
      userPassword: "password",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {},
  },
});
