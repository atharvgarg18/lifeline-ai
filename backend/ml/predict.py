from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()

model = joblib.load("ml/lifeline_health_model.pkl")

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/predict")
def predict(
    sleep_duration: float,
    quality_sleep: float,
    physical_activity: float,
    stress_level: float,
    heart_rate: float,
    daily_steps: float
):
    input_data = np.array([[
        sleep_duration,
        quality_sleep,
        physical_activity,
        stress_level,
        heart_rate,
        daily_steps
    ]])

    prediction = model.predict(input_data)

    return {
        "health_score": float(prediction[0])
    }