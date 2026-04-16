"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
var requireAuth = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Nincs token megadva." });
        return;
    }
    var token = authHeader.split(" ")[1];
    try {
        var decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_a) {
        res.status(401).json({ message: "Érvénytelen vagy lejárt token." });
        return;
    }
};
exports.requireAuth = requireAuth;
