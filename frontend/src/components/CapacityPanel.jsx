import { useEffect, useState } from "react";
import { fetchCapacity } from "../api/client";

function CapacityPanel({ wardName, t }) {
  const [capacity, setCapacity] = useState(null);

  useEffect(() => {
    fetchCapacity(wardName).then(setCapacity).catch(() => setCapacity(null));
  }, [wardName]);

  if (!capacity) return null;

  return (
    <div className="panel capacity-panel">
      <h3>{t.healthcareCapacity}</h3>
      <div className="capacity-hospital">{capacity.hospital_name}</div>
      <div className="capacity-grid">
        <div><span>{t.availableBeds}</span><strong>{capacity.available_beds}</strong></div>
        <div><span>{t.icuBeds}</span><strong>{capacity.icu_beds}</strong></div>
        <div><span>{t.predictedDemand}</span><strong>{capacity.predicted_demand}</strong></div>
      </div>
      <div className={`capacity-status status-${capacity.status.toLowerCase()}`}>
        HCSI: {capacity.hcsi_score}/100 — {capacity.status}
      </div>
    </div>
  );
}

export default CapacityPanel;