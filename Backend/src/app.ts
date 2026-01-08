import express from "express";
import cors from "cors";
import router from "./router";
import authRouter from "./router";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRouter);
app.use("/api", router);

export default app;
