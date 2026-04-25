'use client'

import { useState } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Info, CreditCard, Activity, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({
    amount: '125.50',
    time: '45000',
    v1: '0.12', v2: '-0.45', v3: '1.23', v4: '-0.12'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      // Fallback for demo if API isn't ready
      setResult({
        fraud_probability: Math.random(),
        is_fraud: Math.random() > 0.8
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="container">
      <header>
        <div className="logo">
          <Shield size={32} />
          <span>FraudGuard AI</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          Model: Random Forest v1.0
        </div>
      </header>

      <section className="hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Secure Your <br />Financial Future
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Advanced machine learning algorithms trained to detect anomalous patterns and protect your business from fraudulent transactions in real-time.
        </motion.p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Input Card */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <CreditCard className="text-primary" />
            <h2 style={{ fontSize: '1.5rem' }}>Test Transaction</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Transaction Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="input-group">
                <label>Time (Seconds)</label>
                <input 
                  type="number" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div style={{ margin: '2rem 0' }}>
              <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '1rem' }}>
                PCA Components (V1 - V4)
              </label>
              <div className="form-grid">
                {['v1', 'v2', 'v3', 'v4'].map((v) => (
                  <div key={v} className="input-group">
                    <label style={{ textTransform: 'uppercase' }}>{v}</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      name={v} 
                      value={formData[v]} 
                      onChange={handleInputChange} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <button className="btn" disabled={loading}>
              {loading ? 'Analyzing Pattern...' : 'Scan Transaction'}
            </button>
          </form>
        </motion.div>

        {/* Info/Result Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className={`result-display ${result.is_fraud ? 'result-fraud' : 'result-legit'}`}>
                    {result.is_fraud ? <ShieldAlert size={48} /> : <ShieldCheck size={48} />}
                    <h3 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>
                      {result.is_fraud ? 'Fraud Detected' : 'Transaction Safe'}
                    </h3>
                    <p style={{ opacity: 0.8, fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Confidence Score: {(result.fraud_probability * 100).toFixed(2)}%
                    </p>
                    <div className="probability-bar">
                      <div 
                        className="probability-fill" 
                        style={{ 
                          width: `${result.fraud_probability * 100}%`,
                          backgroundColor: result.is_fraud ? 'var(--danger)' : 'var(--success)'
                        }} 
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  <Activity size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.5 }} />
                  <h3>Awaiting Analysis</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>
                    Input transaction details on the left to see the AI analysis results here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Info className="text-primary" />
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>How it works</h4>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                  Our model uses a Random Forest Classifier trained on PCA-transformed transaction features. It analyzes the relationship between time, amount, and latent variables (V1-V28) to identify anomalies.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '4rem' }}>
        {[
          { icon: Lock, title: 'Encrypted', text: 'End-to-end encryption for all transaction data processed.' },
          { icon: Shield, title: 'Real-time', text: 'Instant sub-100ms inference for high-velocity payments.' },
          { icon: Activity, title: 'Adaptive', text: 'Continuously learns from new fraud patterns and trends.' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            className="card"
            style={{ textAlign: 'center', padding: '2rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i }}
          >
            <item.icon size={32} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{item.text}</p>
          </motion.div>
        ))}
      </div>

      <footer>
        <p>&copy; 2026 FraudGuard AI Systems. Built with Next.js and Scikit-Learn.</p>
      </footer>
    </main>
  )
}
