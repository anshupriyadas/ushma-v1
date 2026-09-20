function AccessibilityBar({ colorBlindMode, onToggleColorBlind, textScale, onTextScaleChange, language, onLanguageChange }) {
  return (
    <div className="accessibility-bar">
      <button className="header-toggle" onClick={onToggleColorBlind}>
        {colorBlindMode ? "Standard View" : "Colorblind Safe View"}
      </button>

      <div className="text-size-control">
        <span>Text Size</span>
        <button onClick={() => onTextScaleChange(Math.max(0.85, textScale - 0.1))}>A-</button>
        <button onClick={() => onTextScaleChange(1)}>A</button>
        <button onClick={() => onTextScaleChange(Math.min(1.5, textScale + 0.1))}>A+</button>
      </div>

      <select className="lang-select" value={language} onChange={(e) => onLanguageChange(e.target.value)}>
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="bn">BN</option>
      </select>
    </div>
  );
}

export default AccessibilityBar;