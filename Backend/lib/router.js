"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("./middleware/auth.middleware");
var controller_1 = require("./controller");
var auth_controller_1 = require("./User/auth.controller");
var router = (0, express_1.Router)();
router.get("/health", controller_1.run);
router.get("/products", controller_1.getAllData);
router.get("/products/:id", controller_1.getDataById);
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/admin/products", controller_1.postData);
router.delete("/admin/products/:id", controller_1.deleteDataById);
router.put("/admin/products/:id", controller_1.putDataById);
router.patch("/admin/products/:id", controller_1.patchDataById);
//token teszt
router.get("/auth/me", auth_middleware_1.requireAuth, function (req, res) {
    res.json({
        message: "Token érvényes",
        user: req.user,
    });
});
exports.default = router;
