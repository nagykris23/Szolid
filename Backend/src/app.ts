import express from "express";
import cors from "cors";
import productRouter from "./Product/product.router";
import userRouter from "./User/user.router";
import { run } from "./Product/product.controller";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", run);

app.use("/auth", userRouter);
app.use("/api/products", productRouter);

export default app;
