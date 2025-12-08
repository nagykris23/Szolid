import ProductCard from "./ProductCard";
import "./ProductSection.css"

export default function ProductSection() {
  const products = [
    {
      name: "ANGEL",
      image:"https://www.oxiessence.eu/img/97934/angel/264x264,r/angel.jpg?time=1715778874"
    },
    {
      name: "LOVE",
      image: "https://www.oxiessence.eu/img/97934/love/264x264,r/love.jpg?time=1715778482"
    },
    {
      name: "OPIUM",
      image: "https://www.oxiessence.eu/img/97934/opium/264x264,r/opium.jpg?time=1715777539"
    },
    {
      name: "PARIS",
      image: "https://www.oxiessence.eu/img/97934/paris/264x264,r/paris.jpg?time=1715778931"
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