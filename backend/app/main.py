import math

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.thermal_engine import calculate_htsi
from app.services.forecast_engine import generate_forecast
from app.services.capacity_engine import calculate_hcsi
from app.services.weather_service import get_live_weather, get_air_quality, get_forecast
from app.services.risk_model import predict_ml_risk
from app.services.hospital_service import recommend_hospitals

app = FastAPI(title="USHMA API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# WARD DATA
# ---------------------------------------------------------

def generate_ward_grid(center_lat, center_lon, rows=4, cols=5, spacing_km=2.2):
    """
    Generates a grid of ward center-points around a city center.
    Placeholder for real municipal ward centroids until actual
    ward boundary data (Bhuvan/OSM) is integrated.
    """
    wards = []
    count = 1
    for r in range(rows):
        for c in range(cols):
            d_lat = ((r - rows / 2) * spacing_km) / 111
            d_lon = ((c - cols / 2) * spacing_km) / (111 * math.cos(math.radians(center_lat)))
            wards.append({
                "name": f"Ward {count}",
                "latitude": round(center_lat + d_lat, 5),
                "longitude": round(center_lon + d_lon, 5),
                "pct_elderly": round(6 + (count % 5) * 2.5, 1),
                "pct_informal_housing": round(10 + (count % 7) * 6, 1),
            })
            count += 1
    return wards


WARD_LOCATIONS = generate_ward_grid(22.5726, 88.3639, rows=4, cols=5)  # 20 wards around Kolkata


# ---------------------------------------------------------
# WARD RISK CALCULATION (single source of truth — used by every route below)
# ---------------------------------------------------------

def _ward_risk(ward_location):
    weather = get_live_weather(ward_location["latitude"], ward_location["longitude"])
    aqi = get_air_quality(ward_location["latitude"], ward_location["longitude"])

    htsi = calculate_htsi(weather["temp_c"], weather["humidity"], weather["wind_speed"], weather["solar_radiation"])

    ml_risk_score = predict_ml_risk(
        htsi["wbgt"], htsi["utci"], htsi["heat_index"], aqi["aqi_index"],
        ward_location["pct_elderly"], ward_location["pct_informal_housing"],
    )

    return {
        "name": ward_location["name"],
        "latitude": ward_location["latitude"],
        "longitude": ward_location["longitude"],
        "temperature": weather["temp_c"],
        "humidity": weather["humidity"],
        "wind_speed": weather["wind_speed"],
        "aqi_index": aqi["aqi_index"],
        "data_source": weather["source"],
        "ml_risk_score": ml_risk_score,
        **htsi,
    }

# ---------------------------------------------------------
# WARD RISK API
# ---------------------------------------------------------

@app.get("/api/wards/risk")
def get_wards_risk():
    return [_ward_risk(ward) for ward in WARD_LOCATIONS]


# ---------------------------------------------------------
# FORECAST API
# ---------------------------------------------------------

@app.get("/api/wards/{ward_name}/forecast")
def get_ward_forecast(ward_name: str):
    ward = next((w for w in WARD_LOCATIONS if w["name"] == ward_name), None)
    if not ward:
        return {"error": "ward not found"}

    real_forecast = get_forecast(ward["latitude"], ward["longitude"])

    if real_forecast:
        results = []
        for i, day_weather in enumerate(real_forecast):
            htsi = calculate_htsi(day_weather["temp_c"], day_weather["humidity"], day_weather["wind_speed"])
            results.append({
                "day": i,
                "temperature": day_weather["temp_c"],
                "humidity": day_weather["humidity"],
                **htsi,
            })
        return results

    # Fallback if live forecast fails
    live_now = get_live_weather(ward["latitude"], ward["longitude"])
    return generate_forecast({**ward, **live_now})


# ---------------------------------------------------------
# HEALTHCARE CAPACITY API
# ---------------------------------------------------------

@app.get("/api/wards/{ward_name}/capacity")
def get_ward_capacity(ward_name: str):
    ward = next((w for w in WARD_LOCATIONS if w["name"] == ward_name), None)
    if not ward:
        return {"error": "ward not found"}

    risk = _ward_risk(ward)
    return calculate_hcsi(ward_name, risk["htsi_level"])


# ---------------------------------------------------------
# HOSPITAL RECOMMENDATIONS API
# ---------------------------------------------------------

@app.get("/api/wards/{ward_name}/hospitals")
def get_ward_hospitals(ward_name: str):
    ward = next((w for w in WARD_LOCATIONS if w["name"] == ward_name), None)
    if not ward:
        return {"error": "ward not found"}
    return recommend_hospitals(ward["latitude"], ward["longitude"])


# ---------------------------------------------------------
# CITYWIDE SUMMARY
# ---------------------------------------------------------

@app.get("/api/summary")
def get_citywide_summary():
    all_risk = [_ward_risk(ward) for ward in WARD_LOCATIONS]

    worst_level = max(ward["htsi_level"] for ward in all_risk)
    labels = ["LOW", "MODERATE", "HIGH", "CRITICAL"]

    return {
        "citywide_status": labels[worst_level],
        "citywide_level": worst_level,
        "ward_count": len(all_risk),
        "critical_wards": sum(1 for ward in all_risk if ward["htsi_level"] == 3),
        "high_wards": sum(1 for ward in all_risk if ward["htsi_level"] == 2),
    }