import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "./user.model";
import { JWT_SECRET } from "../config";


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Név, email és jelszó kötelező." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Ezzel az emaillel már létezik felhasználó." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const created = await createUser({
      name,
      email,
      password_hash,
      role: "user",
    });

    const token = jwt.sign(
      { user_id: created.user_id, email: created.email, role: created.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      token,
      user: {
        user_id: created.user_id,
        name: created.name,
        email: created.email,
        role: created.role,
      },
    });
  } catch (err: any) {
    // ha megis atcsuszik a duplikalt email es DB dobja
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Ezzel az emaillel már létezik felhasználó." });
    }
    console.error(err);
    return res.status(500).json({ message: "Szerver hiba." });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: "Email és jelszó kötelező." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Hibás email vagy jelszó." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Hibás email vagy jelszó." });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Szerver hiba." });
  }
};
