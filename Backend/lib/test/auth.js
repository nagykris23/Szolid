"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var app_1 = __importDefault(require("../app"));
var userModel = __importStar(require("../User/user.model"));
var bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock("../wrapper", function () { return ({
    __esModule: true,
    default: { query: jest.fn(), getConnection: jest.fn() },
}); });
jest.mock("../User/user.model");
var mockedFindUserByEmail = userModel.findUserByEmail;
var mockedCreateUser = userModel.createUser;
var fakeUser = {
    user_id: 1,
    name: "Test User",
    email: "test@test.com",
    password_hash: "",
    role: "user",
};
beforeEach(function () { return jest.clearAllMocks(); });
describe("POST /auth/register", function () {
    it("201 – sikeres regisztráció visszaad tokent és user adatot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(null);
                    mockedCreateUser.mockResolvedValue(__assign(__assign({}, fakeUser), { password_hash: "hash" }));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/register")
                            .send({ name: "Test User", email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(201);
                    expect(res.body).toHaveProperty("token");
                    expect(res.body.user).toMatchObject({ email: "test@test.com", role: "user" });
                    expect(res.body.user).not.toHaveProperty("password_hash");
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó name mező", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/auth/register")
                        .send({ email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    expect(res.body.message).toMatch(/kötelező/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó email mező", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/auth/register")
                        .send({ name: "Test User", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó password mező", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/auth/register")
                        .send({ name: "Test User", email: "test@test.com" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – üres body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/auth/register").send({})];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("409 – már létező email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(__assign(__assign({}, fakeUser), { password_hash: "hash" }));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/register")
                            .send({ name: "Test User", email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(409);
                    expect(res.body.message).toMatch(/már létezik/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("409 – DB ER_DUP_ENTRY hibát dob", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dupErr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(null);
                    dupErr = Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" });
                    mockedCreateUser.mockRejectedValue(dupErr);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/register")
                            .send({ name: "Test User", email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(409);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – váratlan DB hiba", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(null);
                    mockedCreateUser.mockRejectedValue(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/register")
                            .send({ name: "Test User", email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("POST /auth/login", function () {
    var hashedPassword;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.hash("jelszo123", 10)];
                case 1:
                    hashedPassword = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("200 – helyes email + jelszó visszaad tokent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(__assign(__assign({}, fakeUser), { password_hash: hashedPassword }));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/login")
                            .send({ email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveProperty("token");
                    expect(res.body.user).toMatchObject({ email: "test@test.com" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – nem létező email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(null);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/login")
                            .send({ email: "nemletezik@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    expect(res.body.message).toMatch(/hibás/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – rossz jelszó", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(__assign(__assign({}, fakeUser), { password_hash: hashedPassword }));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/login")
                            .send({ email: "test@test.com", password: "rossz_jelszo" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/auth/login")
                        .send({ password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/auth/login")
                        .send({ email: "test@test.com" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – üres body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/auth/login").send({})];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – DB hiba login közben", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockRejectedValue(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/login")
                            .send({ email: "test@test.com", password: "jelszo123" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET /auth/me", function () {
    it("200 – érvényes tokennel visszaadja a user adatot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var regRes, token, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedFindUserByEmail.mockResolvedValue(null);
                    mockedCreateUser.mockResolvedValue(__assign(__assign({}, fakeUser), { password_hash: "hash" }));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/auth/register")
                            .send({ name: "Test User", email: "test@test.com", password: "jelszo123" })];
                case 1:
                    regRes = _a.sent();
                    token = regRes.body.token;
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get("/auth/me")
                            .set("Authorization", "Bearer ".concat(token))];
                case 2:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveProperty("user");
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/auth/me")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – érvénytelen token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get("/auth/me")
                        .set("Authorization", "Bearer hamis.token.itt")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – Bearer prefix nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get("/auth/me")
                        .set("Authorization", "valami_token")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
});
