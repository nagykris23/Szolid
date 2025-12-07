export default function Navigation() {
  return (
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
        <span>👤</span>
        <span>🔍</span>
        <span>❤️</span>
        <span>🛒</span>
        <button className="login-btn">BEJELENTKEZÉS</button>
      </div>
    </header>
  );
}