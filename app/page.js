'use client'

import { useState, useEffect } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Info, CreditCard, Activity, Lock, Zap, Server, Terminal, BarChart3, Database } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({ scanned: 0, threats: 0, uptime: '99.9%' })
  const [formData, setFormData] = useState({
    amount: '125.50',
    time: '45000',
    v1: '0.12', v2: '-0.45', v3: '1.23', v4: '-0.12'
  })

  // Simulated log generation
  useEffect(() => {
    const initialLogs = [
      { id: 1, msg: 'Neural engine initialized...', type: 'info', time: '14:20:01' },
      { id: 2, msg: 'Connecting to global fraud database...', type: 'info', time: '14:20:02' },
      { id: 3, msg: 'System armed and monitoring.', type: 'success', time: '14:20:05' },
    ]
    setLogs(initialLogs)
  }, [])

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-GB')
    setLogs(prev => [{ id: Date.now(), msg, type, time }, ...prev].slice(0, 50))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    addLog(`Scanning transaction for $${formData.amount}...`, 'info')

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setResult(data)
      
      setStats(prev => ({ 
        ...prev, 
        scanned: prev.scanned + 1,
        threats: data.is_fraud ? prev.threats + 1 : prev.threats
      }))

      if (data.is_fraud) {
        addLog(`CRITICAL: Fraudulent pattern detected! (${(data.fraud_probability * 100).toFixed(1)}%)`, 'error')
      } else {
        addLog(`Analysis complete: Transaction verified as safe.`, 'success')
      }
    } catch (error) {
      console.error('Error:', error)
      addLog('Error communicating with neural engine.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const chartData = [
    { subject: 'V1', A: Math.abs(parseFloat(formData.v1)) * 20, fullMark: 100 },
    { subject: 'V2', A: Math.abs(parseFloat(formData.v2)) * 20, fullMark: 100 },
    { subject: 'V3', A: Math.abs(parseFloat(formData.v3)) * 20, fullMark: 100 },
    { subject: 'V4', A: Math.abs(parseFloat(formData.v4)) * 20, fullMark: 100 },
    { subject: 'AMT', A: Math.min((parseFloat(formData.amount) / 1000) * 10, 100), fullMark: 100 },
  ]

  return (
    <main className="container">
      <header>
        <div className="logo">
          <Shield className="border-beam" size={32} />
          <span>FraudGuard Command Center</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={14} /> System Node: Global-East-1
          </div>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
            <Zap size={14} /> Latency: 42ms
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { icon: Activity, label: 'Transactions Scanned', value: stats.scanned, color: 'var(--primary)' },
          { icon: ShieldAlert, label: 'Threats Blocked', value: stats.threats, color: 'var(--danger)' },
          { icon: Database, label: 'Model Accuracy', value: '94.2%', color: 'var(--accent)' },
          { icon: Lock, label: 'Uptime', value: stats.uptime, color: 'var(--success)' }
        ].map((s, i) => (
          <motion.div 
            key={i} 
            className="card stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <s.icon size={20} style={{ color: s.color, marginBottom: '0.5rem' }} />
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Form */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Terminal className="text-primary" />
            <h2 style={{ fontSize: '1.25rem' }}>Input Terminal</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Transaction Amount ($)</label>
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} />
            </div>
            
            <div className="form-grid">
              {['v1', 'v2', 'v3', 'v4'].map((v) => (
                <div key={v} className="input-group">
                  <label>{v.toUpperCase()}</label>
                  <input type="number" step="0.01" name={v} value={formData[v]} onChange={handleInputChange} />
                </div>
              ))}
            </div>

            <button className="btn" disabled={loading} style={{ marginTop: '2rem' }}>
              {loading ? 'Processing Neural Path...' : 'Analyze Transaction'}
            </button>
          </form>
        </motion.div>

        {/* Middle Column: Analysis & Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div className="card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <BarChart3 className="text-primary" />
              <h2 style={{ fontSize: '1.25rem' }}>Feature Intensity Radar</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <Radar
                    name="Intensity"
                    dataKey="A"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                className={`card ${result.is_fraud ? 'result-fraud' : 'result-legit'}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ padding: '2rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {result.is_fraud ? <ShieldAlert size={40} /> : <ShieldCheck size={40} />}
                  <div>
                    <h3 style={{ fontSize: '1.5rem' }}>{result.is_fraud ? 'Anomaly Detected' : 'Clearance Granted'}</h3>
                    <p style={{ opacity: 0.8 }}>Probability Score: {(result.fraud_probability * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Console Log */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Activity className="text-primary" />
            <h2 style={{ fontSize: '1.25rem' }}>System Console</h2>
          </div>
          <div className="log-container">
            {logs.map(log => (
              <div key={log.id} className="log-entry">
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>[{log.time}]</span>
                <span style={{ 
                  color: log.type === 'error' ? 'var(--danger)' : 
                         log.type === 'success' ? 'var(--success)' : 'white',
                  marginLeft: '0.5rem',
                  flex: 1
                }}>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <footer style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>&copy; 2026 FraudGuard v2.0 - Advanced Neural Protection</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span className="stat-label">Security Protocol: AES-256</span>
            <span className="stat-label">Neural Model: RF-Ensemble-v4</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
