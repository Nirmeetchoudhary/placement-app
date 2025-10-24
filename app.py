from flask import Flask, render_template, request
import pickle
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load the saved model
model = pickle.load(open('model.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get input from form
    cgpa = float(request.form['cgpa'])
    iq = float(request.form['iq'])
    
    # Create array for model input
    features = np.array([[cgpa, iq]])
    
    # Predict placement
    prediction = model.predict(features)[0]
    
    # Send result to web page
    result_text = "🎉 Placed!" if prediction == 1 else "❌ Not Placed"
    
    return render_template('index.html', prediction_text=f'Prediction: {result_text}')

if __name__ == '__main__':
    app.run(debug=True)
