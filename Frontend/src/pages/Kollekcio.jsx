import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Kollekcio.css";

const IMAGE_BASE_URL = "http://localhost:3000/images/";
function getImageUrl(imageUrl) {
  if (!imageUrl) return "https://via.placeholder.com/264x264?text=Nincs+kép";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${IMAGE_BASE_URL}${imageUrl}`;
}

export default function Kollekcio() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/products?category=csomag")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setError("Nem sikerült betölteni a csomagokat."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="kollekcio-page">
      <div className="kollekcio-hero">
        <div className="kollekcio-hero-overlay" />
        <div className="kollekcio-hero-content">
          <span className="kollekcio-eyebrow">Ajánlataink</span>
          <h1>Kollekciók</h1>
          <p>Gondosan összeválogatott illatcsomagok</p>
        </div>
      </div>
      <div className="kollekcio-content">
        {loading && <p className="state-msg">Betöltés...</p>}
        {error && <p className="state-msg error">{error}</p>}
        {!loading && !error && (
          <div className="kollekcio-grid">
            {products.map((p) => (
              <ProductCard
                key={p.product_id}
                id={p.product_id}
                name={p.name}
                image={getImageUrl(p.image_url)}
                price={p.price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
