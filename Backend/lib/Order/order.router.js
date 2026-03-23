"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middleware/auth.middleware");
var admin_middleware_1 = require("../middleware/admin.middleware");
var order_controller_1 = require("./order.controller");
var router = (0, express_1.Router)();
router.post("/", auth_middleware_1.requireAuth, order_controller_1.createOrder);
router.get("/my", auth_middleware_1.requireAuth, order_controller_1.getMyOrders);
//admin
router.get("/", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, order_controller_1.getAllOrders);
router.get("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, order_controller_1.getOrderById);
router.patch("/:id/status", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, order_controller_1.updateOrderStatus);
router.patch("/:id/payment", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, order_controller_1.updatePaymentStatus);
router.delete("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, order_controller_1.deleteOrder);
exports.default = router;
