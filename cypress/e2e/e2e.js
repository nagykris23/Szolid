// cypress/support/e2e.js
import "./commands";

// Uncaught exception globális szuppresszió (pl. React hydration hibák tesztkörnyezetben)
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("ResizeObserver") || err.message.includes("hydrat")) {
    return false;
  }
});
