# Healthcare Capacity Stress Index — placeholder implementation.
# Real version needs actual hospital bed/ICU data (not publicly
# available in real time in India — seeded manually for demo,
# as noted in the feasibility slide).

HOSPITALS = [
    {"name": "Ward A Municipal Hospital", "ward": "Ward A", "total_beds": 120, "available_beds": 14, "icu_beds": 8},
    {"name": "Ward B Community Hospital", "ward": "Ward B", "total_beds": 80, "available_beds": 22, "icu_beds": 5},
    {"name": "Ward C Health Centre", "ward": "Ward C", "total_beds": 60, "available_beds": 40, "icu_beds": 6},
]


def calculate_hcsi(ward_name, risk_level):
    """
    Very simple stress index: predicted demand (derived from risk level)
    vs available capacity. 0-100 scale, higher = more stressed.
    """
    hospital = next((h for h in HOSPITALS if h["ward"] == ward_name), None)
    if not hospital:
        return None

    # crude predicted-demand multiplier based on risk severity
    demand_multiplier = {0: 0.1, 1: 0.3, 2: 0.6, 3: 1.0}
    predicted_demand = round(hospital["total_beds"] * demand_multiplier[risk_level] * 0.4)

    occupancy_pressure = predicted_demand / max(hospital["available_beds"], 1)
    hcsi_score = min(100, round(occupancy_pressure * 50))

    return {
        "hospital_name": hospital["name"],
        "available_beds": hospital["available_beds"],
        "icu_beds": hospital["icu_beds"],
        "predicted_demand": predicted_demand,
        "hcsi_score": hcsi_score,
        "status": (
            "CRITICAL" if hcsi_score >= 75 else
            "HIGH" if hcsi_score >= 50 else
            "MODERATE" if hcsi_score >= 25 else
            "LOW"
        ),
    }