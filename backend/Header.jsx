import React from 'react'

export default function Header({ activeTab, onTabChange }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid rgba(245,166,35,0.1)',
      background: 'rgba(11,15,30,0.85)',
      backdropFilter: 'blur(20px)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #F5A623 0%, #FFD07A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>₹</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1 }}>DhanSathi</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Financial Advisor</div>
          </div>
        </div>

        {/* Nav tabs */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { id: 'tax',        label: 'Tax Advisor' },
            { id: 'investment', label: 'Invest' },
            { id: 'chat',       label: 'Ask DhanSathi' },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 8, border: 'none',
                background: activeTab === tab.id ? 'rgba(245,166,35,0.12)' : 'transparent',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Status pill */}
        <div className="badge badge-teal" style={{ animation: 'pulse-gold 2s infinite' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
          SEBI-Aware AI
        </div>
      </div>
    </header>
  )
}
