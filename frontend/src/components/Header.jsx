import React, { useEffect, useState } from 'react'

export default function Header({ activeTab, onTabChange }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid rgba(245,166,35,0.1)',
      background: dark ? 'rgba(11,15,30,0.95)' : 'rgba(255,255,255,0.95)',
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
            fontSize: 18, fontWeight: 700,
          }}>₹</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1, color: dark ? '#F0EDE8' : '#0B0F1E' }}>DhanSathi</div>
            <div style={{ fontSize: 10, color: dark ? '#4A5568' : '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Financial Advisor</div>
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
                background: activeTab === tab.id ? 'rgba(245,166,35,0.15)' : 'transparent',
                color: activeTab === tab.id ? '#F5A623' : dark ? '#8B93A8' : '#555',
                fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid #F5A623' : '2px solid transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right side: theme toggle + SEBI badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Dark/Light toggle */}
          <button onClick={() => setDark(d => !d)}
            style={{
              width: 40, height: 22,
              borderRadius: 11, border: 'none',
              background: dark ? '#F5A623' : '#CBD5E0',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.3s',
              flexShrink: 0,
            }}>
            <span style={{
              position: 'absolute',
              top: 3, left: dark ? 21 : 3,
              width: 16, height: 16,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9,
            }}>
              {dark ? '🌙' : '☀️'}
            </span>
          </button>

          {/* SEBI badge */}
          <div className="badge badge-teal">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
            SEBI-Aware AI
          </div>
        </div>
      </div>
    </header>
  )
}