from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.joblib')

model = None
scaler = None

def load_resources():
    global model, scaler
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    else:
        print(f"Warning: Model not found at {MODEL_PATH}")

# Load on cold start
load_resources()

@app.route('/api/predict', methods=['POST'])
def predict():
    global model, scaler
    if model is None or scaler is None:
        load_resources()

    if model is None or scaler is None:
        return jsonify({"error": "Model not loaded. Please run the training script."}), 500

    try:
        data = request.get_json()

        # 30 features: Time, V1-V28, Amount
        features = np.zeros(30)
        features[0] = float(data.get('time', 0))
        features[29] = float(data.get('amount', 0))

        for i in range(1, 5):
            features[i] = float(data.get(f'v{i}', 0))

        features_reshaped = features.reshape(1, -1)
        features_scaled = scaler.transform(features_reshaped)

        prob = model.predict_proba(features_scaled)[0][1]
        is_fraud = bool(model.predict(features_scaled)[0])

        return jsonify({
            "fraud_probability": float(prob),
            "is_fraud": is_fraud
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
