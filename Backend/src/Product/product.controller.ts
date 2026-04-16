import { Request, Response } from "express";
import pool from "../wrapper";

export const getAllData = async (req: Request, res: Response) => {
  try {
    const categoryName = String(req.query.category || "").toLowerCase();
    let query = `
      SELECT p.*, c.name as category_name 
      FROM PRODUCTS p
      JOIN CATEGORIES c ON p.category_id = c.category_id
    `;
    const params: any[] = [];

    if (categoryName) {
      query += " WHERE LOWER(c.name) = ?";
      params.push(categoryName);
    }

    query += " ORDER BY p.product_id";
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).send("Adatbázis hiba!");
  }
};

export const getDataById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM PRODUCTS p
      JOIN CATEGORIES c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    const row = (rows as any[])[0];
    if (!row) return res.status(404).json({ message: "Termék nem található" });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "DB hiba", error: err });
  }
};

export const postData = async (req: Request, res: Response) => {
  try {
    let { name, description, price, category_id, stock_quantity = 0, image_url = null } = req.body ?? {};
    
    if (price !== undefined) price = Number(price);
    if (stock_quantity !== undefined) stock_quantity = Number(stock_quantity);

    if (!name || !description || isNaN(price) || !category_id) {
      return res.status(400).json({ message: "Rosszul megadott adat" });
    }

    const [result]: any = await pool.query(
      "INSERT INTO PRODUCTS (name, description, category_id, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, category_id, price, stock_quantity, image_url]
    );

    const insertId = result.insertId;
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM PRODUCTS p
      JOIN CATEGORIES c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [insertId]);
    res.status(201).json(rows);
  } catch (err: any) {
    if (err?.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Érvénytelen category_id" });
    }
    res.status(500).send("Adatbázis hiba!");
  }
};

export const deleteDataById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM PRODUCTS p
      JOIN CATEGORIES c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [id]);
    const row = (rows as any[])[0];
    if (!row) return res.status(404).json({ message: "Termék nem található" });

    const deletedProduct = (rows as any[])[0];

    await pool.query("DELETE FROM PRODUCTS WHERE product_id = ?", [id]);
    res.json({ message: "Deleted", deleted:  deletedProduct});
  } catch (err) {
    res.status(500).send("Adatbázis hiba!");
  }
};

export const putDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    let { name, description, price, category_id, stock_quantity = 0, image_url = null } = req.body ?? {};

    if (price !== undefined) price = Number(price);
    if (stock_quantity !== undefined) stock_quantity = Number(stock_quantity);

    if (!name || !description || isNaN(price) || !category_id) {
      return res.status(400).json({ message: "Rosszul megadott adatok" });
    }

    await pool.query(
      "UPDATE PRODUCTS SET name = ?, description = ?, category_id = ?, price = ?, stock_quantity = ?, image_url = ? WHERE product_id = ?",
      [name, description, category_id, price, stock_quantity, image_url, id]
    );

    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM PRODUCTS p
      JOIN CATEGORIES c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [id]);
    res.json(rows);
  } catch (err: any) {
    if (err?.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Érvénytelen category_id" });
    }
    res.status(500).send("Adatbázis hiba!");
  }
};

export const patchDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    let { name, description, price, category_id, stock_quantity, image_url } = req.body ?? {};

    const [rowsBefore] = await pool.query("SELECT * FROM PRODUCTS WHERE product_id = ?", [id]);
    const existing = (rowsBefore as any[])[0];
    if (!existing) return res.status(404).json({ message: "Termék nem található" });

    const updates: string[] = [];
    const params: any[] = [];
    if (name !== undefined) { updates.push("name = ?"); params.push(name); }
    if (description !== undefined) { updates.push("description = ?"); params.push(description); }
    if (category_id !== undefined) { updates.push("category_id = ?"); params.push(category_id); }
    if (price !== undefined) { 
      price = Number(price);
      if (isNaN(price)) return res.status(400).json({ message: "Az árnak számnak kell lennie" });
      updates.push("price = ?"); 
      params.push(price); 
    }
    if (stock_quantity !== undefined) { 
      stock_quantity = Number(stock_quantity);
      updates.push("stock_quantity = ?"); 
      params.push(stock_quantity); 
    }
    if (image_url !== undefined) { updates.push("image_url = ?"); params.push(image_url); }

    if (updates.length) {
      params.push(id);
      await pool.query(`UPDATE PRODUCTS SET ${updates.join(", ")} WHERE product_id = ?`, params);
    }

    const [rowsAfter] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM PRODUCTS p
      JOIN CATEGORIES c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [id]);
    res.json((rowsAfter as any[])[0]);
  } catch (err: any) {
    if (err?.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Érvénytelen category_id" });
    }
    res.status(500).json({ message: "DB hiba", error: err });
  }
};
