import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext();

function getCartKey() {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.user_id) return `cart_${parsed.user_id}`;
    }
  } catch { }
  return "cart_guest";
}

const loadCart = () => {
  const key = getCartKey();
  const raw = localStorage.getItem(key);
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
  const [cartKey, setCartKey] = useState(() => getCartKey());

  useEffect(() => {
    const handleStorageChange = () => {
      const newKey = getCartKey();
      if (newKey !== cartKey) {
        setCartKey(newKey);
        const raw = localStorage.getItem(newKey);
        try {
          const parsed = raw ? JSON.parse(raw) : [];
          setItems(Array.isArray(parsed) ? parsed : []);
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userChanged", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userChanged", handleStorageChange);
    };
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { itemCount, totalAmount };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, notification, showNotification, ...totals }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}