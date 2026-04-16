

const API = Cypress.env("apiUrl");
let adminToken;
let createdCategoryId;

describe("Backend: Kategóriák", () => {

  before(() => {
    cy.request({
      method: "POST",
      url: `${API}/auth/login`,
      body: { email: Cypress.env("adminEmail"), password: Cypress.env("adminPassword") },
    }).then((res) => { adminToken = res.body.token; });
  });

  describe("GET /api/categories (publikus)", () => {
    it("összes kategória – 200 + tömb", () => {
      cy.request(`${API}/api/categories`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });

    it("kategóriák rendelkeznek id és name mezővel", () => {
      cy.request(`${API}/api/categories`).then((res) => {
        if (res.body.length > 0) {
          expect(res.body[0]).to.have.property("id");
          expect(res.body[0]).to.have.property("name");
        }
      });
    });
  });

  describe("GET /api/categories/:id (publikus)", () => {
    it("első kategória lekérdezése ID szerint", () => {
      cy.request(`${API}/api/categories`).then((listRes) => {
        if (listRes.body.length === 0) return;
        const id = listRes.body[0].id;
        cy.request(`${API}/api/categories/${id}`).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property("id", id);
        });
      });
    });

    it("nem létező ID – 404", () => {
      cy.request({
        url: `${API}/api/categories/999999`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe("POST /api/categories (admin)", () => {
    it("admin létrehoz kategóriát", () => {
      cy.fixture("data").then(({ newCategory }) => {
        cy.request({
          method: "POST",
          url: `${API}/api/categories`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: { ...newCategory, name: `cypress_cat_${Date.now()}` },
        }).then((res) => {
          expect(res.status).to.be.oneOf([200, 201]);
          expect(res.body).to.have.property("id");
          createdCategoryId = res.body.id;
        });
      });
    });

    it("token nélkül – 401", () => {
      cy.request({
        method: "POST",
        url: `${API}/api/categories`,
        body: { name: "valami" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it("hiányos adatokkal – 400 vagy 422", () => {
      cy.request({
        method: "POST",
        url: `${API}/api/categories`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe("PUT /api/categories/:id (admin)", () => {
    it("admin frissíti a kategóriát", () => {
      if (!createdCategoryId) return;
      cy.request({
        method: "PUT",
        url: `${API}/api/categories/${createdCategoryId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { name: "frissített_kategoria", description: "frissített" },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });

    it("nem létező kategória – 404", () => {
      cy.request({
        method: "PUT",
        url: `${API}/api/categories/999999`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { name: "x" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe("DELETE /api/categories/:id (admin)", () => {
    it("admin törli a kategóriát", () => {
      if (!createdCategoryId) return;
      cy.request({
        method: "DELETE",
        url: `${API}/api/categories/${createdCategoryId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });

    it("törölt kategória nem elérhető – 404", () => {
      if (!createdCategoryId) return;
      cy.request({
        url: `${API}/api/categories/${createdCategoryId}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it("token nélkül törlés – 401", () => {
      cy.request({
        method: "DELETE",
        url: `${API}/api/categories/1`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
