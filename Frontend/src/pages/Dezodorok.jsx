import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../api/products";
import "./Parfumok.css";

const IMAGE_BASE_URL = "http://localhost:3000/images/";
function getImageUrl(imageUrl) {
  if (!imageUrl) return "https://via.placeholder.com/264x264?text=Nincs+kép";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${IMAGE_BASE_URL}${imageUrl}`;
}

export default function Dezodorok() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory("dezodor");
        setProducts(data);
      } catch (err) {
        setError("Nem sikerült betölteni a termékeket. Kérjük, próbálja újra később.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="parfumok-full-page">
      <section className="category-header">
        <div className="header-inner">
          <h1>DEZODOROK</h1>
          <p>Fedezd fel prémium dezodor kínálatunkat természetes összetevőkkel.</p>
        </div>
      </section>

      <div className="parfumok-content-wrapper">
        <div className="breadcrumb">🏠 / Dezodorok</div>

        <main className="products-container">
          {loading && <p className="loading-message">Betöltés...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.product_id}
                  id={p.product_id}
                  name={p.name}
                  price={p.price}
                  image={getImageUrl(p.image_url)}
                  description={p.description}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
