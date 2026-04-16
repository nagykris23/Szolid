"use strict";
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
var wrapper_1 = __importDefault(require("../wrapper"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
jest.mock("../wrapper", function () { return ({
    __esModule: true,
    default: { query: jest.fn(), getConnection: jest.fn() },
}); });
var mockedQuery = wrapper_1.default.query;
var makeToken = function (role) {
    return jsonwebtoken_1.default.sign({ user_id: 1, email: "x@x.com", role: role }, config_1.JWT_SECRET, { expiresIn: "1h" });
};
var adminToken = makeToken("admin");
var userToken = makeToken("user");
var fakeCategory = { category_id: 1, name: "Parfümök" };
beforeEach(function () { return jest.clearAllMocks(); });
describe("GET /api/categories", function () {
    it("200 – visszaadja az összes kategóriát", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeCategory, { category_id: 2, name: "Dezodorok" }]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("200 – üres lista ha nincs kategória", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – DB hiba", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET /api/categories/:id", function () {
    it("200 – létező kategória visszaadása", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeCategory]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories/1")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body[0]).toMatchObject({ category_id: 1 });
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező ID", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories/9999")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – nem szám ID (NaN)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories/abc")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – DB hiba", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/categories/1")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("POST /api/categories", function () {
    it("200 – admin sikeresen létrehozza a kategóriát", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ insertId: 3 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/categories")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ name: "Új Kategória" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/categories")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({})];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – üres string name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/categories")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({ name: "   " })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – duplikált kategória név (ER_DUP_ENTRY)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dupErr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dupErr = Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" });
                    mockedQuery.mockRejectedValueOnce(dupErr);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/categories")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ name: "Parfümök" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    expect(res.text).toMatch(/már létezik/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/categories").send({ name: "Új" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem hozhat létre kategóriát", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/categories")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send({ name: "Új" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – DB hiba", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/categories")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ name: "Új" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("PUT /api/categories/:id", function () {
    it("200 – admin frissíti a kategóriát", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .put("/api/categories/1")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ name: "Frissített Név" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toMatchObject({ category_id: 1, name: "Frissített Név" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező kategória frissítése", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .put("/api/categories/9999")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ name: "Valami" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .put("/api/categories/1")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({})];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – üres string name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .put("/api/categories/1")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({ name: "" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – duplikált név (ER_DUP_ENTRY)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dupErr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dupErr = Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" });
                    mockedQuery.mockRejectedValueOnce(dupErr);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .put("/api/categories/1")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ name: "Parfümök" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).put("/api/categories/1").send({ name: "X" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem módosíthat", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .put("/api/categories/1")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send({ name: "X" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("DELETE /api/categories/:id", function () {
    it("200 – admin törli a kategóriát", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/categories/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.text).toMatch(/törölve/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező kategória törlése", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/categories/9999")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – kategóriához tartozik termék (ER_ROW_IS_REFERENCED_2)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var refErr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refErr = Object.assign(new Error("fk"), { code: "ER_ROW_IS_REFERENCED_2" });
                    mockedQuery.mockRejectedValueOnce(refErr);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/categories/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    expect(res.text).toMatch(/termék/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).delete("/api/categories/1")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem törölhet", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .delete("/api/categories/1")
                        .set("Authorization", "Bearer ".concat(userToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – DB hiba törlés közben", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/categories/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
