import "./Hero.css"
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>HETI AKCIÓK</h1>
        <p>20% - 50%</p>
        <Link to="/parfumok"><button className="btn">RENDELJ MOST</button></Link>
      </div>
    </section>
  );
}