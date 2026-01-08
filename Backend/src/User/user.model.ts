import pool from "../wrapper";
import { User } from "../model";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, password_hash, role, created_at FROM USERS WHERE email = ? LIMIT 1",
    [email]
  );

  const row = (rows as any[])[0];
  if (!row) return null;

  return {
    user_id: row.user_id,
    name: row.name,
    email: row.email,
    password_hash: row.password_hash,
    role: row.role,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
};

export type CreateUserInput = {
  name: string;
  email: string;
  password_hash: string;
  role?: string;
};

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const role = input.role ?? "user";

  const [result]: any = await pool.query(
    "INSERT INTO USERS (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [input.name, input.email, input.password_hash, role]
  );

  const insertId = result.insertId;

  const [rows] = await pool.query(
    "SELECT user_id, name, email, password_hash, role, created_at FROM USERS WHERE user_id = ? LIMIT 1",
    [insertId]
  );

  const row = (rows as any[])[0];
  return {
    user_id: row.user_id,
    name: row.name,
    email: row.email,
    password_hash: row.password_hash,
    role: row.role,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
};