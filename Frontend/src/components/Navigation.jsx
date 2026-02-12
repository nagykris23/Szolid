import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import userIcon from "../assets/user.png";
import search from "../assets/search.png";
import cart from "../assets/cart.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();

  if (loading) return null;

  return (
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
        <img src={userIcon} alt="felhasználó" className="img" />
        <img src={search} alt="keresés" className="img" />
        <button
          type="button"
          className="icon-btn"
          onClick={() => navigate(user ? "/kosar" : "/login")}
        >
          <img src={cart} alt="kosár" className="img" />
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>

        {!user ? (
          <>
            <button
              type="button"
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              BEJELENTKEZÉS
            </button>

            <button
              type="button"
              className="login-btn"
              onClick={() => navigate("/register")}
            >
              REGISZTRÁCIÓ
            </button>
          </>
        ) : (
          <>
            <span style={{ color: "white", marginRight: "10px" }}>
              {user.name}
            </span>
            <button
              type="button"
              className="login-btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              KIJELENTKEZÉS
            </button>
          </>
        )}
      </div>
    </header>
  );
}
