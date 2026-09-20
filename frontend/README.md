## Data Sources & Known Limitations

| Component | Status |
|---|---|
| Current weather (temp/humidity/wind) | Live — OpenWeatherMap API |
| AQI | Live — OpenWeatherMap Air Pollution API |
| 5-day forecast | Live — OpenWeatherMap forecast API |
| Solar radiation | Estimated (OWM free tier has no solar field) |
| SUHI / satellite heat mapping | Architecture built (Google Earth Engine), not yet connected to live pipeline |
| Ward-level differentiation | Currently limited by weather-API resolution (city-level, not hyper-local) — SUHI layer is designed to solve this |
| Hospital bed/ICU capacity | Seeded demo data — real-time bed data isn't publicly available in India; production version would need a health-department data partnership |
| Mortality/hospitalization ML model | Rule-based thresholds currently; ML model architecture designed (XGBoost/LightGBM), trainable once historical data access is secured |
| SMS/WhatsApp alerts | Architecture designed (Twilio/WhatsApp Cloud API), not yet wired to live triggers |