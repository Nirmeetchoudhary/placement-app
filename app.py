# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from your frontend

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

# Load your model (ensure model.pkl is in backend/)
model = joblib.load(MODEL_PATH)

@app.route("/")
def home():
    return jsonify({"status": "ok", "info": "Placement prediction API"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    """
    Expect JSON: {"features": [cgpa_value, iq_value]}
    Order must be [cgpa, iq]
    """
    try:
        payload = request.get_json(force=True)
        features = payload.get("features")
        if features is None:
            return jsonify({"error": "Missing 'features' field. Provide [cgpa, iq]"}), 400

        # ensure it's a 1D list
        arr = np.array(features, dtype=float).reshape(1, -1)

        # model.predict returns 0/1 (or probabilities depending on model)
        pred = model.predict(arr)
        # if classifier with predict_proba and you want probability:
        prob = None
        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(arr).tolist()

        result = {"prediction": int(pred[0])}
        if prob is not None:
            result["probability"] = prob

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "prediction error", "details": str(e)}), 500

if __name__ == "__main__":
    # for local testing
    app.run(host="0.0.0.0", port=5000, debug=True)
