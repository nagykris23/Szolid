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
jest.mock("../wrapper", function () {
    var mockConnection = {
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
var poolMock = require("../wrapper");
var mockedQuery = wrapper_1.default.query;
var mockConnection = poolMock.__mockConnection;
var makeToken = function (role, user_id) {
    if (user_id === void 0) { user_id = 1; }
    return jsonwebtoken_1.default.sign({ user_id: user_id, email: "x@x.com", role: role }, config_1.JWT_SECRET, { expiresIn: "1h" });
};
var adminToken = makeToken("admin");
var userToken = makeToken("user", 1);
var fakeOrder = {
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
var fakeItems = [
    { order_item_id: 1, order_id: 1, product_id: 2, quantity: 2, price_at_purchase: 5000, name: "Angel" },
    { order_item_id: 2, order_id: 1, product_id: 3, quantity: 1, price_at_purchase: 5000, name: "Spell" },
];
beforeEach(function () { return jest.clearAllMocks(); });
describe("POST /api/orders", function () {
    var validBody = {
        total_amount: 15000,
        shipping_method: "házhozszállítás",
        payment_method: "kártya",
        items: [
            { product_id: 2, quantity: 2, price_at_purchase: 5000 },
            { product_id: 3, quantity: 1, price_at_purchase: 5000 },
        ],
    };
    it("201 – bejelentkezett user sikeresen rendelést ad le", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnection.query
                        .mockResolvedValueOnce([{ insertId: 1 }])
                        .mockResolvedValueOnce([{}])
                        .mockResolvedValueOnce([{}]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/orders")
                            .set("Authorization", "Bearer ".concat(userToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(201);
                    expect(res.body).toMatchObject({ message: expect.stringMatching(/sikeresen/i), order_id: 1 });
                    expect(mockConnection.commit).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – items tömb hiányzik", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/orders")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send(__assign(__assign({}, validBody), { items: undefined }))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    expect(res.body.message).toMatch(/termékeket/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – üres items tömb", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/orders")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send(__assign(__assign({}, validBody), { items: [] }))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – items nem tömb", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/orders")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send(__assign(__assign({}, validBody), { items: "rossz" }))];
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/orders").send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("500 + rollback – DB hiba INSERT közben", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnection.query.mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post("/api/orders")
                            .set("Authorization", "Bearer ".concat(userToken))
                            .send(validBody)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    expect(mockConnection.rollback).toHaveBeenCalled();
                    expect(mockConnection.release).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET /api/orders/my", function () {
    it("200 – visszaadja a bejelentkezett user saját rendeléseit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeOrder]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get("/api/orders/my")
                            .set("Authorization", "Bearer ".concat(userToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body[0]).toMatchObject({ user_id: 1 });
                    return [2 /*return*/];
            }
        });
    }); });
    it("200 – üres lista ha nincs rendelés", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get("/api/orders/my")
                            .set("Authorization", "Bearer ".concat(userToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/orders/my")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
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
                            .get("/api/orders/my")
                            .set("Authorization", "Bearer ".concat(userToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET /api/orders", function () {
    it("200 – admin látja az összes rendelést", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[fakeOrder, __assign(__assign({}, fakeOrder), { order_id: 2 })]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get("/api/orders")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("401 – token nélkül", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/orders")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem láthatja az összes rendelést", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get("/api/orders")
                        .set("Authorization", "Bearer ".concat(userToken))];
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
                            .get("/api/orders")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET /api/orders/:id", function () {
    it("200 – admin lekéri az adott rendelést tételekkel együtt", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery
                        .mockResolvedValueOnce([[fakeOrder]])
                        .mockResolvedValueOnce([fakeItems]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get("/api/orders/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveProperty("order_id", 1);
                    expect(res.body).toHaveProperty("items");
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező rendelés", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get("/api/orders/9999")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – nem szám ID", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get("/api/orders/abc")
                        .set("Authorization", "Bearer ".concat(adminToken))];
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/orders/1")];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem érheti el", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get("/api/orders/1")
                        .set("Authorization", "Bearer ".concat(userToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("PATCH /api/orders/:id/status", function () {
    it("200 – admin frissíti a rendelés státuszát", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/orders/1/status")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ status: "shipped" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toMatchObject({ order_id: 1, status: "shipped" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező rendelés", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/orders/9999/status")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ status: "shipped" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó status mező", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch("/api/orders/1/status")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({})];
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).patch("/api/orders/1/status").send({ status: "shipped" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem módosíthatja", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch("/api/orders/1/status")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send({ status: "shipped" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("PATCH /api/orders/:id/payment", function () {
    it("200 – admin frissíti a fizetési státuszt", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/orders/1/payment")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ payment_status: "paid" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toMatchObject({ order_id: 1, payment_status: "paid" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező rendelés", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .patch("/api/orders/9999/payment")
                            .set("Authorization", "Bearer ".concat(adminToken))
                            .send({ payment_status: "paid" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it("400 – hiányzó payment_status mező", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch("/api/orders/1/payment")
                        .set("Authorization", "Bearer ".concat(adminToken))
                        .send({})];
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).patch("/api/orders/1/payment").send({ payment_status: "paid" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it("403 – sima user nem módosíthatja", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch("/api/orders/1/payment")
                        .set("Authorization", "Bearer ".concat(userToken))
                        .send({ payment_status: "paid" })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("DELETE /api/orders/:id", function () {
    it("200 – admin törli a rendelést", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery
                        .mockResolvedValueOnce([[fakeOrder]])
                        .mockResolvedValueOnce([{ affectedRows: 1 }]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/orders/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.message).toMatch(/törölve/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it("404 – nem létező rendelés", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockedQuery.mockResolvedValueOnce([[]]);
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/orders/9999")
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).delete("/api/orders/1")];
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
                        .delete("/api/orders/1")
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
                        .mockResolvedValueOnce([[fakeOrder]])
                        .mockRejectedValueOnce(new Error("db crash"));
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .delete("/api/orders/1")
                            .set("Authorization", "Bearer ".concat(adminToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
