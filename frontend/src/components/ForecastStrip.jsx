import { useEffect, useState } from "react";
import { fetchForecast } from "../api/client";

const RISK_COLORS = { LOW: "#6fcf7a", MODERATE: "#f2c14e", HIGH: "#f2924e", CRITICAL: "#ef6a5a" };
const DAY_LABELS = ["Today", "Day 2", "Day 3", "Day 4", "Day 5"];

function ForecastStrip({ wardName, t }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!wardName) return;
    fetchForecast(wardName).then(setForecast).catch(() => setForecast([]));
  }, [wardName]);

  if (!forecast.length) return null;

  return (
    <div className="panel forecast-strip">
      <h3>{t.forecastTitle} — {wardName}</h3>
      <div className="forecast-cards">
        {forecast.map((day, i) => (
          <div key={i} className="forecast-card" style={{ borderColor: RISK_COLORS[day.risk] }}>
            <div className="forecast-day">{DAY_LABELS[i]}</div>
            <div className="forecast-temp">{day.temperature}°C</div>
            <div className="forecast-badge" style={{ background: RISK_COLORS[day.risk] }}>{day.risk}</div>
          </div>
        ))}
      </div>
      <p className="legend-note">{t.forecastNote}</p>
    </div>
  );
}

export default ForecastStrip;