import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Basket.css";

export default function Basket() {
  const navigate = useNavigate();
  const { items, removeItem, totalAmount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="basket-empty">
        <h2>A kosarad üres.</h2>
        <button className="basket-btn" onClick={() => navigate("/parfumok")}>
          Vásárlás folytatása
        </button>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <div className="basket-header">
        <h1>Kosár</h1>
        <button className="basket-link" onClick={clearCart}>
          Kiürítés
        </button>
      </div>

      <div className="basket-list">
        {items.map((item) => (
          <div key={item.id} className="basket-item">
            <div className="basket-img">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="basket-info">
              <div className="basket-title">{item.name}</div>
              <div className="basket-meta">
                <span>{item.price} Ft</span>
                <span>Darab: {item.quantity}</span>
                <span>Összesen: {item.price * item.quantity} Ft</span>
              </div>
            </div>
            <button
              className="basket-remove"
              onClick={() => removeItem(item.id)}
            >
              Eltávolítás
            </button>
          </div>
        ))}
      </div>

      <div className="basket-total">
        <span>Végösszeg</span>
        <strong>{totalAmount} Ft</strong>
      </div>

      <button className="basket-checkout-btn" onClick={() => navigate("/fizetes")}>
        Fizetés
      </button>
    </div>
  );
}
