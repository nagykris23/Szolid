import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cardNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 16);
      newValue = newValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    } else if (name === "cardExpiry") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
      if (newValue.length >= 2) {
        newValue = newValue.slice(0, 2) + "/" + newValue.slice(2);
      }
    } else if (name === "cardCvc") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    } else if (name === "zip") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sikeres fizetés! Köszönjük a vásárlást.");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>A kosarad üres.</h2>
        <button className="checkout-btn" onClick={() => navigate("/parfumok")}>
          Vásárlás folytatása
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Fizetés</h1>

      <div className="checkout-container">
        <div className="checkout-summary">
          <h2>Rendelés összegzése</h2>
          {items.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>{item.name} x {item.quantity}</span>
              <span>{item.price * item.quantity} Ft</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Végösszeg:</strong>
            <strong>{totalAmount} Ft</strong>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Szállítási adatok</h2>
          <input
            type="text"
            name="name"
            placeholder="Teljes név"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email cím"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Cím"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className="checkout-row">
            <input
              type="text"
              name="city"
              placeholder="Város"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="zip"
              placeholder="Irányítószám"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>

          <h2>Fizetési adatok</h2>
          <input
            type="text"
            name="cardNumber"
            placeholder="Kártyaszám (1234 5678 9012 3456)"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={19}
            required
          />
          <div className="checkout-row">
            <input
              type="text"
              name="cardExpiry"
              placeholder="HH/ÉÉ"
              value={formData.cardExpiry}
              onChange={handleChange}
              maxLength={5}
              required
            />
            <input
              type="text"
              name="cardCvc"
              placeholder="CVC"
              value={formData.cardCvc}
              onChange={handleChange}
              maxLength={3}
              required
            />
          </div>

          <button type="submit" className="checkout-submit">
            Fizetés ({totalAmount} Ft)
          </button>
        </form>
      </div>
    </div>
  );
}
