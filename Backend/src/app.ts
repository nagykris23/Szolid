import express from "express";
import cors from "cors";
import productRouter from "./Product/product.router";
import userRouter from "./User/user.router";
import categoryRouter from "./Category/category.router";
import orderRouter from "./Order/order.router";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("src/assets"));
app.use("/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);

export default app;
module.exports = app;