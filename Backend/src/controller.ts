import { Request, Response } from "express";
import pool from "./wrapper";
import { Product } from "./model";

const mapRow = (r: any): Product => ({
  id: r.product_id,
  name: r.name,
  description: r.description,
  price: r.price,
  category: r.category,
  stock_quantity: r.stock_quantity,
  image_url: r.image_url ?? null,
  created_at: r.created_at ? new Date(r.created_at).toISOString() : undefined,
});

export const run = (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Az API fut" });
};

export const getAllData = async (req: Request, res: Response) => {
  try {
    const category = String(req.query.category || "").toLowerCase();
    if (!category) {
      const [rows] = await pool.query("SELECT * FROM PRODUCTS ORDER BY product_id");
      return res.json((rows as any[]).map(mapRow));
    }
    const [rows] = await pool.query(
      "SELECT * FROM PRODUCTS WHERE LOWER(category) = ? ORDER BY product_id",
      [category]
    );
    res.json((rows as any[]).map(mapRow));
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};

export const getDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id]);
    const row = (rows as any[])[0];
    if (!row) return res.status(404).json({ message: "Termék nem található" });
    res.json(mapRow(row));
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};

export const postData = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock_quantity = 0, image_url = null } = req.body ?? {};
    if (!name || !description || typeof price !== "number" || !category) {
      return res.status(400).json({ message: "Rosszul megadott adat" });
    }

    const [result]: any = await pool.query(
      "INSERT INTO PRODUCTS (name, description, category, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, category, price, stock_quantity, image_url]
    );

    const insertId = result.insertId;
    const [rows] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [insertId]);
    res.status(201).json(mapRow((rows as any[])[0]));
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};

export const deleteDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [rowsBefore] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id]);
    const row = (rowsBefore as any[])[0];
    if (!row) return res.status(404).json({ message: "Termék nem található" });

    await pool.query("DELETE FROM PRODUCTS WHERE product_id = ?", [id]);
    res.json({ message: "Deleted", deleted: mapRow(row) });
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};

export const putDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, category, stock_quantity = 0, image_url = null } = req.body ?? {};

    if (!name || !description || typeof price !== "number" || !category) {
      return res.status(400).json({ message: "Rosszul megadott adatok" });
    }

    await pool.query(
      "UPDATE PRODUCTS SET name = ?, description = ?, category = ?, price = ?, stock_quantity = ?, image_url = ? WHERE product_id = ?",
      [name, description, category, price, stock_quantity, image_url, id]
    );

    const [rows] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id]);
    res.json(mapRow((rows as any[])[0]));
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};

export const patchDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, category, stock_quantity, image_url } = req.body ?? {};

    const [rowsBefore] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id]);
    const existing = (rowsBefore as any[])[0];
    if (!existing) return res.status(404).json({ message: "Termék nem található" });

    if (price !== undefined && typeof price !== "number") {
      return res.status(400).json({ message: "Az árnak egy számnak kell lennie" });
    }

    const updates: string[] = [];
    const params: any[] = [];
    if (name !== undefined) { updates.push("name = ?"); params.push(name); }
    if (description !== undefined) { updates.push("description = ?"); params.push(description); }
    if (category !== undefined) { updates.push("category = ?"); params.push(category); }
    if (price !== undefined) { updates.push("price = ?"); params.push(price); }
    if (stock_quantity !== undefined) { updates.push("stock_quantity = ?"); params.push(stock_quantity); }
    if (image_url !== undefined) { updates.push("image_url = ?"); params.push(image_url); }

    if (updates.length) {
      params.push(id);
      await pool.query(`UPDATE PRODUCTS SET ${updates.join(", ")} WHERE product_id = ?`, params);
    }

    const [rowsAfter] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id]);
    res.json(mapRow((rowsAfter as any[])[0]));
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};