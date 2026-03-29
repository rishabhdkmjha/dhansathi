import React, { useState, useEffect } from 'react'
import { api, formatINR } from '../utils/api.js'

const RISK_COLORS = { conservative: '#00D4AA', moderate: '#F5A623', aggressive: '#FF4D6A' }

export default function InvestmentPage() {
  const [form, setForm] = useState({
    monthly_income: 75000, monthly_expenses: 42000,
    age: 28, risk_profile: 'moderate',
    existing_savings: 200000, financial_goals: ['home_purchase', 'retirement'],
    investment_horizon: 10,
    has_emergency_fund: true, has_life_insurance: false, has_health_insurance: true,
  })
  const [personas, setPersonas] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.investmentPersonas().then(d => setPersonas(d.personas)).catch(() => {})
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await api.investmentAdvisor(form)
      setResult(data)
      setTimeout(() => document.getElementById('inv-results')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function loadPersona(p) {
    setForm(f => ({
      ...f,
      monthly_income: p.monthly_income,
      monthly_expenses: p.monthly_expenses,
      age: p.age,
      risk_profile: p.risk_profile,
      has_emergency_fund: p.has_emergency_fund,
      has_life_insurance: p.has_life_insurance,
      has_health_insurance: p.has_health_insurance,
      financial_goals: p.financial_goals,
    }))
    setResult(null)
  }

  const basics = result?.financial_basics
  const ai = result?.ai_recommendations

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease both' }}>
        <div className="badge badge-teal" style={{ marginBottom: 16 }}>Investment Advisor · India-first</div>
        <h1 style={{ marginBottom: 12 }}>Build wealth <em>intelligently</em></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 520, fontSize: 16 }}>
          Personalized SIP, ELSS, NPS and insurance recommendations based on your life stage and goals.
        </p>
      </div>

      {/* Demo personas */}
      {personas.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Try a demo:</span>
          {personas.map(p => (
            <button key={p.name} className="btn btn-ghost" style={{ fontSize: 13, padding: '7px 14px' }}
              onClick={() => loadPersona(p)}>{p.name}</button>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="card" style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease 0.1s both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 20 }}>
          {[
            ['Monthly Income (₹)', 'monthly_income', 'number'],
            ['Monthly Expenses (₹)', 'monthly_expenses', 'number'],
            ['Age', 'age', 'number'],
            ['Existing Savings (₹)', 'existing_savings', 'number'],
            ['Investment Horizon (years)', 'investment_horizon', 'number'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label>{label}</label>
              <input type={type} value={form[key]} onChange={e => set(key, +e.target.value)} />
            </div>
          ))}
          <div>
            <label>Risk Profile</label>
            <select value={form.risk_profile} onChange={e => set('risk_profile', e.target.value)}>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        {/* Protection checklist */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginBottom: 12 }}>Protection Status</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              ['has_emergency_fund', '6-month Emergency Fund'],
              ['has_life_insurance', 'Life / Term Insurance'],
              ['has_health_insurance', 'Health Insurance'],
            ].map(([key, lbl]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', letterSpacing: 0, fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--gold)' }} />
                {lbl}
              </label>
            ))}
          </div>
        </div>

        {/* Risk profile visual */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginBottom: 12 }}>Risk Tolerance</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['conservative', 'moderate', 'aggressive'].map(r => (
              <button key={r} onClick={() => set('risk_profile', r)}
                className="btn btn-ghost"
                style={{
                  flex: 1, justifyContent: 'center',
                  ...(form.risk_profile === r ? {
                    background: `rgba(${r === 'conservative' ? '0,212,170' : r === 'moderate' ? '245,166,35' : '255,77,106'},0.1)`,
                    borderColor: RISK_COLORS[r],
                    color: RISK_COLORS[r],
                  } : {}),
                }}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ minWidth: 200 }}>
            {loading ? <><div className="spinner" />Building plan...</> : '→ Build My Investment Plan'}
          </button>
          {error && <span style={{ color: 'var(--red)', fontSize: 13 }}>⚠ {error}</span>}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div id="inv-results" style={{ animation: 'fadeUp 0.5s ease both' }}>
          {/* Surplus hero */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28,
          }}>
            {[
              { label: 'Monthly Investable', value: basics.monthly_investable, accent: true },
              { label: 'Emergency Fund Target', value: basics.emergency_target },
              { label: `${form.investment_horizon}yr Projected Value`, value: basics.projected_value, accent: true },
            ].map((s, i) => (
              <div key={i} className={`card ${s.accent ? 'card-gold' : ''}`} style={{ textAlign: 'center', animation: `fadeUp 0.5s ease ${i * 80}ms both` }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: s.accent ? 'var(--gold)' : 'var(--text-primary)' }}>
                  {formatINR(s.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Allocation bar */}
          <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Suggested Asset Allocation</div>
            <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${basics.equity_allocation}%`, background: 'var(--gold)', transition: 'width 0.8s ease' }} />
              <div style={{ flex: 1, background: 'var(--teal)', opacity: 0.7 }} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span><span style={{ color: 'var(--gold)' }}>●</span> Equity {basics.equity_allocation}%</span>
              <span><span style={{ color: 'var(--teal)' }}>●</span> Debt {basics.debt_allocation}%</span>
            </div>
          </div>

          {/* AI Recommendations */}
          {ai && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 500 }}>DhanSathi Recommendations</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ai.financial_health_check}</div>
                </div>
              </div>

              {/* Recommendation cards */}
              {ai.recommendations?.map((rec, i) => (
                <div key={i} className="card" style={{
                  marginBottom: 14, display: 'grid',
                  gridTemplateColumns: '36px 1fr auto',
                  gap: 16, alignItems: 'start',
                  animation: `fadeUp 0.4s ease ${i * 80}ms both`,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(245,166,35,0.12)', color: 'var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500,
                  }}>#{rec.rank || i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{rec.instrument}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{rec.why}</div>
                    {rec.how_to_start && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--navy-700)', borderRadius: 6, padding: '6px 10px' }}>
                        → {rec.how_to_start}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)' }}>
                      {formatINR(rec.amount_per_month)}<span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/mo</span>
                    </div>
                    {rec.expected_return && (
                      <div className="badge badge-teal" style={{ marginTop: 6, fontSize: 11 }}>{rec.expected_return}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Projection */}
              {ai['5_year_projection'] && (
                <div className="card card-gold" style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Wealth Projection</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                    {[
                      ['Total Invested', ai['5_year_projection'].total_invested],
                      ['Expected Corpus', ai['5_year_projection'].expected_value],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)' }}>{formatINR(val)}</div>
                      </div>
                    ))}
                  </div>
                  {ai['5_year_projection'].assumption && (
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Assumption: {ai['5_year_projection'].assumption}
                    </div>
                  )}
                </div>
              )}

              {/* First step CTA */}
              {ai.first_step_today && (
                <div style={{
                  marginTop: 20, background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)',
                  borderRadius: 12, padding: '16px 20px',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Do this today</div>
                  <div style={{ fontSize: 15 }}>{ai.first_step_today}</div>
                </div>
              )}

              {ai.disclaimer && (
                <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  {ai.disclaimer}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}