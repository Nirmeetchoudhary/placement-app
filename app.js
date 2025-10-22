import numpy as np
import pandas as pd
from flask import Flask, request, render_template
import pickle

# 1. Initialize the Flask app
app = Flask(__name__)

# 2. Load the trained model
# 'rb' means read binary
model = pickle.load(open('model.pkl', 'rb'))

# 3. Define the home page route
@app.route('/')
def home():
    # Render the HTML template (templates/index.html)
    return render_template('index.html')

# 4. Define the prediction route (handles form submission)
@app.route('/predict', methods=['POST'])
def predict():
    # Extract the features from the submitted form data
    # 'request.form.values()' gets all form field values
    features = [float(x) for x in request.form.values()]
    
    # Create a NumPy array for prediction
    final_features = [np.array(features)]
    
    # Make the prediction
    prediction = model.predict(final_features)

    # Get the output (0 or 1 in your case)
    output = prediction[0]

    # Convert the prediction into a readable message
    if output == 1:
        result_text = 'Congratulations! The student is likely to be placed.'
    else:
        result_text = 'The student is likely not to be placed, further studies are recommended.'

    # Render the home page again, passing the prediction message
    return render_template('index.html', prediction_text=result_text)

# 5. Run the app when the script is executed
if __name__ == "__main__":
    # debug=True allows for automatic restarts during development
    app.run(debug=True)