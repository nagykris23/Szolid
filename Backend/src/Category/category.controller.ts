import { Request, Response } from "express";
import pool from "../wrapper";

export const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const [results] = await pool.query(
            "SELECT * FROM CATEGORIES ORDER BY category_id"
        ) as Array<any>;

        res.status(200).send(results);
    } catch (err) {
        console.log(err);
        res.status(500).send("Adatbázis hiba!");
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        res.status(400).send("Hibás paraméter!");
        return;
    }
    
    try {
        const [results] = await pool.query(
            "SELECT * FROM CATEGORIES WHERE category_id = ?",
            [id]
        ) as Array<any>;

        if (results.length === 0) {
            res.status(404).send("Nincs ilyen kategória!");
            return;
        }

        res.status(200).send(results);
    } catch (err) {
        console.log(err);
        res.status(500).send("Adatbázis hiba!");
    }
};

export const createCategory = async (req: Request, res: Response) => {
    const name = req.body?.name;

    if (!name || name.trim() === "") {
        res.status(400).send("Név megadása kötelező!");
        return;
    }
    
    try {
        const [results] = await pool.query(
            "INSERT INTO CATEGORIES VALUES (null, ?)",
            [name]
        ) as Array<any>;

        res.status(200).send(results.insertId);
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(400).send("Ez a kategória már létezik!");
        }
        res.status(500).send("Adatbázis hiba!");
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const name = req.body?.name;

    if (isNaN(id)) {
        res.status(400).send("Számnak kell lennie!");
        return;
    }

    if (!name || name.trim() === "") {
        res.status(400).send("Nem adott meg adatokat!");
        return;
    }

    try {
        const [results] = await pool.query(
            "UPDATE CATEGORIES SET name = ? WHERE category_id = ?",
            [name, id]
        ) as Array<any>;

        if (results.affectedRows === 0) {
            res.status(404).send("Nincs ilyen kategória!");
            return;
        }

        res.status(200).send({ category_id: id, name });
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Ez a kategória név már foglalt" });
        }
        res.status(500).send("Adatbázis hiba!");
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).send("Számnak kell lennie!");
        return;
    }
    
    try {
        const [results] = await pool.query(
            "DELETE FROM CATEGORIES WHERE category_id = ?",
            [id]
        ) as Array<any>;

        if (results.affectedRows === 0) {
            res.status(404).send("Nincs ilyen kategória!");
            return;
        }
        
        res.status(200).send("Kategória törölve");
    } catch (err: any) {
        console.log(err);

        if (err?.code === "ER_ROW_IS_REFERENCED_2") {
            res.status(400).send("Nem törölhető mert már tartozik hozzá termék");
            return;
        }
        res.status(500).send("Adatbázis hiba!");
    }
};
