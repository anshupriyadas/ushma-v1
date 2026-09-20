import numpy as np
import pandas as pd
import lightgbm as lgb
import joblib
from pathlib import Path

np.random.seed(42)

N = 2000

# Synthetic features — ranges based on realistic Indian summer conditions
wbgt = np.random.uniform(20, 42, N)
utci = np.random.uniform(20, 50, N)
heat_index = np.random.uniform(25, 55, N)
aqi_index = np.random.randint(1, 6, N)          # OWM scale 1-5
pct_elderly = np.random.uniform(3, 20, N)        # % of ward population
pct_informal_housing = np.random.uniform(0, 60, N)

# Synthetic ground truth — a documented formula, not real health data.
# Higher thermal stress + AQI + vulnerability -> higher hospitalization risk.
# Includes noise so the model has to learn actual patterns, not memorize a formula.
risk_score = (
    0.35 * (wbgt / 42)
    + 0.25 * (utci / 50)
    + 0.15 * (heat_index / 55)
    + 0.10 * (aqi_index / 5)
    + 0.10 * (pct_elderly / 20)
    + 0.05 * (pct_informal_housing / 60)
)
risk_score += np.random.normal(0, 0.04, N)  # noise
risk_score = np.clip(risk_score, 0, 1) * 100  # 0-100 scale

df = pd.DataFrame({
    "wbgt": wbgt,
    "utci": utci,
    "heat_index": heat_index,
    "aqi_index": aqi_index,
    "pct_elderly": pct_elderly,
    "pct_informal_housing": pct_informal_housing,
    "risk_score": risk_score,
})

X = df.drop(columns=["risk_score"])
y = df["risk_score"]

model = lgb.LGBMRegressor(n_estimators=150, learning_rate=0.05, max_depth=5)
model.fit(X, y)

# quick sanity check
train_score = model.score(X, y)
print(f"Training R^2: {train_score:.3f}")
print("Feature importances:", dict(zip(X.columns, model.feature_importances_)))

artifacts_dir = Path(__file__).parent / "artifacts"
artifacts_dir.mkdir(exist_ok=True)
joblib.dump(model, artifacts_dir / "risk_model.pkl")
print(f"Saved model to {artifacts_dir / 'risk_model.pkl'}")