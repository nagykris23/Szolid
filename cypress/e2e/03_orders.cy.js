

const API = Cypress.env("apiUrl");
let adminToken;
let userToken;
let createdOrderId;
let firstProductId;

describe("Backend: Rendelések", () => {

  before(() => {
    cy.request({
      method: "POST",
      url: `${API}/auth/login`,
      body: { email: Cypress.env("adminEmail"), password: Cypress.env("adminPassword") },
    }).then((res) => { adminToken = res.body.token; });

    
    cy.request({
      method: "POST",
      url: `${API}/auth/login`,
      body: { email: Cypress.env("userEmail"), password: Cypress.env("userPassword") },
    }).then((res) => { userToken = res.body.token; });

    cy.request(`${API}/api/products`).then((res) => {
      if (res.body.length > 0) firstProductId = res.body[0].id;
    });
  });

  describe("POST /api/orders", () => {
    it("bejelentkezett user rendelést tud leadni", () => {
      if (!firstProductId) return;
      cy.request({
        method: "POST",
        url: `${API}/api/orders`,
        headers: { Authorization: `Bearer ${userToken}` },
        body: {
          items: [{ product_id: firstProductId, quantity: 1 }],
          shipping_address: "Teszt utca 1, Budapest",
          total_amount: 4990,
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.have.property("id");
        createdOrderId = res.body.id;
      });
    });

    it("token nélkül – 401", () => {
      cy.request({
        method: "POST",
        url: `${API}/api/orders`,
        body: { items: [], shipping_address: "x" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it("üres items lista – 400 vagy 422", () => {
      cy.request({
        method: "POST",
        url: `${API}/api/orders`,
        headers: { Authorization: `Bearer ${userToken}` },
        body: { items: [], shipping_address: "Teszt utca" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe("GET /api/orders/my", () => {
    it("user látja saját rendeléseit", () => {
      cy.request({
        url: `${API}/api/orders/my`,
        headers: { Authorization: `Bearer ${userToken}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });

    it("token nélkül – 401", () => {
      cy.request({
        url: `${API}/api/orders/my`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /api/orders (admin)", () => {
    it("admin lekéri az összes rendelést", () => {
      cy.request({
        url: `${API}/api/orders`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });

    it("sima user nem láthatja az összes rendelést – 403", () => {
      cy.request({
        url: `${API}/api/orders`,
        headers: { Authorization: `Bearer ${userToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });

    it("token nélkül – 401", () => {
      cy.request({
        url: `${API}/api/orders`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /api/orders/:id (admin)", () => {
    it("admin lekér egy rendelést ID szerint", () => {
      if (!createdOrderId) return;
      cy.request({
        url: `${API}/api/orders/${createdOrderId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("id", createdOrderId);
      });
    });

    it("nem létező rendelés – 404", () => {
      cy.request({
        url: `${API}/api/orders/999999`,
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe("PATCH /api/orders/:id/status (admin)", () => {
    it("admin módosítja a rendelés státuszát", () => {
      if (!createdOrderId) return;
      cy.request({
        method: "PATCH",
        url: `${API}/api/orders/${createdOrderId}/status`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { status: "processing" },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });

    it("érvénytelen státusz – 400 vagy 422", () => {
      if (!createdOrderId) return;
      cy.request({
        method: "PATCH",
        url: `${API}/api/orders/${createdOrderId}/status`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { status: "nem_letezik" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
      });
    });

    it("user nem módosíthatja – 403", () => {
      if (!createdOrderId) return;
      cy.request({
        method: "PATCH",
        url: `${API}/api/orders/${createdOrderId}/status`,
        headers: { Authorization: `Bearer ${userToken}` },
        body: { status: "shipped" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("PATCH /api/orders/:id/payment (admin)", () => {
    it("admin frissíti a fizetési státuszt", () => {
      if (!createdOrderId) return;
      cy.request({
        method: "PATCH",
        url: `${API}/api/orders/${createdOrderId}/payment`,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { payment_status: "paid" },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });
  });

  describe("DELETE /api/orders/:id (admin)", () => {
    it("admin törli a rendelést", () => {
      if (!createdOrderId) return;
      cy.request({
        method: "DELETE",
        url: `${API}/api/orders/${createdOrderId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
      });
    });

    it("törölt rendelés már nem elérhető – 404", () => {
      if (!createdOrderId) return;
      cy.request({
        url: `${API}/api/orders/${createdOrderId}`,
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it("user nem törölhet rendelést – 403", () => {
      cy.request({
        method: "DELETE",
        url: `${API}/api/orders/1`,
        headers: { Authorization: `Bearer ${userToken}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });
});
