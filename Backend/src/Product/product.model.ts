export type Product = {
  product_id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string | null;
  created_at?: string;
};
