

const API = Cypress.env("apiUrl");
const TS = Date.now(); 

describe("Backend: Autentikáció", () => {

 
  describe("POST /auth/register", () => {
    it("sikeres regisztráció – 200 + token visszaad", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/register`,
        body: {
          name: "Cypress User",
          email: `cypress_${TS}@test.com`,
          password: "cypress123",
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");
        expect(res.body.user).to.have.property("email");
      });
    });

    it("hiányzó mezők – 400 hibakód", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/register`,
        body: { email: `missing_${TS}@test.com` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
      });
    });

    it("már létező email – 409 vagy 400", () => {
      const email = `cypress_${TS}@test.com`;
      
      cy.request({
        method: "POST",
        url: `${API}/auth/register`,
        body: { name: "Dup User", email, password: "test123" },
        failOnStatusCode: false,
      });
     
      cy.request({
        method: "POST",
        url: `${API}/auth/register`,
        body: { name: "Dup User", email, password: "test123" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 409, 422]);
      });
    });
  });

  
  describe("POST /auth/login", () => {
    it("helyes adatokkal – 200 + JWT token", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/login`,
        body: {
          email: Cypress.env("adminEmail"),
          password: Cypress.env("adminPassword"),
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("token").and.be.a("string");
        expect(res.body.token.split(".")).to.have.length(3); // JWT formátum
        expect(res.body).to.have.property("user");
        expect(res.body.user).to.have.property("role");
      });
    });

    it("rossz jelszó – 401", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/login`,
        body: { email: Cypress.env("adminEmail"), password: "rossz_jelszo" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it("nem létező email – 401 vagy 404", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/login`,
        body: { email: "nemletezik@test.com", password: "valami" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([401, 404]);
      });
    });

    it("üres body – 400 vagy 422", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/login`,
        body: {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 401, 422]);
      });
    });
  });

  
  describe("GET /auth/me", () => {
    it("érvényes tokennel – 200 + user adat", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/login`,
        body: {
          email: Cypress.env("adminEmail"),
          password: Cypress.env("adminPassword"),
        },
      }).then((loginRes) => {
        const token = loginRes.body.token;
        cy.request({
          method: "GET",
          url: `${API}/auth/me`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property("user");
        });
      });
    });

    it("token nélkül – 401", () => {
      cy.request({
        method: "GET",
        url: `${API}/auth/me`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it("érvénytelen token – 401", () => {
      cy.request({
        method: "GET",
        url: `${API}/auth/me`,
        headers: { Authorization: "Bearer ez_nem_valid_jwt" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
