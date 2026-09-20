import json
import math

def make_polygon(center_lat, center_lon, radius_km=1.2, points=8):
    """
    Generates an approximate polygon around a center point —
    a stand-in for real municipal ward boundaries until
    Bhuvan/OSM shapefiles are integrated.
    """
    coords = []
    for i in range(points):
        angle = (2 * math.pi / points) * i
        # rough km-to-degree conversion
        d_lat = (radius_km / 111) * math.sin(angle)
        d_lon = (radius_km / (111 * math.cos(math.radians(center_lat)))) * math.cos(angle)
        coords.append([center_lon + d_lon, center_lat + d_lat])
    coords.append(coords[0])  # close the ring
    return coords


WARDS = [
    {"name": "Ward A", "lat": 22.5726, "lon": 88.3639, "radius_km": 1.4},
    {"name": "Ward B", "lat": 22.5958, "lon": 88.2636, "radius_km": 1.1},
    {"name": "Ward C", "lat": 22.5200, "lon": 88.3500, "radius_km": 1.3},
]

features = []
for w in WARDS:
    polygon = make_polygon(w["lat"], w["lon"], w["radius_km"])
    features.append({
        "type": "Feature",
        "properties": {"name": w["name"]},
        "geometry": {"type": "Polygon", "coordinates": [polygon]},
    })

geojson = {"type": "FeatureCollection", "features": features}

with open("../data/ward_boundaries.geojson", "w") as f:
    json.dump(geojson, f, indent=2)

print("Saved ward_boundaries.geojson")