

describe("Frontend: Navigáció és Főoldal", () => {

  beforeEach(() => {
    cy.visit("/");
  });


  describe("Főoldal betöltés", () => {
    it("az oldal betölt, a navigáció látható", () => {
      cy.get(".navigation").should("be.visible");
      cy.get(".logo").should("contain", "OXI ESSENCE");
    });

    it("a hero szekció megjelenik", () => {
      cy.get(".hero").should("be.visible");
    });

    it("a termék szekció megjelenik", () => {
      cy.get(".product-section").should("be.visible");
    });

    it("a title helyes", () => {
      cy.title().should("not.be.empty");
    });
  });


  describe("Nav linkek", () => {
    it("Parfümök link a helyes oldalra navigál", () => {
      cy.get(".nav-links a").contains("PARFÜM").click();
      cy.url().should("include", "/parfumok");
    });

    it("Dezodorok link működik", () => {
      cy.get(".nav-links a").contains("DEZO").click();
      cy.url().should("include", "/dezodorok");
    });

    it("Kollekciók link működik", () => {
      cy.get(".nav-links a").contains("KOLLEKCI").click();
      cy.url().should("include", "/kollekciok");
    });

    it("Rólunk link működik", () => {
      cy.get(".nav-links a").contains("RÓLUNK").click();
      cy.url().should("include", "/rolunk");
    });

    it("Főoldal logóra kattintva visszatér a főoldalra", () => {
      cy.visit("/parfumok");
      cy.get(".logo").click();
      cy.url().should("eq", Cypress.config("baseUrl") + "/");
    });
  });


  describe("Auth gombok (kijelentkezett állapot)", () => {
    it("a Bejelentkezés gomb megjelenik", () => {
      cy.get(".login-btn").first().should("be.visible");
    });

    it("Bejelentkezés gombra kattintva /login-re navigál", () => {
      cy.get(".login-btn").contains("BEJELENTKEZÉS").click();
      cy.url().should("include", "/login");
    });

    it("Regisztráció gombra kattintva /register-re navigál", () => {
      cy.visit("/");
      cy.get(".login-btn").contains("REGISZTR").click();
      cy.url().should("include", "/register");
    });
  });


  describe("Kosár ikon", () => {
    it("kosár gomb látható", () => {
      cy.get(".icon-btn").should("be.visible");
    });

    it("bejelentkezés nélkül kosárra kattintva /login-re irányít", () => {
      cy.get(".icon-btn").click();
      cy.url().should("include", "/login");
    });
  });


  describe("Reszponzivitás", () => {
    it("mobilon a hamburger menü látható", () => {
      cy.viewport(375, 812);
      cy.visit("/");
      cy.get(".hamburger").should("be.visible");
      cy.get(".nav-links").should("not.have.class", "open");
    });

    it("hamburger kattintásra megnyílik a menü", () => {
      cy.viewport(375, 812);
      cy.visit("/");
      cy.get(".hamburger").click();
      cy.get(".nav-links").should("have.class", "open");
    });

    it("menüből linkre kattintva a menü bezárul", () => {
      cy.viewport(375, 812);
      cy.visit("/");
      cy.get(".hamburger").click();
      cy.get(".nav-links.open a").contains("PARFÜM").click();
      cy.url().should("include", "/parfumok");
      cy.get(".nav-links").should("not.have.class", "open");
    });

    it("tableten (768px) az oldal megjeleníthető", () => {
      cy.viewport(768, 1024);
      cy.visit("/");
      cy.get(".navigation").should("be.visible");
    });
  });
});
