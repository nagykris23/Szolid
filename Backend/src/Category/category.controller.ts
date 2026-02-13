import { Request, Response } from "express";
import pool from "../wrapper";
import { Category } from "./category.model";

const mapRow = (r: any): Category => ({
    category_id: r.category_id,
    name: r.name,
});

export const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM CATEGORIES ORDER BY category_id");
        res.json((rows as any[]).map(mapRow));
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [rows] = await pool.query("SELECT * FROM CATEGORIES WHERE category_id = ?", [id]);
        const row = (rows as any[])[0];
        if (!row) return res.status(404).json({ message: "Kategória nem található" });
        res.json(mapRow(row));
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Név megadása kötelező" });

        const [result]: any = await pool.query("INSERT INTO CATEGORIES (name) VALUES (?)", [name]);
        res.status(201).json({ category_id: result.insertId, name });
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Ez a kategória már létezik" });
        }
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Név megadása kötelező" });

        const [result]: any = await pool.query("UPDATE CATEGORIES SET name = ? WHERE category_id = ?", [name, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Kategória nem található" });
        }

        res.json({ category_id: id, name });
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Ez a kategória név már foglalt" });
        }
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [rows] = await pool.query("SELECT * FROM CATEGORIES WHERE category_id = ?", [id]);
        if (!(rows as any[])[0]) return res.status(404).json({ message: "Kategória nem található" });

        await pool.query("DELETE FROM CATEGORIES WHERE category_id = ?", [id]);
        res.json({ message: "Kategória törölve" });
    } catch (err: any) {
        if (err?.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).json({ message: "A kategória nem törölhető, mert termékek tartoznak hozzá" });
        }
        res.status(500).json({ message: "DB hiba", error: err });
    }
};
