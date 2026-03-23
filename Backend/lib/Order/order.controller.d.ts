import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
export declare const getAllOrders: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getOrderById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createOrder: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyOrders: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateOrderStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePaymentStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteOrder: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
