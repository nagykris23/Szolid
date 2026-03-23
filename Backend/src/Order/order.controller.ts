import { Response } from "express";
import pool from "../wrapper";
import { Order, OrderItem } from "./order.model";
import { AuthRequest } from "../middleware/auth.middleware";

const mapOrderRow = (r: any): Order => ({
    order_id: r.order_id,
    user_id: r.user_id,
    user_name: r.user_name,
    address_id: r.address_id,
    order_date: r.order_date ? new Date(r.order_date).toISOString() : "",
    total_amount: r.total_amount,
    status: r.status,
    shipping_method: r.shipping_method,
    payment_method: r.payment_method,
    payment_status: r.payment_status,
});

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
    try {
        const [rows] = await pool.query(`
      SELECT o.*, u.name as user_name 
      FROM ORDERS o
      JOIN USERS u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);
        res.json((rows as any[]).map(mapOrderRow));
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [orderRows] = await pool.query(`
      SELECT o.*, u.name as user_name 
      FROM ORDERS o
      JOIN USERS u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [id]);

        const orderRow = (orderRows as any[])[0];
        if (!orderRow) return res.status(404).json({ message: "Rendelés nem található" });

        const [itemRows] = await pool.query(`
      SELECT oi.*, p.name 
      FROM ORDER_ITEMS oi
      JOIN PRODUCTS p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `, [id]);

        const items: OrderItem[] = (itemRows as any[]).map(r => ({
            product_id: r.product_id,
            name: r.name,
            quantity: r.quantity,
            price_at_purchase: r.price_at_purchase
        }));

        const order = mapOrderRow(orderRow);
        order.items = items;

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const user_id = req.user?.user_id;
        if (!user_id) return res.status(401).json({ message: "Bejelentkezés szükséges" });

        const { address_id, total_amount, shipping_method, payment_method, payment_status, items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "A rendelésnek tartalmaznia kell termékeket" });
        }

        const [orderResult]: any = await connection.query(
            "INSERT INTO ORDERS (user_id, address_id, total_amount, shipping_method, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, address_id || null, total_amount, shipping_method || null, payment_method || null, payment_status || 'unpaid']
        );
        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                "INSERT INTO ORDER_ITEMS (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.price_at_purchase]
            );
        }

        await connection.commit();
        res.status(201).json({ message: "Rendelés sikeresen létrehozva", order_id: orderId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: "DB hiba a rendelés létrehozásakor", error: err });
    } finally {
        connection.release();
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const user_id = req.user?.user_id;
        if (!user_id) return res.status(401).json({ message: "Bejelentkezés szükséges" });

        const [rows] = await pool.query(`
            SELECT o.*, u.name as user_name 
            FROM ORDERS o
            JOIN USERS u ON o.user_id = u.user_id
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC
        `, [user_id]);

        res.json((rows as any[]).map(mapOrderRow));
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: "Státusz megadása kötelező" });

        const [result]: any = await pool.query("UPDATE ORDERS SET status = ? WHERE order_id = ?", [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Rendelés nem található" });
        }

        res.json({ message: "Státusz frissítve", order_id: id, status });
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { payment_status } = req.body;

        if (!payment_status) return res.status(400).json({ message: "Fizetési státusz megadása kötelező" });

        const [result]: any = await pool.query("UPDATE ORDERS SET payment_status = ? WHERE order_id = ?", [payment_status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Rendelés nem található" });
        }

        res.json({ message: "Fizetési státusz frissítve", order_id: id, payment_status });
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [rows] = await pool.query("SELECT * FROM ORDERS WHERE order_id = ?", [id]);
        if (!(rows as any[])[0]) return res.status(404).json({ message: "Rendelés nem található" });

        await pool.query("DELETE FROM ORDERS WHERE order_id = ?", [id]);
        res.json({ message: "Rendelés törölve" });
    } catch (err) {
        res.status(500).json({ message: "DB hiba", error: err });
    }
};
