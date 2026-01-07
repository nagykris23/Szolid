import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data";
import "./ProductDetails.css";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();


    const product = products.find((p) => p.id === parseInt(id));

    if (!product) return <div style={{ padding: "100px", textAlign: "center" }}>Termék nem található!</div>;

    return (
        <div className="product-page-wrapper">
            <div className="breadcrumb-nav">
                <span className="back-link" onClick={() => navigate(-1)}>🏠 Parfümök</span>
                {" > "} {product.name}
            </div>

            <div className="product-main-content">
                <div className="product-images-section">
                    <div className="main-image-box">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="thumbnail-row">
                        <img src={product.image} alt="thumb1" />
                        <img src={product.image} alt="thumb2" />
                    </div>
                </div>

                <div className="product-info-section">
                    <h1>{product.name}</h1>
                    <p className="subtitle">Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>

                    <div className="accordion-item">
                        <div className="accordion-header"><span>Részletek</span><span>−</span></div>
                        <div className="accordion-body">{product.desc}</div>
                    </div>

                    <div className="price-box">
                        <span className="current-price">{product.price}</span>
                        <span className="size-info">Size: 1 piece</span>
                    </div>

                    <button className="add-to-cart-btn">Kosárba teszem</button>
                </div>
            </div>
        </div>
    );
}