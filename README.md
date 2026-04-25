# Credit Card Fraud Detection System 🛡️

A real-time credit card fraud detection web application powered by Machine Learning.

## 🚀 Live Demo
[View on Vercel](your-vercel-url-here)

## 🧠 How it Works
- **Model**: Random Forest Classifier trained on synthetic PCA-transformed transaction data
- **Features**: Time, Amount, and V1-V28 (PCA components mimicking the Kaggle dataset)
- **Accuracy**: Trained with 2% fraud rate for realistic class imbalance

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, Framer Motion, Lucide Icons |
| Backend | Python, Flask, Scikit-Learn |
| Hosting | Vercel |

## 📦 Local Setup

### 1. Install Dependencies
```bash
npm install
pip install -r requirements.txt
```

### 2. Train the Model
```bash
npm run train
```
This generates `api/model.joblib` and `api/scaler.joblib`.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
```
├── app/
│   ├── globals.css     # Dark mode + Glassmorphism styles
│   ├── layout.js       # Root layout
│   └── page.js         # Main dashboard
├── api/
│   └── index.py        # Python serverless function
├── scripts/
│   └── train_model.py  # Model training script
├── requirements.txt
└── package.json
```

## 📊 Dataset
Based on the structure of the [Kaggle Credit Card Fraud Detection Dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) using synthetic data for privacy compliance.
