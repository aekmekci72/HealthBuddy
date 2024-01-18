from flask import Flask, jsonify
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import urllib.request
import zipfile
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict():

    # Download the zip file and extract the CSV file(s)
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00275/Bike-Sharing-Dataset.zip"
    filename = "Bike-Sharing-Dataset.zip"
    urllib.request.urlretrieve(url, filename)
    with zipfile.ZipFile(filename, "r") as zip_ref:
        zip_ref.extractall()

    # Read the CSV file(s) into Pandas dataframes
    hour_df = pd.read_csv("hour.csv")
    day_df = pd.read_csv("day.csv")

    # Combine the two dataframes into a single dataframe
    bikes_df = pd.concat([hour_df, day_df], ignore_index=True)

    # Save the combined dataframe to a CSV file
    bikes_df.to_csv("bike_sharing_total.csv", index=False)

    bikes_df.head()
    # Preprocess your data and train your model
    X = bikes_df.drop(columns=['instant', 'dteday', 'casual', 'registered', 'cnt', 'hr'], axis=1)
    y = bikes_df['cnt']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    plt.figure(figsize=(8, 8))
    plt.scatter(y_test, predictions)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], color = 'black', label="Correct prediction")


    plt.xlabel('True Value', fontsize = 'x-large')
    plt.ylabel('Predicted Value', fontsize = 'x-large')
    plt.title("Real vs Value", fontsize = 'x-large')
    plt.legend()

    plt.show()

    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print(f'Mean Squared Error: {mse}')
    print(f'R2 Score: {r2}')

    # Return the results as JSON
    result = {
        'predictions': predictions.tolist(),
        'mse': mse,
        'r2': r2
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
predict()