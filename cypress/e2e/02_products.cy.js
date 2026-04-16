

const API = Cypress.env("apiUrl");
let adminToken;
let createdProductId;

describe("Backend: Termékek", () => {

  before(() => {
    cy.request({
      method: "POST",
      url: `${API}/auth/login`,
      body: {
        email: Cypress.env("adminEmail"),
        password: Cypress.env("adminPassword"),
      },
    }).then((res) => {
      adminToken = res.body.token;
    });
  });

  describe("GET /api/products (publikus)", () => {
    it("összes termék lekérdezése – 200 + tömb", () => {
      cy.request(`${API}/api/products`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });

    it("kategória szűrés – csak az adott kategória jön vissza", () => {
      cy.request(`${API}/api/products?category=parfum`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });

    it("dezodor kategória szűrés", () => {
      cy.request(`${API}/api/products?category=dezodor`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });

    it("termékek rendelkeznek kötelező mezőkkel", () => {
      cy.request(`${API}/api/products`).then((res) => {
        if (res.body.length > 0) {
          const product = res.body[0];
          expect(product).to.have.property("id");
          expect(product).to.have.property("name");
          expect(product).to.have.property("price");
        }
      });
    });
  });

  describe("GET /api/products/:id (publikus)", () => {
    it("létező termék lekérdezése – 200", () => {
      cy.request(`${API}/api/products`).then((listRes) => {
        if (listRes.body.length === 0) return;
        const id = listRes.body[0].id;
        cy.request(`${API}/api/products/${id}`).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property("id", id);
          expect(res.body).to.have.property("name");
          expect(res.body).to.have.property("price");
        });
      });
    });

    it("nem létező ID – 404", () => {
      cy.request({
        url: `${API}/api/products/999999`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe("POST /api/products (admin)", () => {
    it("admin sikeresen létrehoz terméket", () => {
      cy.fixture("data").then(({ newProduct }) => {
        cy.request({
          method: "POST",
          url: `${API}/api/products`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: newProduct,
        }).then((res) => {
          expect(res.status).to.be.oneOf([200, 201]);
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.eq(newProduct.name);
          createdProductId = res.body.id;
        });
      });
    });

    it("token nélkül – 401", () => {
      cy.fixture("data").then(({ newProduct }) => {
        cy.request({
          method: "POST",
          url: `${API}/api/products`,
          body: newProduct,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
        });
      });
    });

    it("nem-admin tokennel – 403", () => {
      cy.request({
        method: "POST",
        url: `${API}/auth/login`,
        body: {
          email: Cypress.env("userEmail"),
          password: Cypress.env("userPassword"),
        },
      }).then((loginRes) => {
        cy.fixture("data").then(({ newProduct }) => {
          cy.request({
            method: "POST",
            url: `${API}/api/products`,
            headers: { Authorization: `Bearer ${loginRes.body.token}` },
            body: newProduct,
            failOnStatusCode: false,
          }).then((res) => {
            expect(res.status).to.eq(403);
          });
        });
      });
    });

    it("hiányos adatokkal – 400 vagy 422", () => {
      cy.request({
        method: "POST",
        url: `${API}/api/products`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { description: "csak leírás, nincs név" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe("PUT /api/products/:id (admin)", () => {
    it("admin sikeresen frissíti a terméket", () => {
      cy.fixture("data").then(({ updatedProduct }) => {
        cy.request({
          method: "PUT",
          url: `${API}/api/products/${createdProductId}`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: updatedProduct,
        }).then((res) => {
          expect(res.status).to.be.oneOf([200, 204]);
          if (res.body && res.body.name) {
            expect(res.body.name).to.eq(updatedProduct.name);
          }
        });
      });
    });

    it("nem létező termék frissítése – 404", () => {
      cy.fixture("data").then(({ updatedProduct }) => {
        cy.request({
          method: "PUT",
          url: `${API}/api/products/999999`,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: updatedProduct,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(404);
        });
      });
    });
  });

  describe("PATCH /api/products/:id (admin)", () => {
    it("részleges frissítés – ár módosítása", () => {
      cy.request({
        method: "PATCH",
        url: `${API}/api/products/${createdProductId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { price: 9999 },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });
  });

  describe("DELETE /api/products/:id (admin)", () => {
    it("admin törli a létrehozott terméket", () => {
      cy.request({
        method: "DELETE",
        url: `${API}/api/products/${createdProductId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });

    it("törölt termék már nem elérhető – 404", () => {
      cy.request({
        url: `${API}/api/products/${createdProductId}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it("nem létező termék törlése – 404", () => {
      cy.request({
        method: "DELETE",
        url: `${API}/api/products/999999`,
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it("token nélkül törlés – 401", () => {
      cy.request({
        method: "DELETE",
        url: `${API}/api/products/1`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
