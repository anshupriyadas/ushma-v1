import { getRiskInfo } from "../utils/riskStyles";

function ExecutiveSummary({ summary, wards, t }) {
  if (!summary) return null;
  const info = getRiskInfo(summary.citywide_status);

  return (
    <div className="exec-summary">
      <div className={`risk-badge ${info.className}`}>
        <span className="risk-symbol">{info.symbol}</span>
        {summary.citywide_status}
      </div>
      <div className="exec-stat">
        <span className="exec-number">{summary.ward_count}</span>
        <span className="exec-label">{t.wardsMonitored}</span>
      </div>
      <div className="exec-stat">
        <span className="exec-number">{summary.critical_wards}</span>
        <span className="exec-label">{t.criticalWards}</span>
      </div>
      <div className="exec-stat">
        <span className="exec-number">{summary.high_wards}</span>
        <span className="exec-label">{t.highRiskWards}</span>
      </div>
      <div className="exec-timestamp">
        {t.dataSourceLabel}: {wards?.[0]?.data_source === "live" ? t.liveWeatherFeed : t.cachedReading}
      </div>
    </div>
  );
}

export default ExecutiveSummary;