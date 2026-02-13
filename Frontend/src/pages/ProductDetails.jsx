import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/products";
import "./ProductDetails.css";

const IMAGE_BASE_URL = "http://localhost:3000/images/";
const FALLBACK_IMAGE = "https://via.placeholder.com/600x600?text=Nincs+kep";

function getImageUrl(imageUrl) {
  if (!imageUrl) return FALLBACK_IMAGE;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${IMAGE_BASE_URL}${imageUrl}`;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      setError("Ervenytelen termek azonosito.");
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch {
        setError("A termek betoltese sikertelen.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Betoltes...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        {error || "A termek nem talalhato!"}
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image_url);

  return (
    <div className="product-page-wrapper">
      <div className="breadcrumb-nav">
        <span className="back-link" onClick={() => navigate(-1)}>Parfumok</span>
        {" > "} {product.name}
      </div>

      <div className="product-main-content">
        <div className="product-images-section">
          <div className="main-image-box">
            <img src={imageUrl} alt={product.name} />
          </div>

          <div className="thumbnail-row">
            <img src={imageUrl} alt={`${product.name} mini 1`} />
            <img src={imageUrl} alt={`${product.name} mini 2`} />
          </div>
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="subtitle">{product.category_name || "Termek"}</p>

          <div className="accordion-item">
            <div className="accordion-header"><span>Reszletek</span><span>-</span></div>
            <div className="accordion-body">{product.description}</div>
          </div>

          <div className="price-box">
            <span className="current-price">{product.price} Ft</span>
            <span className="size-info">Keszlet: {product.stock_quantity} db</span>
          </div>

          <button className="add-to-cart-btn">Kosarba teszem</button>
        </div>
      </div>
    </div>
  );
}
