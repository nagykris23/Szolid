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

const fakeProduct = {
  product_id: 1,
  name: "Angel",
  description: "Parfüm",
  price: 5000,
  category_id: 2,
  category_name: "Parfümök",
  stock_quantity: 10,
  image_url: null,
};

beforeEach(() => jest.clearAllMocks());


describe("GET /api/products", () => {
  it("200 – visszaadja az összes terméket", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeProduct, { ...fakeProduct, product_id: 2 }]]);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it("200 – kategória szűrővel csak az adott kategória termékeit adja vissza", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeProduct]]);

    const res = await request(app).get("/api/products?category=parfümök");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining("WHERE"),
      expect.arrayContaining(["parfümök"])
    );
  });

  it("200 – üres lista ha nincs termék", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("500 – DB hiba esetén szerverhiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(500);
  });
});


describe("GET /api/products/:id", () => {
  it("200 – létező termék visszaadása", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeProduct]]);

    const res = await request(app).get("/api/products/1");

    expect(res.status).toBe(200);
  });

  it("404 – nem létező ID", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/products/9999");

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/nem található/i);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app).get("/api/products/1");

    expect(res.status).toBe(500);
  });
});


describe("POST /api/products", () => {
  const validBody = {
    name: "Angel",
    description: "Szép parfüm",
    price: 5000,
    category_id: 2,
    stock_quantity: 10,
  };

  it("201 – admin sikeresen létrehozza a terméket", async () => {
    mockedQuery
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValueOnce([[fakeProduct]]);

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validBody);

    expect(res.status).toBe(201);
  });

  it("401 – token nélkül nem engedett", async () => {
    const res = await request(app).post("/api/products").send(validBody);
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem hozhat létre terméket", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validBody);

    expect(res.status).toBe(403);
  });

  it("400 – hiányzó name", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...validBody, name: undefined });

    expect(res.status).toBe(400);
  });

  it("400 – hiányzó description", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...validBody, description: undefined });

    expect(res.status).toBe(400);
  });

  it("400 – hiányzó price", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...validBody, price: undefined });

    expect(res.status).toBe(400);
  });

  it("400 – hiányzó category_id", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...validBody, category_id: undefined });

    expect(res.status).toBe(400);
  });

  it("400 – érvénytelen category_id (ER_NO_REFERENCED_ROW_2)", async () => {
    const refErr = Object.assign(new Error("fk"), { code: "ER_NO_REFERENCED_ROW_2" });
    mockedQuery.mockRejectedValueOnce(refErr);

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validBody);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/category_id/i);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validBody);

    expect(res.status).toBe(500);
  });
});


describe("PUT /api/products/:id", () => {
  const validBody = {
    name: "Angel Updated",
    description: "Frissített leírás",
    price: 6000,
    category_id: 2,
    stock_quantity: 5,
  };

  it("200 – admin sikeresen frissíti a terméket", async () => {
    mockedQuery
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ ...fakeProduct, name: "Angel Updated" }]]);

    const res = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validBody);

    expect(res.status).toBe(200);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).put("/api/products/1").send(validBody);
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem módosíthat", async () => {
    const res = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validBody);

    expect(res.status).toBe(403);
  });

  it("400 – hiányzó kötelező mező", async () => {
    const res = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Csak név" });

    expect(res.status).toBe(400);
  });

  it("400 – érvénytelen category_id", async () => {
    const refErr = Object.assign(new Error("fk"), { code: "ER_NO_REFERENCED_ROW_2" });
    mockedQuery.mockRejectedValueOnce(refErr);

    const res = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validBody);

    expect(res.status).toBe(400);
  });
});


describe("PATCH /api/products/:id", () => {
  it("200 – admin részlegesen frissíti a terméket", async () => {
    mockedQuery
      .mockResolvedValueOnce([[fakeProduct]])
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ ...fakeProduct, price: 9999 }]]);

    const res = await request(app)
      .patch("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 9999 });

    expect(res.status).toBe(200);
  });

  it("404 – nem létező termék", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .patch("/api/products/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 100 });

    expect(res.status).toBe(404);
  });

  it("400 – nem szám price érték", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeProduct]]);

    const res = await request(app)
      .patch("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: "nem_szam" });

    expect(res.status).toBe(400);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).patch("/api/products/1").send({ price: 100 });
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem patch-elhet", async () => {
    const res = await request(app)
      .patch("/api/products/1")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 100 });

    expect(res.status).toBe(403);
  });
});


describe("DELETE /api/products/:id", () => {
  it("200 – admin törli a terméket", async () => {
    mockedQuery
      .mockResolvedValueOnce([[fakeProduct]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
    expect(res.body.deleted).toMatchObject({ product_id: 1 });
  });

  it("404 – nem létező termék törlése", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .delete("/api/products/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).delete("/api/products/1");
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem törölhet", async () => {
    const res = await request(app)
      .delete("/api/products/1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("500 – DB hiba törlés közben", async () => {
    mockedQuery
      .mockResolvedValueOnce([[fakeProduct]])
      .mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .delete("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
  });
});