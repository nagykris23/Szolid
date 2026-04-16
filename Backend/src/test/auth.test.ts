import request from "supertest";
import app from "../app";
import * as userModel from "../User/user.model";
import bcrypt from "bcrypt";

jest.mock("../wrapper", () => ({
  __esModule: true,
  default: { query: jest.fn(), getConnection: jest.fn() },
}));

jest.mock("../User/user.model");

const mockedFindUserByEmail = userModel.findUserByEmail as jest.MockedFunction<typeof userModel.findUserByEmail>;
const mockedCreateUser = userModel.createUser as jest.MockedFunction<typeof userModel.createUser>;

const fakeUser = {
  user_id: 1,
  name: "Test User",
  email: "test@test.com",
  password_hash: "",
  role: "user",
};

beforeEach(() => jest.clearAllMocks());


describe("POST /auth/register", () => {
  it("201 – sikeres regisztráció visszaad tokent és user adatot", async () => {
    mockedFindUserByEmail.mockResolvedValue(null);
    mockedCreateUser.mockResolvedValue({ ...fakeUser, password_hash: "hash" });

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ email: "test@test.com", role: "user" });
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  it("400 – hiányzó name mező", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/kötelező/i);
  });

  it("400 – hiányzó email mező", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", password: "jelszo123" });

    expect(res.status).toBe(400);
  });

  it("400 – hiányzó password mező", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com" });

    expect(res.status).toBe(400);
  });

  it("400 – üres body", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.status).toBe(400);
  });

  it("409 – már létező email", async () => {
    mockedFindUserByEmail.mockResolvedValue({ ...fakeUser, password_hash: "hash" });

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/már létezik/i);
  });

  it("409 – DB ER_DUP_ENTRY hibát dob", async () => {
    mockedFindUserByEmail.mockResolvedValue(null);
    const dupErr = Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" });
    mockedCreateUser.mockRejectedValue(dupErr);

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(409);
  });

  it("500 – váratlan DB hiba", async () => {
    mockedFindUserByEmail.mockResolvedValue(null);
    mockedCreateUser.mockRejectedValue(new Error("db crash"));

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(500);
  });
});


describe("POST /auth/login", () => {
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash("jelszo123", 10);
  });

  it("200 – helyes email + jelszó visszaad tokent", async () => {
    mockedFindUserByEmail.mockResolvedValue({ ...fakeUser, password_hash: hashedPassword });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ email: "test@test.com" });
  });

  it("401 – nem létező email", async () => {
    mockedFindUserByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nemletezik@test.com", password: "jelszo123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/hibás/i);
  });

  it("401 – rossz jelszó", async () => {
    mockedFindUserByEmail.mockResolvedValue({ ...fakeUser, password_hash: hashedPassword });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "rossz_jelszo" });

    expect(res.status).toBe(401);
  });

  it("400 – hiányzó email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ password: "jelszo123" });

    expect(res.status).toBe(400);
  });

  it("400 – hiányzó password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com" });

    expect(res.status).toBe(400);
  });

  it("400 – üres body", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("500 – DB hiba login közben", async () => {
    mockedFindUserByEmail.mockRejectedValue(new Error("db crash"));

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "jelszo123" });

    expect(res.status).toBe(500);
  });
});


describe("GET /auth/me", () => {
  it("200 – érvényes tokennel visszaadja a user adatot", async () => {
    mockedFindUserByEmail.mockResolvedValue(null);
    mockedCreateUser.mockResolvedValue({ ...fakeUser, password_hash: "hash" });

    const regRes = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "jelszo123" });

    const token = regRes.body.token;

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  it("401 – token nélkül", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("401 – érvénytelen token", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer hamis.token.itt");

    expect(res.status).toBe(401);
  });

  it("401 – Bearer prefix nélkül", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", "valami_token");

    expect(res.status).toBe(401);
  });
});