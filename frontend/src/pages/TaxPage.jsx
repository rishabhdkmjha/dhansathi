import React, { useState } from 'react'
import { api, formatINR, formatINRFull } from '../utils/api.js'
import { StatCard, RegimeCard } from '../components/StatCard.jsx'

const FIELD = ({ label, children }) => (
  <div>
    <label>{label}</label>
    {children}
  </div>
)

const PERSONAS = [
  { label: 'Priya — ₹6L fresher', annual_income: 600000, existing_80c: 0,    hra_received: 90000,  hra_rent_paid: 120000 },
  { label: 'Rahul — ₹12L IT Pro', annual_income: 1200000, existing_80c: 80000, hra_received: 180000, hra_rent_paid: 240000, existing_80d: 15000 },
  { label: 'Meera — ₹8L gig',     annual_income: 800000,  existing_80c: 50000, hra_received: 0,      hra_rent_paid: 0 },
]

export default function TaxPage() {
  const [form, setForm] = useState({
    annual_income: 800000, age_group: 'below_60',
    employment_type: 'salaried', existing_80c: 50000,
    existing_80d: 0, hra_received: 120000,
    hra_rent_paid: 180000, hra_metro_city: true,
    home_loan_interest: 0, nps_contribution: 0,
    other_deductions: 0, preferred_regime: null,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await api.taxAdvisor(form)
      setResult(data)
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function loadPersona(p) {
    setForm(f => ({ ...f, ...p }))
    setResult(null)
  }

  const insights = result?.ai_insights

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease both' }}>
        <div className="badge badge-gold" style={{ marginBottom: 16 }}>Tax Optimizer · FY 2024-25</div>
        <h1 style={{ marginBottom: 12 }}>Find your <em>perfect</em> tax regime</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 520, fontSize: 16 }}>
          Old vs New — computed with exact 2024-25 slabs. DhanSathi AI explains what it means in plain Hindi-English.
        </p>
      </div>

      {/* Demo personas */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Try a demo:</span>
        {PERSONAS.map(p => (
          <button key={p.label} className="btn btn-ghost" style={{ fontSize: 13, padding: '7px 14px' }}
            onClick={() => loadPersona(p)}>{p.label}</button>
        ))}
      </div>

      {/* Form */}
      <div className="card" style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease 0.1s both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          <FIELD label="Annual Income (₹)">
            <input type="number" value={form.annual_income}
              onChange={e => set('annual_income', +e.target.value)} />
          </FIELD>
          <FIELD label="Age Group">
            <select value={form.age_group} onChange={e => set('age_group', e.target.value)}>
              <option value="below_60">Below 60</option>
              <option value="60_to_80">Senior (60-80)</option>
              <option value="above_80">Super Senior (80+)</option>
            </select>
          </FIELD>
          <FIELD label="Employment Type">
            <select value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self Employed</option>
              <option value="gig_worker">Gig Worker</option>
            </select>
          </FIELD>
          <FIELD label="Existing 80C investments (₹)">
            <input type="number" value={form.existing_80c}
              onChange={e => set('existing_80c', +e.target.value)} />
          </FIELD>
          <FIELD label="Health Insurance 80D (₹)">
            <input type="number" value={form.existing_80d}
              onChange={e => set('existing_80d', +e.target.value)} />
          </FIELD>
          <FIELD label="HRA Received (₹/yr)">
            <input type="number" value={form.hra_received}
              onChange={e => set('hra_received', +e.target.value)} />
          </FIELD>
          <FIELD label="Rent Paid (₹/yr)">
            <input type="number" value={form.hra_rent_paid}
              onChange={e => set('hra_rent_paid', +e.target.value)} />
          </FIELD>
          <FIELD label="Home Loan Interest (₹)">
            <input type="number" value={form.home_loan_interest}
              onChange={e => set('home_loan_interest', +e.target.value)} />
          </FIELD>
          <FIELD label="NPS Contribution (₹)">
            <input type="number" value={form.nps_contribution}
              onChange={e => set('nps_contribution', +e.target.value)} />
          </FIELD>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
            <input type="checkbox" id="metro" checked={form.hra_metro_city}
              onChange={e => set('hra_metro_city', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--gold)' }} />
            <label htmlFor="metro" style={{ margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: 14, cursor: 'pointer' }}>
              Metro city (Delhi/Mumbai/Kolkata/Chennai)
            </label>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ minWidth: 180 }}>
            {loading ? <><div className="spinner" /> Analyzing...</> : '→ Calculate & Explain'}
          </button>
          {error && <span style={{ color: 'var(--red)', fontSize: 13 }}>⚠ {error}</span>}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div id="results" style={{ animation: 'fadeUp 0.5s ease both' }}>
          {/* Savings hero */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(0,212,170,0.04) 100%)',
            border: '1px solid rgba(245,166,35,0.2)',
            borderRadius: 20, padding: '32px 36px',
            marginBottom: 28, textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              You save by choosing {result.tax_analysis.recommended_regime.toUpperCase()} REGIME
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'var(--gold)' }}>
              {formatINR(result.tax_analysis.savings_by_choosing_recommended)}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 14 }}>per year in taxes</div>
          </div>

          {/* Regime comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <RegimeCard regime={result.tax_analysis.old_regime} recommended={result.tax_analysis.recommended_regime} />
            <RegimeCard regime={result.tax_analysis.new_regime} recommended={result.tax_analysis.recommended_regime} />
          </div>

          {/* Deductions used */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: 'var(--teal)' }}>✓ Deductions Applied</div>
              {Object.entries(result.deductions.applied).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>{formatINRFull(v)}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: 'var(--gold)' }}>⚡ Missed Opportunities</div>
              {Object.entries(result.deductions.missed_opportunities).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>+{formatINRFull(v.amount)}</span>
                  </div>
                  {v.tip && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{v.tip}</div>}
                </div>
              ))}
              {Object.keys(result.deductions.missed_opportunities).length === 0 && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Great! No major missed deductions.</div>
              )}
            </div>
          </div>

          {/* AI Explanation */}
          {insights && (
            <div className="card card-gold" style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(245,166,35,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>DhanSathi AI says</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>DhanSathi Intelligence · SEBI-aware</div>
                </div>
              </div>

              {insights.plain_english_summary && (
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16, color: 'var(--text-primary)' }}>
                  {insights.plain_english_summary}
                </p>
              )}

              {insights.key_insight && (
                <div style={{
                  background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)',
                  borderRadius: 10, padding: '14px 16px', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Key Insight</div>
                  <div style={{ fontSize: 14 }}>{insights.key_insight}</div>
                </div>
              )}

              {insights.missed_opportunity_highlight && (
                <div style={{
                  background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)',
                  borderRadius: 10, padding: '14px 16px', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Biggest Opportunity</div>
                  <div style={{ fontSize: 14 }}>{insights.missed_opportunity_highlight}</div>
                </div>
              )}

              {insights.action_items?.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Action Items</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {insights.action_items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          background: 'rgba(245,166,35,0.15)', color: 'var(--gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 600,
                        }}>{i + 1}</span>
                        <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {insights.motivational_closing && (
                <div style={{
                  marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-dim)',
                  fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic',
                }}>
                  {insights.motivational_closing}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}