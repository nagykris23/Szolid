import { Link, useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ id, name, image, price }) {
  const { addItem, showNotification } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addItem({ id, name, price, image });
    showNotification(`${name} hozzáadva a kosárhoz!`);
  };

  return (
    <div className="product-card">
      <Link
        to={`/termek/${id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="img-holder">
          <div
            className="circle-img"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        </div>
        <h3 className="product-title">{name}</h3>
      </Link>
      <p className="product-price">{price} Ft</p>
      <button className="cart-add-btn" onClick={handleAdd}>
        Kosárhoz adás
      </button>
    </div>
  );
}
