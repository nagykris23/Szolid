import { useCart } from "../context/CartContext";
import "./Toast.css";

export default function Toast() {
  const { notification } = useCart();

  if (!notification) return null;

  return <div className="toast">{notification}</div>;
}
