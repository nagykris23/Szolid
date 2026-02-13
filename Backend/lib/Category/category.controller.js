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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
var wrapper_1 = __importDefault(require("../wrapper"));
var mapRow = function (r) { return ({
    category_id: r.category_id,
    name: r.name,
}); };
var getAllCategories = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rows, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, wrapper_1.default.query("SELECT * FROM CATEGORIES ORDER BY category_id")];
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
exports.getAllCategories = getAllCategories;
var getCategoryById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, rows, row, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                return [4 /*yield*/, wrapper_1.default.query("SELECT * FROM CATEGORIES WHERE category_id = ?", [id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                row = rows[0];
                if (!row)
                    return [2 /*return*/, res.status(404).json({ message: "Kategória nem található" })];
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
exports.getCategoryById = getCategoryById;
var createCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, _a, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                name = req.body.name;
                if (!name)
                    return [2 /*return*/, res.status(400).json({ message: "Név megadása kötelező" })];
                return [4 /*yield*/, wrapper_1.default.query("INSERT INTO CATEGORIES (name) VALUES (?)", [name])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), result = _a[0];
                res.status(201).json({ category_id: result.insertId, name: name });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                if ((err_3 === null || err_3 === void 0 ? void 0 : err_3.code) === "ER_DUP_ENTRY") {
                    return [2 /*return*/, res.status(400).json({ message: "Ez a kategória már létezik" })];
                }
                res.status(500).json({ message: "DB hiba", error: err_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCategory = createCategory;
var updateCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, name, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = Number(req.params.id);
                name = req.body.name;
                if (!name)
                    return [2 /*return*/, res.status(400).json({ message: "Név megadása kötelező" })];
                return [4 /*yield*/, wrapper_1.default.query("UPDATE CATEGORIES SET name = ? WHERE category_id = ?", [name, id])];
            case 1:
                _a.sent();
                res.json({ category_id: id, name: name });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                if ((err_4 === null || err_4 === void 0 ? void 0 : err_4.code) === "ER_DUP_ENTRY") {
                    return [2 /*return*/, res.status(400).json({ message: "Ez a kategória név már foglalt" })];
                }
                res.status(500).json({ message: "DB hiba", error: err_4 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateCategory = updateCategory;
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, rows, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = Number(req.params.id);
                return [4 /*yield*/, wrapper_1.default.query("SELECT * FROM CATEGORIES WHERE category_id = ?", [id])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                if (!rows[0])
                    return [2 /*return*/, res.status(404).json({ message: "Kategória nem található" })];
                return [4 /*yield*/, wrapper_1.default.query("DELETE FROM CATEGORIES WHERE category_id = ?", [id])];
            case 2:
                _b.sent();
                res.json({ message: "Kategória törölve" });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                if ((err_5 === null || err_5 === void 0 ? void 0 : err_5.code) === "ER_ROW_IS_REFERENCED_2") {
                    return [2 /*return*/, res.status(400).json({ message: "A kategória nem törölhető, mert termékek tartoznak hozzá" })];
                }
                res.status(500).json({ message: "DB hiba", error: err_5 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
