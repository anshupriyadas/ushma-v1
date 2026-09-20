import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { generateHexagon } from "../utils/hexagon";
import "leaflet/dist/leaflet.css";

const RISK_COLORS = { LOW: "#2ecc71", MODERATE: "#f1c40f", HIGH: "#e67e22", CRITICAL: "#e74c3c" };
const DASH_PATTERNS = { LOW: null, MODERATE: "4,4", HIGH: "8,4", CRITICAL: "2,2" };

function MapView({ wards, selectedWard, onSelectWard, colorBlindMode }) {
  const center = wards.length ? [wards[0].latitude, wards[0].longitude] : [22.5726, 88.3639];

  return (
    <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {wards.map((ward) => {
        const hexPoints = generateHexagon(ward.latitude, ward.longitude, 1.1);
        const isSelected = ward.name === selectedWard;
        return (
          <Polygon
            key={ward.name}
            positions={hexPoints}
            eventHandlers={{ click: () => onSelectWard(ward.name) }}
            pathOptions={{
              color: RISK_COLORS[ward.risk] || "#999",
              fillColor: RISK_COLORS[ward.risk] || "#999",
              fillOpacity: isSelected ? 0.75 : 0.45,
              weight: isSelected ? 3 : 1,
              dashArray: colorBlindMode ? DASH_PATTERNS[ward.risk] : null,
            }}
          >
            <Popup>
              <strong>{ward.name}</strong> — {ward.risk}
              <br />Temp: {ward.temperature}°C · AQI: {ward.aqi_index}
              <br />WBGT: {ward.wbgt}°C · UTCI: {ward.utci}°C
              <br />ML Risk: {ward.ml_risk_score}/100
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}

export default MapView;