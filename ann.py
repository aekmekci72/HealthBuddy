import numpy as np
import pandas as pd
import mysql.connector
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import TensorBoard



connection = mysql.connector.connect(
    host='sqlclassdb-instance-1.cqjxl5z5vyvr.us-east-2.rds.amazonaws.com',
    port=3306,
    user='ann_shr',
    password='v2ZsQpfqTXxS',
    database='anna_shreeja_proj',
    connect_timeout=10000
)

train_query = """
    SELECT d.name, s.symptom
    FROM diseases d
    JOIN disease_symptom_xref x ON d.name = x.disease
    JOIN symptoms s ON x.symptom = s.symptom
"""

cursor = connection.cursor()
cursor.execute(train_query)
train_result = cursor.fetchall()

train_data = pd.DataFrame(train_result, columns=['name', 'symptom'])


X_train = train_data.drop(columns=['name'])
y_train = train_data['name']

le = LabelEncoder()
y_train_encoded = le.fit_transform(y_train)

X_train, _, y_train_encoded, _ = train_test_split(X_train, y_train_encoded, test_size=0.2, random_state=42)

scaler = StandardScaler()

categorical_columns = X_train.select_dtypes(exclude=[np.number]).columns
encoder = OneHotEncoder(sparse=False, drop='first')
X_train = encoder.fit_transform(X_train[categorical_columns])

scaler.fit(X_train)


model = Sequential()
model.add(Dense(64, input_dim=4, activation='relu'))
model.add(Dense(32, activation='relu'))
model.add(Dense(len(le.classes_), activation='softmax'))


# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
tensorboard_callback = TensorBoard(log_dir='./logs', histogram_freq=1)

# Train the model with the TensorBoard callback
model.fit(X_train, y_train_encoded, epochs=10, batch_size=32, callbacks=[tensorboard_callback])


user_query = """
    SELECT symptom
    FROM symptoms
    WHERE username = 'annekm26' 
"""

cursor.execute(user_query)
user_result = cursor.fetchall()

user_symptoms = pd.DataFrame(user_result, columns=['symptom'])

user_symptoms_encoded = encoder.transform(user_symptoms)
user_symptoms_scaled = scaler.transform(user_symptoms_encoded)

print("user_symptoms_encoded shape:", user_symptoms_encoded.shape)
print("user_symptoms_scaled shape:", user_symptoms_scaled.shape)

user_symptoms_combined = np.concatenate((user_symptoms_scaled, user_symptoms_encoded), axis=1)

predictions = model.predict(user_symptoms_combined)

decoded_predictions = le.inverse_transform(np.argmax(predictions, axis=1))
predicted_disease = decoded_predictions[0]

print(f'The model predicts that the user may have: {predicted_disease}')