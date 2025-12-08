import ProductCard from "./ProductCard";
import "./ProductSection.css"

export default function ProductSection() {
  const products = [
    {
      name: "ANGEL",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&h=300&fit=crop"
    },
    {
      name: "LOVE",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300&h=300&fit=crop"
    },
    {
      name: "OPIUM",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=300&h=300&fit=crop"
    },
    {
      name: "PARIS",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop"
    }
  ];

  return (
    <section className="product-section">
      <h3>NOI PARFUMOK</h3>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.name}
            name={product.name}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}