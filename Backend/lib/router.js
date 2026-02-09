"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("./middleware/auth.middleware");
var admin_middleware_1 = require("./middleware/admin.middleware");
var controller_1 = require("./controller");
var auth_controller_1 = require("./User/auth.controller");
var router = (0, express_1.Router)();
var adminRouter = (0, express_1.Router)();
adminRouter.use(auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin);
router.get("/health", controller_1.run);
router.get("/products", auth_middleware_1.requireAuth, controller_1.getAllData);
router.get("/products/:id", auth_middleware_1.requireAuth, controller_1.getDataById);
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
adminRouter.post("/products", controller_1.postData);
adminRouter.delete("/products/:id", controller_1.deleteDataById);
adminRouter.put("/products/:id", controller_1.putDataById);
adminRouter.patch("/products/:id", controller_1.patchDataById);
//token teszt
router.get("/auth/me", auth_middleware_1.requireAuth, function (req, res) {
    res.json({
        message: "Token érvényes",
        user: req.user,
    });
});
exports.default = router;
