"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_middleware_1 = require("../middleware/auth.middleware");
var admin_middleware_1 = require("../middleware/admin.middleware");
var config_1 = require("../config");
var globals_1 = require("@jest/globals");
globals_1.jest.mock("../wrapper", function () { return ({
    __esModule: true,
    default: { query: globals_1.jest.fn(), getConnection: globals_1.jest.fn() },
}); });
var mockRes = function () {
    var res = {
        status: globals_1.jest.fn(),
        json: globals_1.jest.fn(),
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res;
};
var mockNext = globals_1.jest.fn();
(0, globals_1.beforeEach)(function () { globals_1.jest.clearAllMocks(); });
(0, globals_1.describe)("requireAuth middleware", function () {
    (0, globals_1.it)("érvényes tokennel next()-et hív és req.user-t beállítja", function () {
        var token = jsonwebtoken_1.default.sign({ user_id: 1, email: "x@x.com", role: "user" }, config_1.JWT_SECRET, { expiresIn: "1h" });
        var req = { headers: { authorization: "Bearer ".concat(token) } };
        var res = mockRes();
        (0, auth_middleware_1.requireAuth)(req, res, mockNext);
        (0, globals_1.expect)(mockNext).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(req.user).toMatchObject({ user_id: 1, email: "x@x.com", role: "user" });
        (0, globals_1.expect)(res.status).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("401 – Authorization header teljesen hiányzik", function () {
        var req = { headers: {} };
        var res = mockRes();
        (0, auth_middleware_1.requireAuth)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("401 – Bearer prefix nélküli header", function () {
        var req = { headers: { authorization: "valami_token_bearer_nelkul" } };
        var res = mockRes();
        (0, auth_middleware_1.requireAuth)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("401 – rossz titkos kulccsal aláírt token", function () {
        var badToken = jsonwebtoken_1.default.sign({ user_id: 1, email: "x@x.com", role: "user" }, "rossz-secret");
        var req = { headers: { authorization: "Bearer ".concat(badToken) } };
        var res = mockRes();
        (0, auth_middleware_1.requireAuth)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("401 – lejárt token", function () {
        var expiredToken = jsonwebtoken_1.default.sign({ user_id: 1, email: "x@x.com", role: "user" }, config_1.JWT_SECRET, { expiresIn: "0s" });
        var req = { headers: { authorization: "Bearer ".concat(expiredToken) } };
        var res = mockRes();
        (0, auth_middleware_1.requireAuth)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("401 – teljesen véletlenszerű string token", function () {
        var req = { headers: { authorization: "Bearer aez234.hamis.token" } };
        var res = mockRes();
        (0, auth_middleware_1.requireAuth)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
});
(0, globals_1.describe)("requireAdmin middleware", function () {
    (0, globals_1.it)("admin role esetén next()-et hív", function () {
        var req = {
            user: { user_id: 1, email: "admin@test.com", role: "admin" },
        };
        var res = mockRes();
        (0, admin_middleware_1.requireAdmin)(req, res, mockNext);
        (0, globals_1.expect)(mockNext).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(res.status).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("403 – user role esetén megtagadja a hozzáférést", function () {
        var req = {
            user: { user_id: 2, email: "user@test.com", role: "user" },
        };
        var res = mockRes();
        (0, admin_middleware_1.requireAdmin)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("401 – req.user nincs beállítva (requireAuth kihagyva)", function () {
        var req = {};
        var res = mockRes();
        (0, admin_middleware_1.requireAdmin)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
    (0, globals_1.it)("403 – ismeretlen role (pl. 'moderator')", function () {
        var req = {
            user: { user_id: 3, email: "mod@test.com", role: "moderator" },
        };
        var res = mockRes();
        (0, admin_middleware_1.requireAdmin)(req, res, mockNext);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
    });
});
