import math
from pythermalcomfort.models import utci


def calculate_heat_index(temp_c, humidity):
    """
    NWS Rothfusz Heat Index calculation.
    """
    temp_f = (temp_c * 9 / 5) + 32

    simple_hi = (
        0.5
        * (
            temp_f
            + 61.0
            + ((temp_f - 68.0) * 1.2)
            + (humidity * 0.094)
        )
    )

    simple_hi = (simple_hi + temp_f) / 2

    if simple_hi < 80:
        heat_index_f = simple_hi
    else:
        heat_index_f = (
            -42.379
            + (2.04901523 * temp_f)
            + (10.14333127 * humidity)
            - (0.22475541 * temp_f * humidity)
            - (0.00683783 * temp_f ** 2)
            - (0.05481717 * humidity ** 2)
            + (0.00122874 * temp_f ** 2 * humidity)
            + (0.00085282 * temp_f * humidity ** 2)
            - (0.00000199 * temp_f ** 2 * humidity ** 2)
        )

        if humidity < 13 and 80 <= temp_f <= 112:
            adjustment = (
                ((13 - humidity) / 4)
                * ((17 - abs(temp_f - 95)) / 17) ** 0.5
            )
            heat_index_f -= adjustment

        elif humidity > 85 and 80 <= temp_f <= 87:
            adjustment = (
                ((humidity - 85) / 10)
                * ((87 - temp_f) / 5)
            )
            heat_index_f += adjustment

    heat_index_c = (heat_index_f - 32) * 5 / 9
    return round(heat_index_c, 1)


def calculate_wbgt(temp_c, humidity, wind_speed=2.0, solar_radiation=500):
    """
    Estimated outdoor WBGT.
    """
    tw = (
        temp_c * math.atan(0.151977 * math.sqrt(humidity + 8.313659))
        + math.atan(temp_c + humidity)
        - math.atan(humidity - 1.676331)
        + 0.00391838 * humidity ** 1.5 * math.atan(0.023101 * humidity)
        - 4.686035
    )

    natural_wet_bulb = (
        tw
        + 0.001651 * solar_radiation
        - 0.09555 * wind_speed
        + 0.13235 * (temp_c - tw)
        + 0.20249
    )
    natural_wet_bulb = min(natural_wet_bulb, temp_c)

    globe_temp = (
        temp_c
        + 0.02 * solar_radiation
        - 1.5 * math.sqrt(max(wind_speed, 0.1))
    )

    wbgt = (
        0.7 * natural_wet_bulb
        + 0.2 * globe_temp
        + 0.1 * temp_c
    )

    return round(wbgt, 1)


def calculate_utci(temp_c, humidity, wind_speed=2.0, mean_radiant_temp=None):
    """
    Universal Thermal Climate Index via pythermalcomfort.
    mean_radiant_temp is approximated until real solar/radiation data is wired in.
    """
    if mean_radiant_temp is None:
        mean_radiant_temp = temp_c + 2  # placeholder offset

    result = utci(
        tdb=temp_c,
        tr=mean_radiant_temp,
        v=wind_speed,
        rh=humidity,
        limit_inputs=False,
    )

    utci_value = result.utci if hasattr(result, "utci") else result
    return round(utci_value, 1)


# ---------------------------------------------------------------
# HTSI — Human Thermal Stress Index
# Combines Heat Index + WBGT + UTCI into one risk category.
# Design choice: take the MOST SEVERE of the three signals, so
# the system never understates risk just because one index reads low.
# ---------------------------------------------------------------

LEVEL_LABELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"]


def _classify_heat_index(hi_c):
    if hi_c < 27:
        return 0
    elif hi_c < 32:
        return 1
    elif hi_c < 41:
        return 2
    return 3


def _classify_wbgt(wbgt_c):
    if wbgt_c < 27:
        return 0
    elif wbgt_c < 30:
        return 1
    elif wbgt_c < 32:
        return 2
    return 3


def _classify_utci(utci_c):
    # Based on the official UTCI thermal-stress category boundaries
    if utci_c < 26:
        return 0
    elif utci_c < 32:
        return 1
    elif utci_c < 38:
        return 2
    return 3


def calculate_htsi(temp_c, humidity, wind_speed=2.0, solar_radiation=500):
    heat_index = calculate_heat_index(temp_c, humidity)
    wbgt = calculate_wbgt(temp_c, humidity, wind_speed, solar_radiation)
    utci_value = calculate_utci(temp_c, humidity, wind_speed)

    level = max(
        _classify_heat_index(heat_index),
        _classify_wbgt(wbgt),
        _classify_utci(utci_value),
    )

    return {
        "heat_index": heat_index,
        "wbgt": wbgt,
        "utci": utci_value,
        "htsi_level": level,
        "risk": LEVEL_LABELS[level],
    }