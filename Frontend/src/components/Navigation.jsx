import React, { useRef } from "react";
import { Link } from "react-router-dom"; 
import "./Navigation.css";
import user from "../assets/user.png";
import search from "../assets/search.png";
import cart from "../assets/cart.png";

export default function Navigation() {
  const loginRef = useRef(null);

  return (
    <>
      <header className="navigation">
        <div className="logo">PARFUMOK</div>

        <nav className="nav-links">
          <Link to="/">FŐOLDAL</Link>
          <Link to="/parfumok">PARFÜMÖK</Link>
          <Link to="/dezodorok">DEZODOROK</Link>
          <Link to="/kollekciok">KOLLEKCIÓK</Link>
          <Link to="/rolunk">RÓLUNK</Link>
        </nav>

        <div className="nav-icons">
          <img src={user} alt="felhasználó" className="img" />
          <img src={search} alt="keresés" className="img" />
          <img src={cart} alt="kosár" className="img" />
          <button type="button" className="login-btn">
            BEJELENTKEZÉS
          </button>
        </div>
      </header>
    </>
  );
}
