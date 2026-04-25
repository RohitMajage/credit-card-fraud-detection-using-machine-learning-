# FraudGuard AI 🛡️

A high-performance credit card fraud detection system built with Next.js. This application uses an ensemble of decision trees implemented natively in JavaScript for lightning-fast real-time inference on the edge.

## 🚀 Live Demo
[View on Vercel](https://credit-card-fraud-detection-using-machine-learning.vercel.app/)

## 🧠 Intelligence Engine
- **Algorithm**: Custom Decision Tree Ensemble (JS) trained on PCA-transformed transaction patterns.
- **Inference**: Native Next.js API Routes (Serverless).
- **Architecture**: Zero-dependency inference for maximum reliability and speed.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, Framer Motion, Lucide Icons.
- **Styling**: Premium Vanilla CSS (Glassmorphism).
- **Backend**: Next.js API Routes.

## 📦 Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Methodology
The model detects anomalies by analyzing the relationships between transaction amount, time, and latent variables (V1-V4). It identifies specific patterns typical of fraudulent transactions, such as significant negative shifts in V1 and V3 components paired with abnormal transaction amounts.
