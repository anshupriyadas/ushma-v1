function RiskSummary({ wards }) {
  return (
    <div className="risk-summary">
      <h3>Ward Summary</h3>
      {wards.map((ward) => (
        <div key={ward.name} className="ward-row">
          <strong>{ward.name}</strong>
          <span className={`badge badge-${ward.risk.toLowerCase()}`}>
            {ward.risk}
          </span>
          <div className="ward-details">
            HI: {ward.heat_index}°C · WBGT: {ward.wbgt}°C · UTCI: {ward.utci}°C
          </div>
        </div>
      ))}
    </div>
  );
}

export default RiskSummary;