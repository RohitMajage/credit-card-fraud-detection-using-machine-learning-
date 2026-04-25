import { NextResponse } from 'next/server'

// ─── Fraud Detection Model (Random Forest-inspired, JS) ───────────────────────
// Trained patterns from our synthetic dataset:
//   Fraudulent transactions have: V1 shifted -5, V3 shifted -3, Amount x2.5
//   This ensemble uses weighted decision trees derived from those patterns.

const TREES = [
  // Each tree: array of { v1, v3, amount thresholds, weight }
  (f) => (f.v1 < -2.5 ? 0.7 : 0.05) * (f.amount > 400 ? 1.4 : 1.0),
  (f) => (f.v3 < -1.5 ? 0.65 : 0.04) * (f.v1 < -3 ? 1.3 : 1.0),
  (f) => (f.v1 < -4 ? 0.85 : 0.08),
  (f) => (f.v3 < -2.5 ? 0.75 : 0.06) * (f.amount > 600 ? 1.2 : 1.0),
  (f) => {
    let s = 0
    if (f.v1 < -3) s += 0.35
    if (f.v3 < -1.5) s += 0.25
    if (f.amount > 500) s += 0.15
    if (f.v2 < -1) s += 0.1
    if (f.v4 > 2) s += 0.05
    return s
  },
  (f) => (f.v1 < -2 && f.v3 < -1 ? 0.72 : 0.06),
  (f) => (f.amount > 800 && f.v1 < -1 ? 0.55 : 0.07),
  (f) => {
    const anomaly = Math.abs(f.v1) + Math.abs(f.v3)
    return anomaly > 7 ? 0.78 : anomaly > 4 ? 0.35 : 0.04
  },
  (f) => (f.v1 < -5 ? 0.92 : f.v1 < -3 ? 0.55 : 0.04),
  (f) => (f.v3 < -3 ? 0.88 : f.v3 < -1.5 ? 0.45 : 0.04),
]

function predictFraud(features) {
  // Average all tree votes
  const votes = TREES.map((tree) => {
    const raw = tree(features)
    return Math.min(Math.max(raw, 0), 1)  // clamp 0–1
  })

  const avgProb = votes.reduce((a, b) => a + b, 0) / votes.length

  // Sigmoid-smooth the final probability
  const prob = 1 / (1 + Math.exp(-8 * (avgProb - 0.4)))
  const clampedProb = Math.min(Math.max(prob, 0.01), 0.99)

  return {
    fraud_probability: clampedProb,
    is_fraud: clampedProb > 0.5,
  }
}

// ─── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const data = await request.json()

    const features = {
      amount: parseFloat(data.amount ?? 0),
      time: parseFloat(data.time ?? 0),
      v1: parseFloat(data.v1 ?? 0),
      v2: parseFloat(data.v2 ?? 0),
      v3: parseFloat(data.v3 ?? 0),
      v4: parseFloat(data.v4 ?? 0),
    }

    const result = predictFraud(features)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
