import React, { useRef } from "react";
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
          <a href="#">FŐOLDAL</a>
          <a href="#">PARFÜMÖK</a>
          <a href="#">DEZODOROK</a>
          <a href="#">KOLLEKCIÓK</a>
          <a href="#">RÓLUNK</a>
        </nav>

        <div className="nav-icons">
          <img src={user} alt="felhasználó" className="img" />
          <img src={search} alt="keresés" className="img" />
          <img src={cart} alt="kosár" className="img" />

          <button
            type="button"
            className="login-btn"
            onClick={() => loginRef.current?.open()}
          >
            BEJELENTKEZÉS
          </button>
        </div>
      </header>


    </>
  );
}
