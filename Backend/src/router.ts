import { Router } from "express";
import { run, getAllData, getDataById, postData, deleteDataById, putDataById, patchDataById } from "./controller";

const router = Router();

router.get("/health", run);

router.get("/products", getAllData);
router.get("/products/:id", getDataById);

router.post("/admin/products", postData);
router.delete("/admin/products/:id", deleteDataById);
router.put("/admin/products/:id", putDataById);
router.patch("/admin/products/:id", patchDataById);

export default router;
