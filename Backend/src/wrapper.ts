import mysql from "mysql2/promise";
import { DB } from "./config";

const pool = mysql.createPool({
  host: DB.host,
  user: DB.user,
  password: DB.password,
  database: DB.database,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;