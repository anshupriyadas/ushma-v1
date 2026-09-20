import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"

CACHE_TTL_SECONDS = 600  # 10 minutes — weather doesn't need to be more frequent than this
_cache = {}  # key -> {"data": ..., "timestamp": ...}


def _get_cached(key):
    entry = _cache.get(key)
    if entry and (time.time() - entry["timestamp"]) < CACHE_TTL_SECONDS:
        return entry["data"]
    return None


def _set_cache(key, data):
    _cache[key] = {"data": data, "timestamp": time.time()}


def get_live_weather(lat, lon):
    cache_key = f"weather_{lat},{lon}"
    cached = _get_cached(cache_key)
    if cached:
        return {**cached, "source": "cached"}

    try:
        response = requests.get(
            f"{BASE_URL}/weather",
            params={"lat": lat, "lon": lon, "appid": API_KEY, "units": "metric"},
            timeout=3,
        )
        response.raise_for_status()
        data = response.json()
        result = {
            "temp_c": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "solar_radiation": 600,
        }
        _set_cache(cache_key, result)
        return {**result, "source": "live"}
    except Exception as e:
        print(f"[weather_service] Live fetch failed ({e})")
        stale = _cache.get(cache_key)
        if stale:
            return {**stale["data"], "source": "cached"}
        return {"temp_c": 35, "humidity": 60, "wind_speed": 2.5, "solar_radiation": 600, "source": "default"}


def get_air_quality(lat, lon):
    cache_key = f"aqi_{lat},{lon}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return {"aqi_index": cached, "source": "cached"}

    try:
        response = requests.get(
            "https://api.openweathermap.org/data/2.5/air_pollution",
            params={"lat": lat, "lon": lon, "appid": API_KEY},
            timeout=3,
        )
        response.raise_for_status()
        aqi_index = response.json()["list"][0]["main"]["aqi"]
        _set_cache(cache_key, aqi_index)
        return {"aqi_index": aqi_index, "source": "live"}
    except Exception as e:
        print(f"[weather_service] AQI fetch failed ({e})")
        stale = _cache.get(cache_key)
        return {"aqi_index": stale["data"] if stale else 3, "source": "cached" if stale else "default"}


def get_forecast(lat, lon, days=5):
    cache_key = f"forecast_{lat},{lon}"
    cached = _get_cached(cache_key)
    if cached:
        return cached
    try:
        response = requests.get(
            f"{BASE_URL}/forecast",
            params={"lat": lat, "lon": lon, "appid": API_KEY, "units": "metric"},
            timeout=3,
        )
        response.raise_for_status()
        data = response.json()
        daily, seen = [], set()
        for entry in data["list"]:
            date, hour = entry["dt_txt"].split(" ")
            if hour == "12:00:00" and date not in seen and len(daily) < days:
                daily.append({
                    "temp_c": entry["main"]["temp"],
                    "humidity": entry["main"]["humidity"],
                    "wind_speed": entry["wind"]["speed"],
                })
                seen.add(date)
        _set_cache(cache_key, daily)
        return daily
    except Exception as e:
        print(f"[weather_service] Forecast fetch failed ({e})")
        stale = _cache.get(cache_key)
        return stale["data"] if stale else []