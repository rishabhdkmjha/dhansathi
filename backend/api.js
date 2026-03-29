const BASE = '/api/v1'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export const api = {
  taxAdvisor:          (data) => post('/tax-advisor', data),
  taxQuickEstimate:    (income) => get(`/tax-quick-estimate?annual_income=${income}`),
  investmentAdvisor:   (data) => post('/investment-advisor', data),
  investmentPersonas:  () => get('/investment-personas'),
  chat:                (data) => post('/chat', data),
}

export function formatINR(num) {
  if (!num && num !== 0) return '—'
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000)   return `₹${(num / 100000).toFixed(2)} L`
  return `₹${Math.round(num).toLocaleString('en-IN')}`
}

export function formatINRFull(num) {
  if (!num && num !== 0) return '—'
  return `₹${Math.round(num).toLocaleString('en-IN')}`
}
