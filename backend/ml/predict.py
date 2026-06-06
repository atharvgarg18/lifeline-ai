import sys
import joblib
import numpy as np

model = joblib.load("ml/lifeline_health_model.pkl")

sleep_duration = float(sys.argv[1])
quality_sleep = float(sys.argv[2])
physical_activity = float(sys.argv[3])
stress_level = float(sys.argv[4])
heart_rate = float(sys.argv[5])
daily_steps = float(sys.argv[6])

input_data = np.array([[
    sleep_duration,
    quality_sleep,
    physical_activity,
    stress_level,
    heart_rate,
    daily_steps
]])

prediction = model.predict(input_data)

print(prediction[0])