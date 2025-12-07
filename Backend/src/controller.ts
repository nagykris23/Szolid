import { Request, Response } from "express";
import { products, Product } from "./model";

export const run = (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Az API fut" });
};

export const getAllData = (req: Request, res: Response) => {
  const category = String(req.query.category || "").toLowerCase();

  if (!category) {
    return res.json(products);
  }

  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category
  );

  res.json(filtered);
};

export const getDataById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = products.find((p) => p.id === id);

  if (!item) {
    return res.status(404).json({ message: "Termék nem található" });
  }

  res.json(item);
};

export const postData = (req: Request, res: Response) => {
  const { name, description, price, category } = req.body ?? {};

  if (!name || !description || typeof price !== "number" || !category) {
    return res.status(400).json({
      message: "Rosszul megadott adat",
    });
  }

  const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const newProduct: Product = {
    id: newId,
    name,
    description,
    price,
    category,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
};

export const deleteDataById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Termék nem található" });
  }

  const deleted = products[index];
  products.splice(index, 1);

  res.json({ message: "Deleted", deleted });
};

export const putDataById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Termék nem található" });
  }

  const { name, description, price, category } = req.body ?? {};

  if (!name || !description || typeof price !== "number" || !category) {
    return res.status(400).json({
      message: "Rosszul megadott adatok",
    });
  }

  const updated: Product = { id, name, description, price, category };
  products[index] = updated;

  res.json(updated);
};

export const patchDataById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = products.find((p) => p.id === id);

  if (!item) {
    return res.status(404).json({ message: "Termék nem található" });
  }

  const { name, description, price, category } = req.body ?? {};

  if (price !== undefined && typeof price !== "number") {
    return res.status(400).json({ message: "Az árnak egy számnak kell lennie" });
  }

  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (price !== undefined) item.price = price;
  if (category !== undefined) item.category = category;

  res.json(item);
};
