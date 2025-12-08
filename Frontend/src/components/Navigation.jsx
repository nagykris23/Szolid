import React, { useRef } from "react";
import "./Navigation.css";


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
          <span>🎅</span>
          <span>🔍</span>
          <span>🛒</span>
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
