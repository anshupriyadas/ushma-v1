function WardInspector({ ward, allWards, onSelectWard, t }) {
  if (!ward) return null;

  return (
    <div className="panel ward-inspector">
      <h3>{t.wardInspector}</h3>
      <select className="ward-dropdown" value={ward.name} onChange={(e) => onSelectWard(e.target.value)}>
        {allWards.map((w) => (
          <option key={w.name} value={w.name}>{w.name} — {w.risk}</option>
        ))}
      </select>

      <div className={`risk-badge risk-${ward.risk.toLowerCase()}`}>{ward.risk}</div>
      <div className="inspector-grid">
        <div><span>{t.wbgt}</span><strong>{ward.wbgt}°C</strong></div>
        <div><span>{t.utci}</span><strong>{ward.utci}°C</strong></div>
        <div><span>{t.heatIndex}</span><strong>{ward.heat_index}°C</strong></div>
        <div><span>{t.airQuality}</span><strong>{ward.aqi_index}/5</strong></div>
        <div><span>{t.mlRiskScore}</span><strong>{ward.ml_risk_score}/100</strong></div>
        <div><span>{t.htsiLevel}</span><strong>{ward.htsi_level}/3</strong></div>
      </div>
    </div>
  );
}

export default WardInspector;