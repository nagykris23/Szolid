import ProductCard from "../components/ProductCard";
import { products } from "../data"; 
import "./Parfumok.css";

export default function Parfumok() {
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
                            <div className="filter-item"><input type="checkbox" id="f" /> <label htmlFor="f">Férfiaknak</label></div>
                            <div className="filter-item"><input type="checkbox" id="n" /> <label htmlFor="n">Nőknek</label></div>
                        </div>

                        <div className="filter-block">
                            <h3>ÁR SZERINT</h3>
                            <input type="range" min="3000" max="12000" className="price-slider" />
                            <div className="price-labels">
                                <span>3 000 Ft</span>
                                <span>12 000 Ft</span>
                            </div>
                        </div>
                    </aside>

                    <main className="products-container">
                        <div className="products-grid">
                            {products.map((p) => (

                                <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}