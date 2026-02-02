import { Router } from "express";
import { requireAuth, AuthRequest } from "./middleware/auth.middleware";
import { requireAdmin } from "./middleware/admin.middleware";
import { run, getAllData, getDataById, postData, deleteDataById, putDataById, patchDataById } from "./controller";
import { login, register } from "./User/auth.controller";

const router = Router();

const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

router.get("/health", run);

router.get("/products", requireAuth, getAllData);
router.get("/products/:id", requireAuth, getDataById);

router.post("/register", register);
router.post("/login", login);

adminRouter.post("/products", postData);
adminRouter.delete("/products/:id", deleteDataById);
adminRouter.put("/products/:id", putDataById);
adminRouter.patch("/products/:id", patchDataById);

//token teszt
router.get("/auth/me", requireAuth, (req: AuthRequest, res) => {
  res.json({
    message: "Token érvényes",
    user: req.user,
  });
});

export default router;
