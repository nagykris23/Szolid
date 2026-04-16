import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { requireAuth, AuthRequest } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { JWT_SECRET } from "../config";
import { describe, it, expect, beforeEach, beforeAll, jest } from "@jest/globals";
jest.mock("../wrapper", () => ({
  __esModule: true,
  default: { query: jest.fn(), getConnection: jest.fn() },
}));

const mockRes = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  (res.status as jest.Mock).mockReturnValue(res);
  (res.json as jest.Mock).mockReturnValue(res);
  return res;
};
const mockNext: NextFunction = jest.fn();

beforeEach(() => { jest.clearAllMocks(); });


describe("requireAuth middleware", () => {
  it("érvényes tokennel next()-et hív és req.user-t beállítja", () => {
    const token = jwt.sign(
      { user_id: 1, email: "x@x.com", role: "user" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject({ user_id: 1, email: "x@x.com", role: "user" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("401 – Authorization header teljesen hiányzik", () => {
    const req = { headers: {} } as AuthRequest;
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("401 – Bearer prefix nélküli header", () => {
    const req = { headers: { authorization: "valami_token_bearer_nelkul" } } as AuthRequest;
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("401 – rossz titkos kulccsal aláírt token", () => {
    const badToken = jwt.sign({ user_id: 1, email: "x@x.com", role: "user" }, "rossz-secret");

    const req = { headers: { authorization: `Bearer ${badToken}` } } as AuthRequest;
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("401 – lejárt token", () => {
    const expiredToken = jwt.sign(
      { user_id: 1, email: "x@x.com", role: "user" },
      JWT_SECRET,
      { expiresIn: "0s" }
    );

    const req = { headers: { authorization: `Bearer ${expiredToken}` } } as AuthRequest;
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("401 – teljesen véletlenszerű string token", () => {
    const req = { headers: { authorization: "Bearer aez234.hamis.token" } } as AuthRequest;
    const res = mockRes();

    requireAuth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});


describe("requireAdmin middleware", () => {
  it("admin role esetén next()-et hív", () => {
    const req = {
      user: { user_id: 1, email: "admin@test.com", role: "admin" },
    } as AuthRequest;
    const res = mockRes();

    requireAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("403 – user role esetén megtagadja a hozzáférést", () => {
    const req = {
      user: { user_id: 2, email: "user@test.com", role: "user" },
    } as AuthRequest;
    const res = mockRes();

    requireAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("401 – req.user nincs beállítva (requireAuth kihagyva)", () => {
    const req = {} as AuthRequest;
    const res = mockRes();

    requireAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("403 – ismeretlen role (pl. 'moderator')", () => {
    const req = {
      user: { user_id: 3, email: "mod@test.com", role: "moderator" },
    } as AuthRequest;
    const res = mockRes();

    requireAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });
});