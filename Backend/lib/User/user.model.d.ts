import { User } from "../model";
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export type CreateUserInput = {
    name: string;
    email: string;
    password_hash: string;
    role?: string;
};
export declare const createUser: (input: CreateUserInput) => Promise<User>;
