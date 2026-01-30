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
exports.createUser = exports.findUserByEmail = void 0;
var wrapper_1 = __importDefault(require("../wrapper"));
var findUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rows, row;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, wrapper_1.default.query("SELECT user_id, name, email, password_hash, role, created_at FROM USERS WHERE email = ? LIMIT 1", [email])];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                row = rows[0];
                if (!row)
                    return [2 /*return*/, null];
                return [2 /*return*/, {
                        user_id: row.user_id,
                        name: row.name,
                        email: row.email,
                        password_hash: row.password_hash,
                        role: row.role,
                        created_at: row.created_at ? new Date(row.created_at).toISOString() : undefined,
                    }];
        }
    });
}); };
exports.findUserByEmail = findUserByEmail;
var createUser = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var role, _a, result, insertId, _b, rows, row;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                role = (_c = input.role) !== null && _c !== void 0 ? _c : "user";
                return [4 /*yield*/, wrapper_1.default.query("INSERT INTO USERS (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [input.name, input.email, input.password_hash, role])];
            case 1:
                _a = __read.apply(void 0, [_d.sent(), 1]), result = _a[0];
                insertId = result.insertId;
                return [4 /*yield*/, wrapper_1.default.query("SELECT user_id, name, email, password_hash, role, created_at FROM USERS WHERE user_id = ? LIMIT 1", [insertId])];
            case 2:
                _b = __read.apply(void 0, [_d.sent(), 1]), rows = _b[0];
                row = rows[0];
                return [2 /*return*/, {
                        user_id: row.user_id,
                        name: row.name,
                        email: row.email,
                        password_hash: row.password_hash,
                        role: row.role,
                        created_at: row.created_at ? new Date(row.created_at).toISOString() : undefined,
                    }];
        }
    });
}); };
exports.createUser = createUser;
