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
var fakeProduct = {
    product_id: 1,
    name: "Angel",
    description: "Parfüm",
    price: 5000,
    category_id: 2,
    category_name: "Parfümök",
    stock_quantity: 10,
    image_url: null,
};
beforeEach(function () { return jest.clearAllMocks(); });
describe("GET /api/products", function () {
    it("200 – visszaadja az összes terméket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeProduct, __assign(__assign({}, fakeProduct), { product_id: 2 })]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("200 – kategória szűrővel csak az adott kategória termékeit adja vissza", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeProduct]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products?category=parfümök")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(1);
                    expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining("WHERE"), expect.arrayContaining(["parfümök"]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("200 – üres lista ha nincs termék", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 – DB hiba esetén szerverhiba", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET /api/products/:id", function () {
    it("200 – létező termék visszaadása", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeProduct]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products/1")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
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
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products/9999")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    expect(res.body.message).toMatch(/nem található/i);
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
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/products/1")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("POST /api/products", function () {
    var validBody = {
        name: "Angel",
        description: "Szép parfüm",
        price: 5000,
        category_id: 2,
        stock_quantity: 10,
    };
    it("201 – admin sikeresen létrehozza a terméket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery
                        .mockResolvedValueOnce([{ insertId: 1 }])
                        .mockResolvedValueOnce([[fakeProduct]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/products")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(201);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül nem engedett", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/products").send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem hozhat létre terméket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/products")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/products")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send(__assign(__assign({}, validBody), { name: undefined }))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó description", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/products")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send(__assign(__assign({}, validBody), { description: undefined }))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó price", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/products")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send(__assign(__assign({}, validBody), { price: undefined }))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó category_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/products")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send(__assign(__assign({}, validBody), { category_id: undefined }))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – érvénytelen category_id (ER_NO_REFERENCED_ROW_2)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var refErr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refErr = Object.assign(new Error("fk"), { code: "ER_NO_REFERENCED_ROW_2" });
                    mockedQuery.mockRejectedValueOnce(refErr);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/products")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    expect(res.body.message).toMatch(/category_id/i);
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
                            .post("/api/products")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("PUT /api/products/:id", function () {
    var validBody = {
        name: "Angel Updated",
        description: "Frissített leírás",
        price: 6000,
        category_id: 2,
        stock_quantity: 5,
    };
    it("200 – admin sikeresen frissíti a terméket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery
                        .mockResolvedValueOnce([{ affectedRows: 1 }])
                        .mockResolvedValueOnce([[__assign(__assign({}, fakeProduct), { name: "Angel Updated" })]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .put("/api/products/1")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).put("/api/products/1").send(validBody)];
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
                        .put("/api/products/1")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó kötelező mező", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .put("/api/products/1")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({ name: "Csak név" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – érvénytelen category_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var refErr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refErr = Object.assign(new Error("fk"), { code: "ER_NO_REFERENCED_ROW_2" });
                    mockedQuery.mockRejectedValueOnce(refErr);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .put("/api/products/1")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("PATCH /api/products/:id", function () {
    it("200 – admin részlegesen frissíti a terméket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery
                        .mockResolvedValueOnce([[fakeProduct]])
                        .mockResolvedValueOnce([{ affectedRows: 1 }])
                        .mockResolvedValueOnce([[__assign(__assign({}, fakeProduct), { price: 9999 })]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/products/1")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ price: 9999 })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező termék", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/products/9999")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ price: 100 })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – nem szám price érték", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeProduct]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/products/1")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ price: "nem_szam" })];
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).patch("/api/products/1").send({ price: 100 })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem patch-elhet", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch("/api/products/1")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send({ price: 100 })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("DELETE /api/products/:id", function () {
    it("200 – admin törli a terméket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery
                        .mockResolvedValueOnce([[fakeProduct]])
                        .mockResolvedValueOnce([{ affectedRows: 1 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/products/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.message).toBe("Deleted");
                    expect(res.body.deleted).toMatchObject({ product_id: 1 });
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező termék törlése", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/products/9999")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).delete("/api/products/1")];
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
                        .delete("/api/products/1")
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
                    mockedQuery
                        .mockResolvedValueOnce([[fakeProduct]])
                        .mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/products/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
