export const RISK_LEVELS = {
  LOW:      { color: "#2ecc71", symbol: "●", className: "risk-low" },
  MODERATE: { color: "#f1c40f", symbol: "▲", className: "risk-moderate" },
  HIGH:     { color: "#e67e22", symbol: "◆", className: "risk-high" },
  CRITICAL: { color: "#e74c3c", symbol: "⯃", className: "risk-critical" },
};

export function getRiskInfo(risk) {
  return RISK_LEVELS[risk] || { color: "#999", symbol: "?", className: "risk-unknown" };
}