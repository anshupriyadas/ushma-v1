function RiskLegend({ t }) {
  const LEVELS = [
    { label: t.riskLow, color: "#6fcf7a", symbol: "●", meaning: t.lowMeaning },
    { label: t.riskModerate, color: "#f2c14e", symbol: "▲", meaning: t.moderateMeaning },
    { label: t.riskHigh, color: "#f2924e", symbol: "◆", meaning: t.highMeaning },
    { label: t.riskCritical, color: "#ef6a5a", symbol: "⯃", meaning: t.criticalMeaning },
  ];

  return (
    <div className="panel risk-legend">
      <h3>{t.accessibleLegend}</h3>
      {LEVELS.map((l) => (
        <div key={l.label} className="legend-row">
          <span className="legend-symbol" style={{ color: l.color }}>{l.symbol}</span>
          <div>
            <div className="legend-label">{l.label}</div>
            <div className="legend-meaning">{l.meaning}</div>
          </div>
        </div>
      ))}
      <p className="legend-note">{t.legendNote}</p>
    </div>
  );
}

export default RiskLegend;