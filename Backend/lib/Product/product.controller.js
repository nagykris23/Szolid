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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchDataById = exports.putDataById = exports.deleteDataById = exports.postData = exports.getDataById = exports.getAllData = exports.run = void 0;
var wrapper_1 = __importDefault(require("../wrapper"));
var mapRow = function (r) {
    var _a;
    return ({
        product_id: r.product_id,
        category_id: r.category_id,
        category_name: r.category_name,
        name: r.name,
        description: r.description,
        price: r.price,
        stock_quantity: r.stock_quantity,
        image_url: (_a = r.image_url) !== null && _a !== void 0 ? _a : null,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    });
};
var run = function (_req, res) {
    res.json({ status: "ok", message: "Az API fut" });
};
exports.run = run;
var getAllData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryName, query, params, _a, rows, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                categoryName = String(req.query.category || "").toLowerCase();
                query = "\n      SELECT p.*, c.name as category_name \n      FROM PRODUCTS p\n      JOIN CATEGORIES c ON p.category_id = c.category_id\n    ";
                params = [];
                if (categoryName) {
                    query += " WHERE LOWER(c.name) = ?";
                    params.push(categoryName);
                }
                query += " ORDER BY p.product_id";
                return [4 /*yield*/, wrapper_1.default.query(query, params)];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                res.json(rows.map(mapRow));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                res.status(500).json({ message: "DB hiba", error: err_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllData = getAllData;
var getDataById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, query, _a, rows, row, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                query = "\n      SELECT p.*, c.name as category_name \n      FROM PRODUCTS p\n      JOIN CATEGORIES c ON p.category_id = c.category_id\n      WHERE p.product_id = ?\n    ";
                return [4 /*yield*/, wrapper_1.default.query(query, [id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                row = rows[0];
                if (!row)
                    return [2 /*return*/, res.status(404).json({ message: "Termék nem található" })];
                res.json(mapRow(row));
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                res.status(500).json({ message: "DB hiba", error: err_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDataById = getDataById;
var postData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, price, category_id, _b, stock_quantity, _c, image_url, _d, result, insertId, _e, rows, err_3;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 3, , 4]);
                _a = (_f = req.body) !== null && _f !== void 0 ? _f : {}, name = _a.name, description = _a.description, price = _a.price, category_id = _a.category_id, _b = _a.stock_quantity, stock_quantity = _b === void 0 ? 0 : _b, _c = _a.image_url, image_url = _c === void 0 ? null : _c;
                if (price !== undefined)
                    price = Number(price);
                if (stock_quantity !== undefined)
                    stock_quantity = Number(stock_quantity);
                if (!name || !description || isNaN(price) || !category_id) {
                    return [2 /*return*/, res.status(400).json({ message: "Rosszul megadott adat" })];
                }
                return [4 /*yield*/, wrapper_1.default.query("INSERT INTO PRODUCTS (name, description, category_id, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)", [name, description, category_id, price, stock_quantity, image_url])];
            case 1:
                _d = __read.apply(void 0, [_g.sent(), 1]), result = _d[0];
                insertId = result.insertId;
                return [4 /*yield*/, wrapper_1.default.query("\n      SELECT p.*, c.name as category_name \n      FROM PRODUCTS p\n      JOIN CATEGORIES c ON p.category_id = c.category_id\n      WHERE p.product_id = ?\n    ", [insertId])];
            case 2:
                _e = __read.apply(void 0, [_g.sent(), 1]), rows = _e[0];
                res.status(201).json(mapRow(rows[0]));
                return [3 /*break*/, 4];
            case 3:
                err_3 = _g.sent();
                if ((err_3 === null || err_3 === void 0 ? void 0 : err_3.code) === "ER_NO_REFERENCED_ROW_2") {
                    return [2 /*return*/, res.status(400).json({ message: "Érvénytelen category_id" })];
                }
                res.status(500).json({ message: "DB hiba", error: err_3 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.postData = postData;
var deleteDataById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, rowsBefore, row, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                return [4 /*yield*/, wrapper_1.default.query("\n      SELECT p.*, c.name as category_name \n      FROM PRODUCTS p\n      JOIN CATEGORIES c ON p.category_id = c.category_id\n      WHERE p.product_id = ?\n    ", [id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rowsBefore = _a[0];
                row = rowsBefore[0];
                if (!row)
                    return [2 /*return*/, res.status(404).json({ message: "Termék nem található" })];
                return [4 /*yield*/, wrapper_1.default.query("DELETE FROM PRODUCTS WHERE product_id = ?", [id])];
            case 2:
                _b.sent();
                res.json({ message: "Deleted", deleted: mapRow(row) });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                res.status(500).json({ message: "DB hiba", error: err_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteDataById = deleteDataById;
var putDataById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, description, price, category_id, _b, stock_quantity, _c, image_url, _d, rows, err_5;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                _a = (_e = req.body) !== null && _e !== void 0 ? _e : {}, name = _a.name, description = _a.description, price = _a.price, category_id = _a.category_id, _b = _a.stock_quantity, stock_quantity = _b === void 0 ? 0 : _b, _c = _a.image_url, image_url = _c === void 0 ? null : _c;
                if (price !== undefined)
                    price = Number(price);
                if (stock_quantity !== undefined)
                    stock_quantity = Number(stock_quantity);
                if (!name || !description || isNaN(price) || !category_id) {
                    return [2 /*return*/, res.status(400).json({ message: "Rosszul megadott adatok" })];
                }
                return [4 /*yield*/, wrapper_1.default.query("UPDATE PRODUCTS SET name = ?, description = ?, category_id = ?, price = ?, stock_quantity = ?, image_url = ? WHERE product_id = ?", [name, description, category_id, price, stock_quantity, image_url, id])];
            case 1:
                _f.sent();
                return [4 /*yield*/, wrapper_1.default.query("\n      SELECT p.*, c.name as category_name \n      FROM PRODUCTS p\n      JOIN CATEGORIES c ON p.category_id = c.category_id\n      WHERE p.product_id = ?\n    ", [id])];
            case 2:
                _d = __read.apply(void 0, [_f.sent(), 1]), rows = _d[0];
                res.json(mapRow(rows[0]));
                return [3 /*break*/, 4];
            case 3:
                err_5 = _f.sent();
                if ((err_5 === null || err_5 === void 0 ? void 0 : err_5.code) === "ER_NO_REFERENCED_ROW_2") {
                    return [2 /*return*/, res.status(400).json({ message: "Érvénytelen category_id" })];
                }
                res.status(500).json({ message: "DB hiba", error: err_5 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.putDataById = putDataById;
var patchDataById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, description, price, category_id, stock_quantity, image_url, _b, rowsBefore, existing, updates, params, _c, rowsAfter, err_6;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, , 6]);
                id = Number(req.params.id);
                _a = (_d = req.body) !== null && _d !== void 0 ? _d : {}, name = _a.name, description = _a.description, price = _a.price, category_id = _a.category_id, stock_quantity = _a.stock_quantity, image_url = _a.image_url;
                return [4 /*yield*/, wrapper_1.default.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id])];
            case 1:
                _b = __read.apply(void 0, [_e.sent(), 1]), rowsBefore = _b[0];
                existing = rowsBefore[0];
                if (!existing)
                    return [2 /*return*/, res.status(404).json({ message: "Termék nem található" })];
                updates = [];
                params = [];
                if (name !== undefined) {
                    updates.push("name = ?");
                    params.push(name);
                }
                if (description !== undefined) {
                    updates.push("description = ?");
                    params.push(description);
                }
                if (category_id !== undefined) {
                    updates.push("category_id = ?");
                    params.push(category_id);
                }
                if (price !== undefined) {
                    price = Number(price);
                    if (isNaN(price))
                        return [2 /*return*/, res.status(400).json({ message: "Az árnak számnak kell lennie" })];
                    updates.push("price = ?");
                    params.push(price);
                }
                if (stock_quantity !== undefined) {
                    stock_quantity = Number(stock_quantity);
                    updates.push("stock_quantity = ?");
                    params.push(stock_quantity);
                }
                if (image_url !== undefined) {
                    updates.push("image_url = ?");
                    params.push(image_url);
                }
                if (!updates.length) return [3 /*break*/, 3];
                params.push(id);
                return [4 /*yield*/, wrapper_1.default.query("UPDATE PRODUCTS SET ".concat(updates.join(", "), " WHERE product_id = ?"), params)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3: return [4 /*yield*/, wrapper_1.default.query("\n      SELECT p.*, c.name as category_name \n      FROM PRODUCTS p\n      JOIN CATEGORIES c ON p.category_id = c.category_id\n      WHERE p.product_id = ?\n    ", [id])];
            case 4:
                _c = __read.apply(void 0, [_e.sent(), 1]), rowsAfter = _c[0];
                res.json(mapRow(rowsAfter[0]));
                return [3 /*break*/, 6];
            case 5:
                err_6 = _e.sent();
                if ((err_6 === null || err_6 === void 0 ? void 0 : err_6.code) === "ER_NO_REFERENCED_ROW_2") {
                    return [2 /*return*/, res.status(400).json({ message: "Érvénytelen category_id" })];
                }
                res.status(500).json({ message: "DB hiba", error: err_6 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.patchDataById = patchDataById;
