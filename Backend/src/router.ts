import { Router } from "express";
import { requireAuth, AuthRequest } from "./middleware/auth.middleware";
import { run, getAllData, getDataById, postData, deleteDataById, putDataById, patchDataById } from "./controller";
import { login, register } from "./User/auth.controller";

const router = Router();

router.get("/health", run);

router.get("/products", getAllData);
router.get("/products/:id", getDataById);

router.post("/register", register);
router.post("/login", login);

router.post("/admin/products", postData);
router.delete("/admin/products/:id", deleteDataById);
router.put("/admin/products/:id", putDataById);
router.patch("/admin/products/:id", patchDataById);


//token teszt
router.get("/auth/me", requireAuth, (req: AuthRequest, res) => {
  res.json({
    message: "Token érvényes",
    user: req.user,
  });
});

export default router;
