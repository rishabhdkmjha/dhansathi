import React from 'react'
import { useCountUp } from '../hooks/useCountUp.js'
import { formatINR } from '../utils/api.js'

export function StatCard({ label, value, sub, accent = false, delay = 0 }) {
  const animated = useCountUp(value, 1000)

  return (
    <div className={`card ${accent ? 'card-gold' : ''}`}
      style={{ animation: `fadeUp 0.5s ease ${delay}ms both` }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        color: accent ? 'var(--gold)' : 'var(--text-primary)',
        lineHeight: 1.1,
        animation: 'count-up 0.4s ease forwards',
      }}>
        {formatINR(animated)}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{sub}</div>
      )}
    </div>
  )
}

export function RegimeCard({ regime, recommended }) {
  const isRec = regime.regime?.toLowerCase().includes(recommended)
  const tax = useCountUp(regime.total_tax, 1000)
  const rate = regime.effective_rate

  return (
    <div className="card" style={{
      border: isRec ? '1px solid rgba(245,166,35,0.35)' : '1px solid var(--border-dim)',
      background: isRec
        ? 'linear-gradient(135deg, var(--navy-800) 0%, rgba(245,166,35,0.06) 100%)'
        : 'var(--navy-800)',
      position: 'relative',
      animation: 'fadeUp 0.5s ease both',
    }}>
      {isRec && (
        <div style={{
          position: 'absolute', top: -10, right: 16,
        }}>
          <span className="badge badge-gold">✓ Recommended</span>
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
        {regime.regime}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {[
          ['Gross Income',    formatINR(regime.gross_income)],
          ['Total Deductions', formatINR(regime.total_deductions)],
          ['Taxable Income',  formatINR(regime.taxable_income)],
          ['Cess',           formatINR(regime.cess)],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{v}</span>
          </div>
        ))}
        <div className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Tax</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 22,
            color: isRec ? 'var(--gold)' : 'var(--text-primary)',
          }}>
            {formatINR(tax)}
          </span>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {rate}% effective rate
        </div>
      </div>
    </div>
  )
}
