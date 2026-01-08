import dotenv from "dotenv";
dotenv.config();

export const DB = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "oxi_db",
};

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this-in-env";