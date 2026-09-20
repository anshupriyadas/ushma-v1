function Header({ colorBlindMode, onToggleColorBlind }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <span className="logo-badge">☀</span>
        <div>
          <h1>USHMA</h1>
          <span className="tagline">Turning Heat into Action</span>
        </div>
      </div>
      <div className="header-right">
        <button className="header-toggle" onClick={onToggleColorBlind}>
          {colorBlindMode ? "Standard View" : "Colorblind Safe View"}
        </button>
        <select className="lang-select" defaultValue="en">
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="bn">BN</option>
        </select>
      </div>
    </header>
  );
}

export default Header;