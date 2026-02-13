import { Request, Response } from "express";
export declare const run: (_req: Request, res: Response) => void;
export declare const getAllData: (req: Request, res: Response) => Promise<void>;
export declare const getDataById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const postData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDataById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const putDataById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const patchDataById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
