from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and scaler
# Use absolute path for Vercel
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
        print(f"Warning: Model or Scaler not found at {MODEL_PATH}")

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        load_resources()
        
    if model is None or scaler is None:
        return jsonify({"error": "Model not loaded. Please run the training script."}), 500

    try:
        data = request.get_json()
        
        # Prepare features (30 features: Time, V1-V28, Amount)
        # We'll use defaults for missing V features if only V1-V4 are provided in the UI
        features = np.zeros(30)
        features[0] = float(data.get('time', 0))
        features[29] = float(data.get('amount', 0))
        
        # Fill V1-V4 from request
        for i in range(1, 5):
            features[i] = float(data.get(f'v{i}', 0))
            
        # Reshape for prediction
        features_reshaped = features.reshape(1, -1)
        
        # Scale
        features_scaled = scaler.transform(features_reshaped)
        
        # Predict
        prob = model.predict_proba(features_scaled)[0][1]
        is_fraud = bool(model.predict(features_scaled)[0])
        
        return jsonify({
            "fraud_probability": prob,
            "is_fraud": is_fraud
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000)
