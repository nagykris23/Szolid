import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
