import joblib

model = joblib.load("ml/lifeline_health_model.pkl")

print(type(model))