"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middleware/auth.middleware");
var admin_middleware_1 = require("../middleware/admin.middleware");
var category_controller_1 = require("./category.controller");
var router = (0, express_1.Router)();
// public
router.get("/", category_controller_1.getAllCategories);
router.get("/:id", category_controller_1.getCategoryById);
// admin only
router.post("/", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, category_controller_1.createCategory);
router.put("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, category_controller_1.updateCategory);
router.delete("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, category_controller_1.deleteCategory);
exports.default = router;
