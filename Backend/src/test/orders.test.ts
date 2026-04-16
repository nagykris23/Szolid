import request from "supertest";
import app from "../app";
import pool from "../wrapper";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

jest.mock("../wrapper", () => {
  const mockConnection = {
    beginTransaction: jest.fn().mockResolvedValue(undefined),
    query: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    release: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      query: jest.fn(),
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    },
    __mockConnection: mockConnection,
  };
});

const poolMock = require("../wrapper");
const mockedQuery = pool.query as jest.Mock;
const mockConnection = poolMock.__mockConnection;

const makeToken = (role: "user" | "admin", user_id = 1) =>
  jwt.sign({ user_id, email: "x@x.com", role }, JWT_SECRET, { expiresIn: "1h" });

const adminToken = makeToken("admin");
const userToken = makeToken("user", 1);

const fakeOrder = {
  order_id: 1,
  user_id: 1,
  user_name: "Test User",
  address_id: null,
  order_date: "2024-01-01T10:00:00.000Z",
  total_amount: 15000,
  status: "pending",
  shipping_method: "házhozszállítás",
  payment_method: "kártya",
  payment_status: "unpaid",
};

const fakeItems = [
  { order_item_id: 1, order_id: 1, product_id: 2, quantity: 2, price_at_purchase: 5000, name: "Angel" },
  { order_item_id: 2, order_id: 1, product_id: 3, quantity: 1, price_at_purchase: 5000, name: "Spell" },
];

beforeEach(() => jest.clearAllMocks());


describe("POST /api/orders", () => {
  const validBody = {
    total_amount: 15000,
    shipping_method: "házhozszállítás",
    payment_method: "kártya",
    items: [
      { product_id: 2, quantity: 2, price_at_purchase: 5000 },
      { product_id: 3, quantity: 1, price_at_purchase: 5000 },
    ],
  };

  it("201 – bejelentkezett user sikeresen rendelést ad le", async () => {
    mockConnection.query
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([{}]);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ message: expect.stringMatching(/sikeresen/i), order_id: 1 });
    expect(mockConnection.commit).toHaveBeenCalled();
  });

  it("400 – items tömb hiányzik", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ ...validBody, items: undefined });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/termékeket/i);
  });

  it("400 – üres items tömb", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ ...validBody, items: [] });

    expect(res.status).toBe(400);
  });

  it("400 – items nem tömb", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ ...validBody, items: "rossz" });

    expect(res.status).toBe(400);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).post("/api/orders").send(validBody);
    expect(res.status).toBe(401);
  });

  it("500 + rollback – DB hiba INSERT közben", async () => {
    mockConnection.query.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validBody);

    expect(res.status).toBe(500);
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});


describe("GET /api/orders/my", () => {
  it("200 – visszaadja a bejelentkezett user saját rendeléseit", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeOrder]]);

    const res = await request(app)
      .get("/api/orders/my")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ user_id: 1 });
  });

  it("200 – üres lista ha nincs rendelés", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .get("/api/orders/my")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).get("/api/orders/my");
    expect(res.status).toBe(401);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .get("/api/orders/my")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(500);
  });
});


describe("GET /api/orders", () => {
  it("200 – admin látja az összes rendelést", async () => {
    mockedQuery.mockResolvedValueOnce([[fakeOrder, { ...fakeOrder, order_id: 2 }]]);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem láthatja az összes rendelést", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("500 – DB hiba", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
  });
});


describe("GET /api/orders/:id", () => {
  it("200 – admin lekéri az adott rendelést tételekkel együtt", async () => {
    mockedQuery
      .mockResolvedValueOnce([[fakeOrder]])
      .mockResolvedValueOnce([fakeItems]);

    const res = await request(app)
      .get("/api/orders/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("order_id", 1);
    expect(res.body).toHaveProperty("items");
  });

  it("404 – nem létező rendelés", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .get("/api/orders/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("400 – nem szám ID", async () => {
    const res = await request(app)
      .get("/api/orders/abc")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).get("/api/orders/1");
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem érheti el", async () => {
    const res = await request(app)
      .get("/api/orders/1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});

describe("PATCH /api/orders/:id/status", () => {
  it("200 – admin frissíti a rendelés státuszát", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .patch("/api/orders/1/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipped" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ order_id: 1, status: "shipped" });
  });

  it("404 – nem létező rendelés", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .patch("/api/orders/9999/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipped" });

    expect(res.status).toBe(404);
  });

  it("400 – hiányzó status mező", async () => {
    const res = await request(app)
      .patch("/api/orders/1/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).patch("/api/orders/1/status").send({ status: "shipped" });
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem módosíthatja", async () => {
    const res = await request(app)
      .patch("/api/orders/1/status")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "shipped" });

    expect(res.status).toBe(403);
  });
});


describe("PATCH /api/orders/:id/payment", () => {
  it("200 – admin frissíti a fizetési státuszt", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .patch("/api/orders/1/payment")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ payment_status: "paid" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ order_id: 1, payment_status: "paid" });
  });

  it("404 – nem létező rendelés", async () => {
    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .patch("/api/orders/9999/payment")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ payment_status: "paid" });

    expect(res.status).toBe(404);
  });

  it("400 – hiányzó payment_status mező", async () => {
    const res = await request(app)
      .patch("/api/orders/1/payment")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).patch("/api/orders/1/payment").send({ payment_status: "paid" });
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem módosíthatja", async () => {
    const res = await request(app)
      .patch("/api/orders/1/payment")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ payment_status: "paid" });

    expect(res.status).toBe(403);
  });
});


describe("DELETE /api/orders/:id", () => {
  it("200 – admin törli a rendelést", async () => {
    mockedQuery
      .mockResolvedValueOnce([[fakeOrder]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/orders/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/törölve/i);
  });

  it("404 – nem létező rendelés", async () => {
    mockedQuery.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .delete("/api/orders/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).delete("/api/orders/1");
    expect(res.status).toBe(401);
  });

  it("403 – sima user nem törölhet", async () => {
    const res = await request(app)
      .delete("/api/orders/1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("500 – DB hiba törlés közben", async () => {
    mockedQuery
      .mockResolvedValueOnce([[fakeOrder]])
      .mockRejectedValueOnce(new Error("db crash"));

    const res = await request(app)
      .delete("/api/orders/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(500);
  });
});