import math

# Seeded demo hospital data — real-time bed/ICU availability isn't
# publicly accessible in India, as noted in the feasibility slide.
HOSPITALS = [
    {"name": "Kolkata Central Hospital", "latitude": 22.5726, "longitude": 88.3639, "total_beds": 200, "available_beds": 24, "icu_beds": 12, "phone": "033-XXXX-0001"},
    {"name": "SSKM General Hospital", "latitude": 22.5390, "longitude": 88.3430, "total_beds": 350, "available_beds": 40, "icu_beds": 20, "phone": "033-XXXX-0002"},
    {"name": "Salt Lake Community Hospital", "latitude": 22.5850, "longitude": 88.4180, "total_beds": 120, "available_beds": 15, "icu_beds": 6, "phone": "033-XXXX-0003"},
    {"name": "Howrah District Hospital", "latitude": 22.5958, "longitude": 88.2636, "total_beds": 180, "available_beds": 30, "icu_beds": 10, "phone": "033-XXXX-0004"},
    {"name": "Behala Municipal Hospital", "latitude": 22.4990, "longitude": 88.3130, "total_beds": 90, "available_beds": 18, "icu_beds": 5, "phone": "033-XXXX-0005"},
    {"name": "Dum Dum Health Centre", "latitude": 22.6420, "longitude": 88.4200, "total_beds": 100, "available_beds": 22, "icu_beds": 4, "phone": "033-XXXX-0006"},
]


def _haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def recommend_hospitals(lat, lon, top_n=3):
    """
    Returns nearest hospitals ranked by a mix of distance and bed availability —
    closer AND less-stressed hospitals rank higher.
    """
    scored = []
    for h in HOSPITALS:
        distance_km = round(_haversine_km(lat, lon, h["latitude"], h["longitude"]), 1)
        availability_ratio = h["available_beds"] / h["total_beds"]
        # lower score = better: distance matters most, availability breaks ties
        score = distance_km - (availability_ratio * 2)
        scored.append({**h, "distance_km": distance_km, "score": score})

    scored.sort(key=lambda h: h["score"])
    return [
        {k: v for k, v in h.items() if k != "score"}
        for h in scored[:top_n]
    ]