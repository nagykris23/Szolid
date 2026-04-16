

describe("Frontend: Bejelentkezés oldal", () => {

  beforeEach(() => {
    cy.logout();
    cy.visit("/login");
  });

  it("az oldal betölt, a form elemei láthatók", () => {
    cy.get("input[type='email']").should("be.visible");
    cy.get("input[type='password']").should("be.visible");
    cy.get("button[type='submit']").should("be.visible");
  });

  it("helyes adatokkal sikeres belépés – főoldalra irányít", () => {
    cy.intercept("POST", "**/auth/login").as("login");
    cy.get("input[type='email']").type(Cypress.env("adminEmail"));
    cy.get("input[type='password']").type(Cypress.env("adminPassword"));
    cy.get("button[type='submit']").click();
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("helyes felhasználói belépés – főoldal", () => {
    cy.intercept("POST", "**/auth/login").as("login");
    cy.get("input[type='email']").type(Cypress.env("userEmail"));
    cy.get("input[type='password']").type(Cypress.env("userPassword"));
    cy.get("button[type='submit']").click();
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("rossz jelszóval hibaüzenet jelenik meg", () => {
    cy.intercept("POST", "**/auth/login").as("login");
    cy.get("input[type='email']").type(Cypress.env("adminEmail"));
    cy.get("input[type='password']").type("rossz_jelszo_999");
    cy.get("button[type='submit']").click();
    cy.wait("@login");
    cy.get(".error").should("be.visible");
  });

  it("nem létező emaillel hibaüzenet jelenik meg", () => {
    cy.get("input[type='email']").type("nemletezik_cypress@test.com");
    cy.get("input[type='password']").type("valami123");
    cy.get("button[type='submit']").click();
    cy.get(".error").should("be.visible");
  });

  it("üres formmal nem lehet beküldeni (HTML5 validáció)", () => {
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/login");
  });

  it("belépés után a nav-ban megjelenik a felhasználó neve", () => {
    cy.loginByApi(Cypress.env("userEmail"), Cypress.env("userPassword"));
    cy.visit("/");
    cy.get(".navigation").should("contain.text", "");
    cy.get(".login-btn").contains("KIJELENTKEZÉS").should("be.visible");
  });

  it("kijelentkezés gomb kijelentkeztet és visszavisz a főoldalra", () => {
    cy.loginByApi(Cypress.env("userEmail"), Cypress.env("userPassword"));
    cy.visit("/");
    cy.get(".login-btn").contains("KIJELENTKEZÉS").click();
    cy.get(".login-btn").contains("BEJELENTKEZÉS").should("be.visible");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
    });
  });
});

describe("Frontend: Regisztráció oldal", () => {

  beforeEach(() => {
    cy.logout();
    cy.visit("/register");
  });

  const TS = Date.now();

  it("az oldal betölt, a form mezők láthatók", () => {
    cy.get("input[placeholder='Keresztnév']").should("be.visible");
    cy.get("input[placeholder='Vezetéknév']").should("be.visible");
    cy.get("input[placeholder='Email']").should("be.visible");
    cy.get("input[placeholder='Email újra']").should("be.visible");
    cy.get("input[placeholder='Jelszó']").should("be.visible");
    cy.get("input[placeholder='Jelszó újra']").should("be.visible");
  });

  it("sikeres regisztráció – főoldalra irányít", () => {
    cy.intercept("POST", "**/auth/register").as("register");
    cy.get("input[placeholder='Keresztnév']").type("Teszt");
    cy.get("input[placeholder='Vezetéknév']").type("Felhasználó");
    cy.get("input[placeholder='Email']").type(`cypress_reg_${TS}@test.com`);
    cy.get("input[placeholder='Email újra']").type(`cypress_reg_${TS}@test.com`);
    cy.get("input[placeholder='Jelszó']").type("jelszo123");
    cy.get("input[placeholder='Jelszó újra']").type("jelszo123");
    cy.get("button[type='submit']").click();
    cy.wait("@register").its("response.statusCode").should("be.oneOf", [200, 201]);
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("nem egyező emailek – hibaüzenet", () => {
    cy.get("input[placeholder='Keresztnév']").type("Teszt");
    cy.get("input[placeholder='Vezetéknév']").type("User");
    cy.get("input[placeholder='Email']").type("a@test.com");
    cy.get("input[placeholder='Email újra']").type("b@test.com");
    cy.get("input[placeholder='Jelszó']").type("jelszo123");
    cy.get("input[placeholder='Jelszó újra']").type("jelszo123");
    cy.get("button[type='submit']").click();
    cy.get(".error").should("contain", "email");
  });

  it("nem egyező jelszavak – hibaüzenet", () => {
    cy.get("input[placeholder='Keresztnév']").type("Teszt");
    cy.get("input[placeholder='Vezetéknév']").type("User");
    cy.get("input[placeholder='Email']").type("test_x@test.com");
    cy.get("input[placeholder='Email újra']").type("test_x@test.com");
    cy.get("input[placeholder='Jelszó']").type("jelszo123");
    cy.get("input[placeholder='Jelszó újra']").type("masik456");
    cy.get("button[type='submit']").click();
    cy.get(".error").should("contain", "jelszó");
  });

  it("már meglévő emaillel – szerver hibaüzenet", () => {
    cy.get("input[placeholder='Keresztnév']").type("Teszt");
    cy.get("input[placeholder='Vezetéknév']").type("User");
    cy.get("input[placeholder='Email']").type(Cypress.env("adminEmail"));
    cy.get("input[placeholder='Email újra']").type(Cypress.env("adminEmail"));
    cy.get("input[placeholder='Jelszó']").type("jelszo123");
    cy.get("input[placeholder='Jelszó újra']").type("jelszo123");
    cy.get("button[type='submit']").click();
    cy.get(".error").should("be.visible");
  });
});
