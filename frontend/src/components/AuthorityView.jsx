import { useEffect, useState } from "react";
import ExecutiveSummary from "./ExecutiveSummary";
import MapView from "./MapView";
import RiskLegend from "./RiskLegend";
import WardInspector from "./WardInspector";
import ForecastStrip from "./ForecastStrip";
import CapacityPanel from "./CapacityPanel";
import { fetchWardRisk } from "../api/client";
import { translations } from "../i18n/translations";

function AuthorityView({ colorBlindMode, language }) {
  const t = translations[language] || translations.en;

  const [wards, setWards] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWardRisk()
      .then((wardData) => {
        setWards(wardData);
        const worstLevel = Math.max(...wardData.map((w) => w.htsi_level));
        const labels = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
        setSummary({
          citywide_status: labels[worstLevel],
          citywide_level: worstLevel,
          ward_count: wardData.length,
          critical_wards: wardData.filter((w) => w.htsi_level === 3).length,
          high_wards: wardData.filter((w) => w.htsi_level === 2).length,
        });
        setSelectedWard(wardData[0]?.name ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Fetching live heat-health data…</p>
      </div>
    );
  }

  if (error) {
    return <div className="status-banner error">Error: {error} — is the backend running?</div>;
  }

  return (
    <>
      <ExecutiveSummary summary={summary} wards={wards} t={t} />
      <div className="app-body">
        <div className="map-panel">
          <MapView
            wards={wards}
            selectedWard={selectedWard}
            onSelectWard={setSelectedWard}
            colorBlindMode={colorBlindMode}
          />
        </div>
        <div className="side-panel">
          <RiskLegend t={t} />
          <WardInspector
            ward={wards.find((w) => w.name === selectedWard)}
            allWards={wards}
            onSelectWard={setSelectedWard}
            t={t}
          />
          {selectedWard && <CapacityPanel wardName={selectedWard} t={t} />}
        </div>
      </div>
      <ForecastStrip wardName={selectedWard} t={t} />
    </>
  );
}

export default AuthorityView;