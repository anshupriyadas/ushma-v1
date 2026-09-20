import { useEffect, useState } from "react";
import { fetchWardRisk, fetchHospitalRecs } from "../api/client";
import { translations } from "../i18n/translations";
import { getRiskInfo } from "../utils/riskStyles";

const RISK_MESSAGES = {
  LOW: "Conditions are safe today.",
  MODERATE: "Take normal precautions in the heat.",
  HIGH: "Be careful — heat is dangerous today.",
  CRITICAL: "Extreme danger. Stay indoors if possible.",
};

function PublicView({ user, language }) {
  const [ward, setWard] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchWardRisk()
      .then((data) => {
        const myWard = data.find((w) => w.name === user.ward) || data[0];
        setWard(myWard);
        return fetchHospitalRecs(myWard.name);
      })
      .then(setHospitals)
      .catch((err) => setError(err.message));
  }, [user.ward]);

  if (error) {
    return (
      <div className="public-view">
        <p style={{ color: "#e74c3c" }}>Couldn't load data: {error}</p>
        <p>Is the backend running on port 8000?</p>
      </div>
    );
  }

  if (!ward) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading weather information…</p>
      </div>
    );
  }

  const info = getRiskInfo(ward.risk);

  return (
    <div className="public-view">
      <h2>{t.greeting}, {user.name}</h2>
      <p className="ward-context">Showing conditions for <strong>{ward.name}</strong></p>

      <div className="public-weather-card" style={{ borderColor: info.color }}>
        <h3>{t.weatherOverview}</h3>
        <div className="public-temp">{ward.temperature}°C</div>
        <div className={`risk-badge ${info.className}`}>
          <span className="risk-symbol">{info.symbol}</span>
          {t.riskLevel}: {ward.risk}
        </div>
        <p className="public-message">{RISK_MESSAGES[ward.risk]}</p>

        <div className="public-detail-grid">
          <div><span>Humidity</span><strong>{ward.humidity}%</strong></div>
          <div><span>Wind</span><strong>{ward.wind_speed} m/s</strong></div>
          <div><span>Air Quality</span><strong>{ward.aqi_index}/5</strong></div>
          <div><span>Feels Like</span><strong>{ward.heat_index}°C</strong></div>
        </div>
      </div>

      <div className="public-advice-card">
        <h3>What should you do?</h3>
        {user.seniorCitizen && <p>⚠️ {t.seniorAdvice}</p>}
        {user.outdoorWorker && <p>⚠️ {t.workerAdvice}</p>}
        {!user.seniorCitizen && !user.outdoorWorker && <p>{t.generalAdvice}</p>}
        <p>{t.stayCool}</p>
      </div>

      <div className="public-advice-card">
        <h3>{t.nearestCoolingCenter} & Hospitals</h3>
        {hospitals.map((h) => (
          <div key={h.name} className="hospital-row">
            <div className="hospital-name">{h.name}</div>
            <div className="hospital-meta">
              {h.distance_km} km away · {h.available_beds} beds available · {h.icu_beds} ICU
            </div>
            <div className="hospital-phone">{h.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicView;