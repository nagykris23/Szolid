import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { getAllData, getDataById, postData, deleteDataById, putDataById, patchDataById } from "./product.controller";

const router = Router();

//public
router.get("/", getAllData);
router.get("/:id", getDataById);

//privat
router.post("/", requireAuth, requireAdmin, postData);
router.delete("/:id", requireAuth, requireAdmin, deleteDataById);
router.put("/:id", requireAuth, requireAdmin, putDataById);
router.patch("/:id", requireAuth, requireAdmin, patchDataById);

export default router;
