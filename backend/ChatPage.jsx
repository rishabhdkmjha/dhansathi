import React, { useState, useRef, useEffect } from 'react'
import { api } from '../utils/api.js'

const STARTERS = [
  'I earn ₹8L/year. How do I save tax?',
  'Should I choose old or new tax regime?',
  'What is ELSS and how does it save tax?',
  'I\'m 24 and just got my first job. Where to start?',
  'What is NPS and should I invest in it?',
  'Difference between PPF and FD?',
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 20,
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'fadeUp 0.3s ease both',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: isUser ? 'var(--navy-500)' : 'rgba(245,166,35,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div style={{
        maxWidth: '72%',
        background: isUser ? 'var(--navy-600)' : 'var(--navy-800)',
        border: isUser ? '1px solid var(--border-dim)' : '1px solid rgba(245,166,35,0.1)',
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        padding: '14px 18px',
        fontSize: 14, lineHeight: 1.7,
        color: 'var(--text-primary)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
        {msg.suggested_tools?.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {msg.suggested_tools.map(tool => (
              <span key={tool} className="badge badge-gold" style={{ fontSize: 11 }}>
                → Try {tool === 'tax_advisor' ? 'Tax Advisor' : 'Investment Advisor'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    const userMsg = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await api.chat({ message: msg, history })
      setMessages(prev => [...prev, {
        role: 'assistant', content: res.reply,
        suggested_tools: res.suggested_tools,
      }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠ Something went wrong. Make sure the DhanSathi backend is running on localhost:8000.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{
      maxWidth: 780, margin: '0 auto', padding: '40px 24px',
      display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
        <div className="badge badge-gold" style={{ marginBottom: 14 }}>Chat · Hinglish OK</div>
        <h1 style={{ marginBottom: 8 }}>Ask <em>anything</em> about money</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Your AI CA friend — explains tax, investments, and financial decisions in plain language.
        </p>
      </div>

      {/* Chat window */}
      <div style={{
        flex: 1, background: 'var(--navy-800)',
        border: '1px solid var(--border-dim)', borderRadius: 16,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        minHeight: 480,
      }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
          {messages.length === 0 && (
            <div style={{ animation: 'fadeIn 0.5s ease both' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>₹</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Namaste! I'm DhanSathi</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  Ask me anything about Indian taxes, investments, or financial planning.
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Try asking
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STARTERS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    style={{
                      background: 'var(--navy-700)', border: '1px solid var(--border-dim)',
                      borderRadius: 10, padding: '12px 16px', color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.target.style.borderColor = 'var(--border-dim)'; e.target.style.color = 'var(--text-secondary)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => <Message key={i} msg={msg} />)}

          {loading && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,166,35,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                DhanSathi is thinking...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: '16px 20px', borderTop: '1px solid var(--border-dim)',
          display: 'flex', gap: 10,
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your question... (Enter to send)"
            disabled={loading}
            rows={1}
            style={{
              flex: 1, resize: 'none', borderRadius: 10,
              background: 'var(--navy-700)', border: '1px solid var(--border-dim)',
              color: 'var(--text-primary)', padding: '12px 16px',
              fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
            }}
          />
          <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}
            style={{ minWidth: 80, justifyContent: 'center' }}>
            {loading ? <div className="spinner" /> : '→'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        For educational purposes only. Consult a SEBI-registered advisor for personalized advice.
      </div>
    </div>
  )
}
