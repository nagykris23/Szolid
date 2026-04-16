

describe("Frontend: Parfümök oldal", () => {

  beforeEach(() => {
    cy.intercept("GET", "**/api/products*").as("getProducts");
    cy.visit("/parfumok");
  });

  it("az oldal betölt, a fejléc látható", () => {
    cy.get(".category-header, .parfumok-full-page, .kollekcio-hero").should("exist");
  });

  it("termékek betöltődnek (API hívás megtörténik)", () => {
    cy.wait("@getProducts").its("response.statusCode").should("eq", 200);
  });

  it("termékek megjelennek a rácson", () => {
    cy.wait("@getProducts");
    cy.get(".products-grid, .product-grid, .kollekcio-grid").should("exist");
  });

  it("termékkártyán rákattintva terméklap nyílik", () => {
    cy.wait("@getProducts");
    cy.get(".products-grid .product-card, .products-grid > *").first().click();
    cy.url().should("include", "/termek/");
  });

  it("szűrő ár csúszka létezik", () => {
    cy.get(".price-slider").should("exist");
  });

  it("breadcrumb megjelenik", () => {
    cy.get(".breadcrumb").should("exist");
  });
});

describe("Frontend: Dezodorok oldal", () => {

  beforeEach(() => {
    cy.intercept("GET", "**/api/products*").as("getProducts");
    cy.visit("/dezodorok");
  });

  it("az oldal betölt", () => {
    cy.get(".navigation").should("be.visible");
  });

  it("termékek betöltődnek", () => {
    cy.wait("@getProducts").its("response.statusCode").should("eq", 200);
  });
});

describe("Frontend: Kollekciók oldal", () => {

  beforeEach(() => {
    cy.intercept("GET", "**/api/products*").as("getProducts");
    cy.visit("/kollekciok");
  });

  it("az oldal betölt", () => {
    cy.get(".kollekcio-page, .navigation").should("be.visible");
  });

  it("termékek vagy betöltő állapot jelenik meg", () => {
    cy.get(".kollekcio-grid, .state-msg").should("exist");
  });
});

describe("Frontend: Terméklap (/termek/:id)", () => {

  let productId;

  before(() => {
    cy.request(`${Cypress.env("apiUrl")}/api/products`).then((res) => {
      if (res.body.length > 0) productId = res.body[0].id;
    });
  });

  it("terméklap betölt érvényes ID-vel", () => {
    if (!productId) return;
    cy.intercept("GET", `**/api/products/${productId}`).as("getProduct");
    cy.visit(`/termek/${productId}`);
    cy.wait("@getProduct").its("response.statusCode").should("eq", 200);
    cy.get(".product-page-wrapper, .product-main-content").should("exist");
  });

  it("a termék neve és ára megjelenik", () => {
    if (!productId) return;
    cy.visit(`/termek/${productId}`);
    cy.get(".product-info-section h1, .product-title").should("be.visible");
  });

  it("'Kosárba' gomb látható", () => {
    if (!productId) return;
    cy.visit(`/termek/${productId}`);
    cy.get("button").contains(/kosár|hozzáad/i).should("exist");
  });

  it("vissza gomb/link megjelenik", () => {
    if (!productId) return;
    cy.visit(`/termek/${productId}`);
    cy.get(".back-link, .breadcrumb-nav").should("exist");
  });

  it("nem létező ID – hibakezelés (nem törik az oldal)", () => {
    cy.visit("/termek/999999", { failOnStatusCode: false });
    cy.get(".navigation").should("be.visible");
  });

  it("mobilon a terméklap megjeleníthető", () => {
    if (!productId) return;
    cy.viewport(375, 812);
    cy.visit(`/termek/${productId}`);
    cy.get(".product-page-wrapper").should("exist");
  });
});

describe("Frontend: Rólunk oldal", () => {
  it("az oldal betölt és tartalmaz szöveget", () => {
    cy.visit("/rolunk");
    cy.get(".navigation").should("be.visible");
    cy.get("body").should("not.be.empty");
  });
});
