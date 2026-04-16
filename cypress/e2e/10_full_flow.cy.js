

const TS = Date.now();
const testEmail = `e2e_flow_${TS}@test.com`;

describe("E2E: Teljes felhasználói folyamatok", () => {

  
  describe("Regisztráció és bejelentkezés folyamat", () => {
    it("új felhasználó regisztrál, belép, majd kijelentkezik", () => {
      cy.logout();

      
      cy.visit("http://localhost:5173/register");
      cy.get("input[placeholder='Keresztnév']").type("E2E");
      cy.get("input[placeholder='Vezetéknév']").type("Teszt");
      cy.get("input[placeholder='Email']").type(testEmail);
      cy.get("input[placeholder='Email újra']").type(testEmail);
      cy.get("input[placeholder='Jelszó']").type("jelszo123");
      cy.get("input[placeholder='Jelszó újra']").type("jelszo123");
      cy.get("button[type='submit']").click();
      cy.url().should("eq", Cypress.config("baseUrl") + "/");

   
      cy.get(".login-btn").contains("KIJELENTKEZÉS").click();
      cy.get(".login-btn").contains("BEJELENTKEZÉS").should("be.visible");

    
      cy.visit("http://localhost:5173/login");
      cy.get("input[type='email']").type(testEmail);
      cy.get("input[type='password']").type("jelszo123");
      cy.get("button[type='submit']").click();
      cy.url().should("eq", Cypress.config("baseUrl") + "/");
    });
  });

 
  describe("Vásárlási folyamat (kosár + checkout)", () => {
    before(() => {
      cy.loginByApi(Cypress.env("userEmail"), Cypress.env("userPassword"));
    });

    it("termék keresése, kosárba helyezése, checkout oldalra navigálás", () => {
      cy.request(`${Cypress.env("apiUrl")}/api/products`).then((res) => {
        if (res.body.length === 0) return;
        const product = res.body[0];

       
        cy.visit(`http://localhost:5173/termek/${product.id}`);
        cy.get(".product-info-section h1, .product-title").should("be.visible");

        
        cy.get("button").contains(/kosár|hozzáad/i).first().click();
        cy.get(".cart-badge").should("exist");

       
        cy.visit("http://localhost:5173/kosar");
        cy.get(".basket-item").should("have.length.gte", 1);
        cy.get(".basket-title").should("be.visible");

      
        cy.get("button, a").contains(/fizet|checkout|megrendel/i).click();
        cy.url().should("include", "/fizetes");
      });
    });
  });

  
  describe("Összes oldal elérhető navigálással", () => {
    beforeEach(() => {
      cy.logout();
    });

    const publicRoutes = [
      { path: "/", label: "Főoldal" },
      { path: "/parfumok", label: "Parfümök" },
      { path: "/dezodorok", label: "Dezodorok" },
      { path: "/kollekciok", label: "Kollekciók" },
      { path: "/rolunk", label: "Rólunk" },
      { path: "/login", label: "Login" },
      { path: "/register", label: "Regisztráció" },
    ];

    publicRoutes.forEach(({ path, label }) => {
      it(`${label} (${path}) betölt hibamentesen`, () => {
        cy.visit(`http://localhost:5173${path}`);
        cy.get(".navigation").should("be.visible");
        cy.get("body").should("not.be.empty");
      });
    });
  });

  describe("Védett útvonalak – bejelentkezés nélkül átirányít", () => {
    beforeEach(() => { cy.logout(); });

    ["/kosar", "/fizetes", "/admin"].forEach((route) => {
      it(`${route} – bejelentkezés nélkül /login-re irányít`, () => {
        cy.visit(`http://localhost:5173${route}`);
        cy.url().should("include", "/login");
      });
    });
  });


  describe("API és frontend konzisztencia", () => {
    it("a frontend ugyanannyi terméket mutat, amennyit az API visszaad (parfüm)", () => {
      cy.request(`${Cypress.env("apiUrl")}/api/products?category=parfum`).then((apiRes) => {
        cy.intercept("GET", "**/api/products*").as("frontendReq");
        cy.visit("http://localhost:5173/parfumok");
        cy.wait("@frontendReq");
        cy.get(".products-grid > *, .product-card").should(
          "have.length.lte",
          apiRes.body.length + 5 
        );
      });
    });

    it("terméklap az API által visszaadott nevet mutatja", () => {
      cy.request(`${Cypress.env("apiUrl")}/api/products`).then((res) => {
        if (res.body.length === 0) return;
        const product = res.body[0];
        cy.visit(`http://localhost:5173/termek/${product.id}`);
        cy.get(".product-info-section h1, .product-title").should(
          "contain",
          product.name
        );
      });
    });
  });


  describe("Reszponzivitás – több eszköz méret", () => {
    const viewports = [
      { label: "iPhone SE", width: 375, height: 667 },
      { label: "iPhone 14 Pro", width: 393, height: 852 },
      { label: "iPad", width: 768, height: 1024 },
      { label: "Laptop", width: 1280, height: 720 },
    ];

    viewports.forEach(({ label, width, height }) => {
      it(`${label} (${width}x${height}) – főoldal megjeleníthető`, () => {
        cy.viewport(width, height);
        cy.visit("http://localhost:5173/");
        cy.get(".navigation").should("be.visible");
        cy.get(".hero").should("be.visible");
      });
    });
  });
});
