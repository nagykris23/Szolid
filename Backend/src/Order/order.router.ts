import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    createOrder,
    getMyOrders,
} from "./order.controller";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/my", requireAuth, getMyOrders);

//admin
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.get("/:id", requireAuth, requireAdmin, getOrderById);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);
router.patch("/:id/payment", requireAuth, requireAdmin, updatePaymentStatus);
router.delete("/:id", requireAuth, requireAdmin, deleteOrder);

export default router;
