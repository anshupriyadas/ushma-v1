export function generateHexagon(centerLat, centerLon, radiusKm = 1.1) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30;
    const angleRad = (Math.PI / 180) * angleDeg;
    const dLat = (radiusKm / 111) * Math.sin(angleRad);
    const dLon = (radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180))) * Math.cos(angleRad);
    points.push([centerLat + dLat, centerLon + dLon]);
  }
  return points;
}