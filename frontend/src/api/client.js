const BASE_URL = "http://127.0.0.1:8000";

export async function fetchWardRisk() {
  const res = await fetch(`${BASE_URL}/api/wards/risk`);
  if (!res.ok) throw new Error("Failed to fetch ward risk");
  return res.json();
}

export async function fetchForecast(wardName) {
  const res = await fetch(`${BASE_URL}/api/wards/${encodeURIComponent(wardName)}/forecast`);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}

export async function fetchCapacity(wardName) {
  const res = await fetch(`${BASE_URL}/api/wards/${encodeURIComponent(wardName)}/capacity`);
  if (!res.ok) throw new Error("Failed to fetch capacity");
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${BASE_URL}/api/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function fetchWardBoundaries() {
  const res = await fetch(`${BASE_URL}/api/wards/boundaries`);
  if (!res.ok) throw new Error("Failed to fetch boundaries");
  return res.json();
}
export async function fetchHospitalRecs(wardName) {
  const res = await fetch(`${BASE_URL}/api/wards/${encodeURIComponent(wardName)}/hospitals`);
  if (!res.ok) throw new Error("Failed to fetch hospitals");
  return res.json();
}