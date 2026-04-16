
Cypress.Commands.add("loginByApi", (email, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/auth/login`,
    body: { email, password },
  }).then((res) => {
    expect(res.status).to.eq(200);
    window.localStorage.setItem("token", res.body.token);
    window.localStorage.setItem("user", JSON.stringify(res.body.user));
  });
});


Cypress.Commands.add("loginAsAdmin", () => {
  cy.loginByApi(Cypress.env("adminEmail"), Cypress.env("adminPassword"));
});


Cypress.Commands.add("loginAsUser", () => {
  cy.loginByApi(Cypress.env("userEmail"), Cypress.env("userPassword"));
});


Cypress.Commands.add("logout", () => {
  cy.clearLocalStorage();
});


Cypress.Commands.add("apiRequest", (method, path, body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return cy.request({
    method,
    url: `${Cypress.env("apiUrl")}${path}`,
    body,
    headers,
    failOnStatusCode: false,
  });
});


Cypress.Commands.add("getAdminToken", () => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/auth/login`,
      body: {
        email: Cypress.env("adminEmail"),
        password: Cypress.env("adminPassword"),
      },
    })
    .its("body.token");
});


Cypress.Commands.add("getUserToken", () => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/auth/login`,
      body: {
        email: Cypress.env("userEmail"),
        password: Cypress.env("userPassword"),
      },
    })
    .its("body.token");
});
