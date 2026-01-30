export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock_quantity: number;
    image_url?: string | null;
    created_at?: string;
};
export type User = {
    user_id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    created_at?: string;
};
