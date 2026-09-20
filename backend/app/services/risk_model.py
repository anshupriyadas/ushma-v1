import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent.parent / "ml" / "artifacts" / "risk_model.pkl"

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def predict_ml_risk(wbgt, utci, heat_index, aqi_index, pct_elderly=10, pct_informal_housing=20):
    """
    Returns an ML-predicted 0-100 hospitalization risk score.
    Trained on a documented synthetic dataset (see ml/train.py) —
    upgradeable to real health data without changing this interface.
    """
    model = _get_model()
    import pandas as pd
    features = pd.DataFrame([[wbgt, utci, heat_index, aqi_index, pct_elderly, pct_informal_housing]],
                         columns=["wbgt", "utci", "heat_index", "aqi_index", "pct_elderly", "pct_informal_housing"])
    score = model.predict(features)[0]
    return round(float(score), 1)