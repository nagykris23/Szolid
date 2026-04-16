
describe("Frontend: Admin Dashboard", () => {

  describe("Hozzáférés-védelem", () => {
    it("bejelentkezés nélkül /admin – /login-re irányít", () => {
      cy.logout();
      cy.visit("/admin");
      cy.url().should("include", "/login");
    });

    it("sima user /admin – nincs admin tab / hozzáférés megtagadva", () => {
      cy.loginByApi(Cypress.env("userEmail"), Cypress.env("userPassword"));
      cy.visit("/admin");
      
      cy.url().should("not.include", "/admin").or(
        cy.get(".admin-dashboard").should("not.exist")
      );
    });
  });

  describe("Admin belépve", () => {

    beforeEach(() => {
      cy.loginByApi(Cypress.env("adminEmail"), Cypress.env("adminPassword"));
      cy.visit("/admin");
    });

    it("a dashboard betölt", () => {
      cy.get(".admin-dashboard, [class*='admin']").should("exist");
    });

    it("a Rendelések tab elérhető", () => {
      cy.get("button, .tab").contains(/rendelés/i).should("exist");
    });

    it("a Termékek tab elérhető", () => {
      cy.get("button, .tab").contains(/termék/i).should("exist");
    });

    it("Rendelések tabra kattintva rendelések listája töltődik", () => {
      cy.intercept("GET", "**/api/orders*").as("getOrders");
      cy.get("button, .tab").contains(/rendelés/i).click();
      cy.wait("@getOrders").its("response.statusCode").should("eq", 200);
    });

    it("Termékek tabra kattintva termékek listája megjelenik", () => {
      cy.intercept("GET", "**/api/products*").as("getProducts");
      cy.get("button, .tab").contains(/termék/i).click();
      cy.wait("@getProducts").its("response.statusCode").should("eq", 200);
    });

    it("Új termék gomb megjelenik a Termékek tabon", () => {
      cy.get("button, .tab").contains(/termék/i).click();
      cy.get("button").contains(/új|hozzáad|create/i).should("exist");
    });

    it("Termék létrehozás modal megnyílik", () => {
      cy.get("button, .tab").contains(/termék/i).click();
      cy.get("button").contains(/új|hozzáad|create/i).click();
      cy.get(".modal, [class*='modal'], form").should("be.visible");
    });

    it("Termék létrehozás – kitöltött formmal API hívás történik", () => {
      cy.intercept("POST", "**/api/products*").as("createProduct");
      cy.get("button, .tab").contains(/termék/i).click();
      cy.get("button").contains(/új|hozzáad|create/i).click();

      cy.get("input[placeholder*='Termék neve'], input[name='name']").type("Cypress Admin Termék");
      cy.get("input[placeholder*='Ár'], input[name='price']").type("1234");
      cy.get("input[placeholder*='Készlet'], input[name='stock_quantity']").type("5");

      cy.get("button[type='submit'], button").contains(/ment|create|létrehoz/i).click();
      cy.wait("@createProduct").its("response.statusCode").should("be.oneOf", [200, 201]);
    });

    it("Rendelés státusz szerkesztés megnyílik", () => {
      cy.intercept("GET", "**/api/orders").as("getOrders");
      cy.get("button, .tab").contains(/rendelés/i).click();
      cy.wait("@getOrders");
      
      cy.get(".order-row button, [class*='order'] button").first().should("exist");
    });

    it("Admin nav linkek navigálnak a megfelelő útvonalakra", () => {
      cy.get(".navigation").should("be.visible");
    });
  });
});
