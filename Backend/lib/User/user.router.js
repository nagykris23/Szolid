"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("./auth.controller");
var auth_middleware_1 = require("../middleware/auth.middleware");
var router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/me", auth_middleware_1.requireAuth, function (req, res) {
    res.json({
        message: "Token érvényes",
        user: req.user,
    });
});
exports.default = router;
