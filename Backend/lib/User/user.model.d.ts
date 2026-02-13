export type User = {
    user_id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    created_at?: string;
};
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export type CreateUserInput = {
    name: string;
    email: string;
    password_hash: string;
    role?: string;
};
export declare const createUser: (input: CreateUserInput) => Promise<User>;
