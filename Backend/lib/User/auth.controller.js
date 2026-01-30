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
exports.login = exports.register = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_model_1 = require("./user.model");
var config_1 = require("../config");
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, existing, password_hash, created, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                if (!name || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "Név, email és jelszó kötelező." })];
                }
                return [4 /*yield*/, (0, user_model_1.findUserByEmail)(email)];
            case 1:
                existing = _b.sent();
                if (existing) {
                    return [2 /*return*/, res.status(409).json({ message: "Ezzel az emaillel már létezik felhasználó." })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                password_hash = _b.sent();
                return [4 /*yield*/, (0, user_model_1.createUser)({
                        name: name,
                        email: email,
                        password_hash: password_hash,
                        role: "user",
                    })];
            case 3:
                created = _b.sent();
                token = jsonwebtoken_1.default.sign({ user_id: created.user_id, email: created.email, role: created.role }, config_1.JWT_SECRET, { expiresIn: "2h" });
                return [2 /*return*/, res.status(201).json({
                        token: token,
                        user: {
                            user_id: created.user_id,
                            name: created.name,
                            email: created.email,
                            role: created.role,
                        },
                    })];
            case 4:
                err_1 = _b.sent();
                // ha megis atcsuszik a duplikalt email es DB dobja
                if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.code) === "ER_DUP_ENTRY") {
                    return [2 /*return*/, res.status(409).json({ message: "Ezzel az emaillel már létezik felhasználó." })];
                }
                console.error(err_1);
                return [2 /*return*/, res.status(500).json({ message: "Szerver hiba." })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, ok, token, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "Email és jelszó kötelező." })];
                }
                return [4 /*yield*/, (0, user_model_1.findUserByEmail)(email)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: "Hibás email vagy jelszó." })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password_hash)];
            case 2:
                ok = _b.sent();
                if (!ok) {
                    return [2 /*return*/, res.status(401).json({ message: "Hibás email vagy jelszó." })];
                }
                token = jsonwebtoken_1.default.sign({ user_id: user.user_id, email: user.email, role: user.role }, config_1.JWT_SECRET, { expiresIn: "2h" });
                return [2 /*return*/, res.json({
                        token: token,
                        user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role },
                    })];
            case 3:
                err_2 = _b.sent();
                console.error(err_2);
                return [2 /*return*/, res.status(500).json({ message: "Szerver hiba." })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
