"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
var requireAdmin = function (req, res, next) {
    if (!req.user) {
        res.status(401).json({ message: "Nincs bejelentkezve." });
        return;
    }
    if (req.user.role !== "admin") {
        res.status(403).json({ message: "Admin jogosultság szükséges." });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
