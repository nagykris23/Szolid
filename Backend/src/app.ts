import express from "express";
import cors from "cors";
import productRouter from "./Product/product.router";
import userRouter from "./User/user.router";
import categoryRouter from "./Category/category.router";
import orderRouter from "./Order/order.router";
import { run } from "./Product/product.controller";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("src/assets"));

app.get("/health", run);

app.use("/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);

export default app;
