export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type OrderItem = {
    product_id: number;
    name?: string;
    quantity: number;
    price_at_purchase: number;
};
export type Order = {
    order_id: number;
    user_id: number;
    user_name?: string;
    address_id: number | null;
    order_date: string;
    total_amount: number;
    status: OrderStatus;
    shipping_method: string | null;
    payment_method: string | null;
    payment_status: PaymentStatus;
    items?: OrderItem[];
};
