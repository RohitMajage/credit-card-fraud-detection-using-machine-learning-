import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_synthetic_data(n_samples=5000):
    print(f"Generating {n_samples} synthetic transaction samples...")
    # Features: V1-V28 (PCA components)
    v_features = np.random.randn(n_samples, 28)
    
    # Amount: Log-normal distribution
    amount = np.exp(np.random.normal(4, 1.5, n_samples))
    
    # Time: Sequential
    time = np.linspace(0, 172800, n_samples)
    
    # Combine into DataFrame
    df = pd.DataFrame(v_features, columns=[f'V{i+1}' for i in range(28)])
    df['Amount'] = amount
    df['Time'] = time
    
    # Target: 0 (Legit), 1 (Fraud)
    # Fraud cases are rare (0.2%)
    y = np.zeros(n_samples)
    fraud_indices = np.random.choice(n_samples, int(n_samples * 0.02), replace=False) # 2% for better demo training
    y[fraud_indices] = 1
    
    # Make fraud look like fraud (higher amounts, specific V feature patterns)
    df.loc[y == 1, 'Amount'] = df.loc[y == 1, 'Amount'] * 2.5
    df.loc[y == 1, 'V1'] = df.loc[y == 1, 'V1'] - 5
    df.loc[y == 1, 'V3'] = df.loc[y == 1, 'V3'] - 3
    
    return df, y

def train():
    # Ensure api directory exists
    if not os.path.exists('api'):
        os.makedirs('api')
        
    X, y = generate_synthetic_data()
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Save model and scaler
    print("Saving model to api/model.joblib and api/scaler.joblib...")
    joblib.dump(model, 'api/model.joblib')
    joblib.dump(scaler, 'api/scaler.joblib')
    
    print("Training complete!")

if __name__ == "__main__":
    train()
