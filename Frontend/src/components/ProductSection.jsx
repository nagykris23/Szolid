import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductSection.css";
import { getAllProducts } from "../api/products";

const IMAGE_BASE_URL = "http://localhost:3000/images/";

const FEATURED = ["angel", "love", "paris", "spell"];

function getImageUrl(imageUrl) {
  if (!imageUrl) return "https://via.placeholder.com/264x264?text=Nincs+kép";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${IMAGE_BASE_URL}${imageUrl}`;
}

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        const parfumok = data.filter(
          (p) => p.category_name?.toLowerCase() === "parfum"
        );
        
        const featured = FEATURED.map((name) =>
          parfumok.find((p) => p.name.toLowerCase() === name)
        ).filter(Boolean);
        setProducts(featured.length >= 4 ? featured : parfumok.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="product-section">
      <h3>NŐI PARFUMOK</h3>
      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", fontFamily: "sans-serif" }}>Betöltés...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              id={product.product_id}
              name={product.name}
              image={getImageUrl(product.image_url)}
              price={product.price}
            />
          ))}
        </div>
      )}
    </section>
  );
}
