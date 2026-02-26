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

export default function Parfumok() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(12000);
  const [ferfi, setFerfi] = useState(false);
  const [noi, setNoi] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory("parfum");
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

  const filteredProducts = products.filter((p) => {
    const priceMatch = p.price <= price;
    const isFerfi = p.name?.toLowerCase().includes("man") || p.name?.toLowerCase().includes("férfi");
    const isNoi = !isFerfi;

    const genderMatch =
      (!ferfi && !noi) ||
      (ferfi && isFerfi) ||
      (noi && isNoi);

    return priceMatch && genderMatch;
  });

  return (
    <div className="parfumok-full-page">
      <section className="category-header">
        <div className="header-inner">
          <h1>PARFÜMÖK</h1>
          <p>Fedezd fel prémium parfüm kínálatunkat férfi és női illatokkal.</p>
        </div>
      </section>

      <div className="parfumok-content-wrapper">
        <div className="breadcrumb">🏠 / Parfümök</div>

        <div className="parfumok-layout">
          <aside className="filters-sidebar">
            <div className="filter-block">
              <h3>KATEGÓRIÁK</h3>
              <div className="filter-item">
                <input
                  type="checkbox"
                  checked={ferfi}
                  onChange={(e) => setFerfi(e.target.checked)}
                />
                <label>Férfiaknak</label>
              </div>
              <div className="filter-item">
                <input
                  type="checkbox"
                  checked={noi}
                  onChange={(e) => setNoi(e.target.checked)}
                />
                <label>Nőknek</label>
              </div>
            </div>

            <div className="filter-block">
              <h3>ÁR SZERINT</h3>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="3000"
                  max="12000"
                  className="price-slider"
                  value={price}
                  onChange={handlePriceChange}
                />
                <div className="price-labels">
                  <span>3 000 Ft</span>
                  <span>12 000 Ft</span>
                </div>
                <div className="filter-current-price">
                  <span>Jelenlegi ár:</span>
                  <span className="price-value"> {price.toLocaleString("hu-HU")} Ft</span>
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
                    image={getImageUrl(p.image_url)}
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
