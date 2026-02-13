import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../api/products";
import "./Parfumok.css";

export default function Dezodorok() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(12000);

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

  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const filteredProducts = products.filter((p) => p.price <= price);

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

        <div className="parfumok-layout">
          <aside className="filters-sidebar">
            <div className="filter-block">
              <h3>ÁR SZERINT</h3>

              <div className="price-slider-container">
                <input
                  type="range"
                  min="1000"
                  max="12000"
                  className="price-slider"
                  value={price}
                  onChange={handlePriceChange}
                />

                <div className="price-labels">
                  <span>1 000 Ft</span>
                  <span>12 000 Ft</span>
                </div>

                <div className="filter-current-price">
                  <span>Jelenlegi ár:</span>
                  <span className="price-value">{price} Ft</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="products-container">
            {loading && <p className="loading-message">Betöltés...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && filteredProducts.length === 0 && (
              <p className="no-results">Nincs találat a megadott feltételekre.</p>
            )}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.product_id}
                    id={p.product_id}
                    name={p.name}
                    price={p.price}
                    image={p.image_url}
                    description={p.description}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
