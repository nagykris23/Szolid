"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
var requireAdmin = function (req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Nincs bejelentkezve." });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin jogosultság szükséges." });
    }
    next();
};
exports.requireAdmin = requireAdmin;
