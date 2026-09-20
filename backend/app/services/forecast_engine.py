import random
from app.services.thermal_engine import calculate_htsi


def generate_forecast(base_ward, days=5):
    """
    Generates a simple day-over-day forecast by applying small
    realistic drift to the base ward's weather inputs.
    This is a placeholder until real multi-day weather forecast
    data (e.g. from IMD/OpenWeatherMap forecast endpoints) is wired in.
    """
    forecast = []
    temp = base_ward["temp_c"]
    humidity = base_ward["humidity"]

    for day in range(days):
        # small deterministic-ish drift so demo is stable, not fully random
        temp_drift = [0, 0.6, -1.2, -0.4, 1.0][day % 5]
        humidity_drift = [0, -2, 3, -1, 2][day % 5]

        day_temp = round(temp + temp_drift, 1)
        day_humidity = max(20, min(95, humidity + humidity_drift))

        htsi = calculate_htsi(
            day_temp,
            day_humidity,
            base_ward["wind_speed"],
            base_ward["solar_radiation"],
        )

        forecast.append({
            "day": day,
            "temperature": day_temp,
            "humidity": day_humidity,
            **htsi,
        })

    return forecast