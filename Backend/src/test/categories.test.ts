import request from "supertest";
import app from "../app";
import pool from "../wrapper";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

jest.mock("../wrapper", () => ({
  __esModule: true,
  default: { query: jest.fn(), getConnection: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

const makeToken = (role: "user" | "admin") =>
  jwt.sign({ user_id: 1, email: "x@x.com", role }, JWT_SECRET, { expiresIn: "1h" });

const adminToken = makeToken("admin");
const userToken = makeToken("user");

const fakeCategory = { category_id: 1, name: "Parfümök" };

beforeEach(() => jest.clearAllMocks());



describe("GET /api/categories", () => {
  it("200 – visszaadja az összes kategóriát", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeCategory, { category_id: 2, name: "Dezodorok" }]]);

    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it("200 – üres lista ha nincs kategória", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(500);
  });
});



describe("GET /api/categories/:id", () => {
  it("200 – létező kategória visszaadása", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeCategory]]);

    const res = await request(app).get("/api/categories/1");

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ category_id: 1 });
  });

  it("404 – nem létező ID", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/categories/9999");

    expect(res.status).toBe(404);
  });

  it("400 – nem szám ID (NaN)", async () => {
    const res = await request(app).get("/api/categories/abc");
    expect(res.status).toBe(400);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app).get("/api/categories/1");

    expect(res.status).toBe(500);
  });
});



describe("POST /api/categories", () => {
  it("200 – admin sikeresen létrehozza a kategóriát", async () => {
    mockedQuery.mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Új Kategória" });

    expect(res.status).toBe(200);
    expect(res.body).toBe(3);
  });

  it("400 – hiányzó name", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("400 – üres string name", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "   " });

    expect(res.status).toBe(400);
  });

  it("400 – duplikált kategória név (ER_DUP_ENTRY)", async () => {
    const dupErr = Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" });
    mockedQuery.mockRejectedValueOnce(dupErr);

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Parfümök" });

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/már létezik/i);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).post("/api/categories").send({ name: "Új" });
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem hozhat létre kategóriát", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Új" });

    expect(res.status).toBe(403);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Új" });

    expect(res.status).toBe(500);
  });
});


describe("PUT /api/categories/:id", () => {
  it("200 – admin frissíti a kategóriát", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Frissített Név" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ category_id: 1, name: "Frissített Név" });
  });

  it("404 – nem létező kategória frissítése", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .put("/api/categories/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Valami" });

    expect(res.status).toBe(404);
  });

  it("400 – hiányzó name", async () => {
    const res = await request(app)
      .put("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("400 – üres string name", async () => {
    const res = await request(app)
      .put("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "" });

    expect(res.status).toBe(400);
  });

  it("400 – duplikált név (ER_DUP_ENTRY)", async () => {
    const dupErr = Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" });
    mockedQuery.mockRejectedValueOnce(dupErr);

    const res = await request(app)
      .put("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Parfümök" });

    expect(res.status).toBe(400);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).put("/api/categories/1").send({ name: "X" });
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem módosíthat", async () => {
    const res = await request(app)
      .put("/api/categories/1")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "X" });

    expect(res.status).toBe(403);
  });
});


describe("DELETE /api/categories/:id", () => {
  it("200 – admin törli a kategóriát", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/törölve/i);
  });

  it("404 – nem létező kategória törlése", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .delete("/api/categories/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("400 – kategóriához tartozik termék (ER_ROW_IS_REFERENCED_2)", async () => {
    const refErr = Object.assign(new Error("fk"), { code: "ER_ROW_IS_REFERENCED_2" });
    mockedQuery.mockRejectedValueOnce(refErr);

    const res = await request(app)
      .delete("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/termék/i);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).delete("/api/categories/1");
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem törölhet", async () => {
    const res = await request(app)
      .delete("/api/categories/1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("500 – DB hiba törlés közben", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .delete("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
  });
});