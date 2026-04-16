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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updatePaymentStatus = exports.updateOrderStatus = exports.getMyOrders = exports.createOrder = exports.getOrderById = exports.getAllOrders = void 0;
var wrapper_1 = __importDefault(require("../wrapper"));
var getAllOrders = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rows, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, wrapper_1.default.query("\n      SELECT o.*, u.name as user_name \n      FROM ORDERS o\n      JOIN USERS u ON o.user_id = u.user_id\n      ORDER BY o.order_date DESC\n    ")];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                res.status(500).send("Adatbázis hiba!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
var getOrderById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, orderRows, orderRow, order, _b, itemRows, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ message: "hibásan adtad meg" });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, wrapper_1.default.query("\n      SELECT o.*, u.name as user_name \n      FROM ORDERS o\n      JOIN USERS u ON o.user_id = u.user_id\n      WHERE o.order_id = ?\n    ", [id])];
            case 2:
                _a = __read.apply(void 0, [_c.sent(), 1]), orderRows = _a[0];
                orderRow = orderRows[0];
                if (!orderRow)
                    return [2 /*return*/, res.status(404).json({ message: "Rendelés nem található" })];
                order = orderRows[0];
                return [4 /*yield*/, wrapper_1.default.query("\n      SELECT oi.*, p.name \n      FROM ORDER_ITEMS oi\n      JOIN PRODUCTS p ON oi.product_id = p.product_id\n      WHERE oi.order_id = ?\n    ", [id])];
            case 3:
                _b = __read.apply(void 0, [_c.sent(), 1]), itemRows = _b[0];
                res.json({
                    order_id: order.order_id,
                    user_id: order.user_id,
                    user_name: order.user_name,
                    address_id: order.address_id,
                    order_date: order.order_date,
                    total_amount: order.total_amount,
                    status: order.status,
                    shipping_method: order.shipping_method,
                    payment_method: order.payment_method,
                    payment_status: order.payment_status,
                    items: itemRows,
                });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _c.sent();
                console.log(err_2);
                res.status(500).send("Adatbázis hiba!");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getOrderById = getOrderById;
var createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, user_id, _a, address_id, total_amount, shipping_method, payment_method, payment_status, items, _b, orderResult, orderId, items_1, items_1_1, item, e_1_1, err_3;
    var e_1, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, wrapper_1.default.getConnection()];
            case 1:
                connection = _e.sent();
                _e.label = 2;
            case 2:
                _e.trys.push([2, 14, 16, 17]);
                return [4 /*yield*/, connection.beginTransaction()];
            case 3:
                _e.sent();
                user_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.user_id;
                if (!user_id)
                    return [2 /*return*/, res.status(401).json({ message: "Bejelentkezés szükséges" })];
                _a = req.body, address_id = _a.address_id, total_amount = _a.total_amount, shipping_method = _a.shipping_method, payment_method = _a.payment_method, payment_status = _a.payment_status, items = _a.items;
                if (!items || !Array.isArray(items) || items.length === 0) {
                    return [2 /*return*/, res.status(400).json({ message: "A rendelésnek tartalmaznia kell termékeket" })];
                }
                return [4 /*yield*/, connection.query("INSERT INTO ORDERS (user_id, address_id, total_amount, shipping_method, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?)", [user_id, address_id || null, total_amount, shipping_method || null, payment_method || null, payment_status || 'unpaid'])];
            case 4:
                _b = __read.apply(void 0, [_e.sent(), 1]), orderResult = _b[0];
                orderId = orderResult.insertId;
                _e.label = 5;
            case 5:
                _e.trys.push([5, 10, 11, 12]);
                items_1 = __values(items), items_1_1 = items_1.next();
                _e.label = 6;
            case 6:
                if (!!items_1_1.done) return [3 /*break*/, 9];
                item = items_1_1.value;
                return [4 /*yield*/, connection.query("INSERT INTO ORDER_ITEMS (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)", [orderId, item.product_id, item.quantity, item.price_at_purchase])];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8:
                items_1_1 = items_1.next();
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 12];
            case 10:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 11:
                try {
                    if (items_1_1 && !items_1_1.done && (_c = items_1.return)) _c.call(items_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 12: return [4 /*yield*/, connection.commit()];
            case 13:
                _e.sent();
                res.status(201).json({ message: "Rendelés sikeresen létrehozva", order_id: orderId });
                return [3 /*break*/, 17];
            case 14:
                err_3 = _e.sent();
                return [4 /*yield*/, connection.rollback()];
            case 15:
                _e.sent();
                res.status(500).json({ message: "DB hiba a rendelés létrehozásakor", error: err_3 });
                return [3 /*break*/, 17];
            case 16:
                connection.release();
                return [7 /*endfinally*/];
            case 17: return [2 /*return*/];
        }
    });
}); };
exports.createOrder = createOrder;
var getMyOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, _a, rows, err_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id;
                if (!user_id)
                    return [2 /*return*/, res.status(401).json({ message: "Bejelentkezés szükséges" })];
                return [4 /*yield*/, wrapper_1.default.query("\n            SELECT o.*, u.name as user_name \n            FROM ORDERS o\n            JOIN USERS u ON o.user_id = u.user_id\n            WHERE o.user_id = ?\n            ORDER BY o.order_date DESC\n        ", [user_id])];
            case 1:
                _a = __read.apply(void 0, [_c.sent(), 1]), rows = _a[0];
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _c.sent();
                res.status(500).send("Adatbázis hiba!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyOrders = getMyOrders;
var updateOrderStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, status, _a, result, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                status = req.body.status;
                if (!status)
                    return [2 /*return*/, res.status(400).json({ message: "Státusz megadása kötelező" })];
                return [4 /*yield*/, wrapper_1.default.query("UPDATE ORDERS SET status = ? WHERE order_id = ?", [status, id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), result = _a[0];
                if (result.affectedRows === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "Rendelés nem található" })];
                }
                res.json({ message: "Státusz frissítve", order_id: id, status: status });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _b.sent();
                res.status(500).send("Adatbázis hiba!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateOrderStatus = updateOrderStatus;
var updatePaymentStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, payment_status, _a, result, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                payment_status = req.body.payment_status;
                if (!payment_status)
                    return [2 /*return*/, res.status(400).json({ message: "Fizetési státusz megadása kötelező" })];
                return [4 /*yield*/, wrapper_1.default.query("UPDATE ORDERS SET payment_status = ? WHERE order_id = ?", [payment_status, id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), result = _a[0];
                if (result.affectedRows === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "Rendelés nem található" })];
                }
                res.json({ message: "Fizetési státusz frissítve", order_id: id, payment_status: payment_status });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _b.sent();
                res.status(500).send("Adatbázis hiba!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentStatus = updatePaymentStatus;
var deleteOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, rows, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                return [4 /*yield*/, wrapper_1.default.query("SELECT * FROM ORDERS WHERE order_id = ?", [id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                if (!rows[0])
                    return [2 /*return*/, res.status(404).json({ message: "Rendelés nem található" })];
                return [4 /*yield*/, wrapper_1.default.query("DELETE FROM ORDERS WHERE order_id = ?", [id])];
            case 2:
                _b.sent();
                res.json({ message: "Rendelés törölve" });
                return [3 /*break*/, 4];
            case 3:
                err_7 = _b.sent();
                res.status(500).send("Adatbázis hiba!");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteOrder = deleteOrder;
