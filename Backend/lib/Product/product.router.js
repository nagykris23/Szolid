"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middleware/auth.middleware");
var admin_middleware_1 = require("../middleware/admin.middleware");
var product_controller_1 = require("./product.controller");
var router = (0, express_1.Router)();
//public
router.get("/", product_controller_1.getAllData);
router.get("/:id", product_controller_1.getDataById);
//privat
router.post("/", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, product_controller_1.postData);
router.delete("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, product_controller_1.deleteDataById);
router.put("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, product_controller_1.putDataById);
router.patch("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, product_controller_1.patchDataById);
exports.default = router;
