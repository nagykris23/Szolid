import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";

import cart from "../assets/cart.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navigation">
      <div className="logo">OXI ESSENCE</div>

      <nav className={`nav-links${menuOpen ? " open" : ""}`}>
        <Link to="/" onClick={closeMenu}>FŐOLDAL</Link>
        <Link to="/parfumok" onClick={closeMenu}>PARFÜMÖK</Link>
        <Link to="/dezodorok" onClick={closeMenu}>DEZODOROK</Link>
        <Link to="/kollekciok" onClick={closeMenu}>KOLLEKCIÓK</Link>
        <Link to="/rolunk" onClick={closeMenu}>RÓLUNK</Link>
        {user?.role === "admin" && (
          <Link to="/admin" style={{ color: "#d4b896" }} onClick={closeMenu}>ADMIN</Link>
        )}
      </nav>

      <div className="nav-icons">
        <button
          type="button"
          className="icon-btn"
          onClick={() => { navigate(user ? "/kosar" : "/login"); closeMenu(); }}
        >
          <img src={cart} alt="kosár" className="img" />
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>

        {!user ? (
          <>
            <button type="button" className="login-btn" onClick={() => { navigate("/login"); closeMenu(); }}>BEJELENTKEZÉS</button>
            <button type="button" className="login-btn" onClick={() => { navigate("/register"); closeMenu(); }}>REGISZTRÁCIÓ</button>
          </>
        ) : (
          <>
            <span style={{ color: "white", marginRight: "10px" }}>{user.name}</span>
            <button type="button" className="login-btn" onClick={() => { logout(); navigate("/"); closeMenu(); }}>KIJELENTKEZÉS</button>
          </>
        )}

       
        <button
          type="button"
          className="hamburger"
          aria-label="Menü megnyitása"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
