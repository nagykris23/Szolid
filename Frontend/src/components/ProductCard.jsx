import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ id, name, image, price }) {
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
      <p className="product-price">{price}</p>
      <button className="cart-add-btn">Kosárhoz adás</button>
    </div>
  );
}
