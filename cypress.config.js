module.exports = {
  allowCypressEnv: true,

  e2e: {
    baseUrl: "http://localhost:5174",
    env: {
      apiUrl: "http://localhost:3000",
      adminEmail: "admin@test.com",
      adminPassword: "admin123",
      userEmail: "testuser@test.com",
      userPassword: "test123",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
