import "./ProductCard.css"
export default function ProductCard({ name, image }) {
  return (
    <div className="product-card">
      <div
        className="product-img"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <p className="product-name">{name}</p>
      <button className="product-btn">Kosárhoz adás</button>
    </div>
  );
}