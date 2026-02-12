import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext();

const loadCart = () => {
  const raw = localStorage.getItem("cart");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { itemCount, totalAmount };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, notification, showNotification, ...totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
