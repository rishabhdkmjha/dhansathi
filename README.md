# 🪙 DhanSathi — India's First AI Financial Advisor

<div align="center">

![DhanSathi Banner](https://img.shields.io/badge/DhanSathi-AI%20Financial%20Advisor-F5A623?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Democratizing financial planning for 150 million young Indians**

[Features](#features) • [Demo](#demo) • [Setup](#setup) • [Architecture](#architecture) • [API](#api-docs)

</div>

---

## 🚀 What is DhanSathi?

DhanSathi is a full-stack AI-powered financial advisor built specifically for India. It provides the expertise of a Chartered Accountant — available 24/7, completely free, in plain language.

> **The Problem:** 70% of young Indians lack access to financial planning. A CA charges ₹5,000–₹50,000/year. A 25-year-old making suboptimal financial decisions loses ₹2.5 Crore in lifetime wealth.

> **The Solution:** DhanSathi — your free AI CA friend.

---

## ✨ Features

### 🧾 Tax Advisor
- Computes **Old vs New Regime** with exact FY 2024-25 tax slabs
- Calculates all deductions — **80C, 80D, HRA, NPS, Section 24B**
- Finds **missed opportunities** with exact ₹ savings amounts
- AI explains everything in **plain Hindi-English**
- Section 87A rebate, surcharge, and cess — all handled

### 📈 Investment Advisor
- **Personalized portfolio** based on age, income, risk profile
- Recommends specific instruments — ELSS, SIP, PPF, NPS, SGB
- **Platform-specific guidance** — Groww, Zerodha, HDFC Pension
- 10-year wealth projection with realistic return assumptions
- Emergency fund and insurance gap analysis

### 💬 Ask DhanSathi (AI Chat)
- Conversational financial Q&A
- Understands Indian context — CTC vs in-hand, PF, gratuity
- Multi-turn conversation with memory
- Hinglish support — ask in whatever language feels natural

### 🌗 Dark / Light Mode
- Full dark and light theme support
- SEBI-compliant disclaimers throughout

---

## 🎬 Demo

| Tax Advisor | Investment Advisor | AI Chat |
|------------|-------------------|---------|
| Enter income & deductions | Enter monthly income & goals | Ask anything about money |
| Get Old vs New regime comparison | Get personalized SIP plan | Get plain language answers |
| See missed tax savings | See 10-year wealth projection | India-specific financial advice |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Pure CSS with custom design system |
| Backend | FastAPI (Python 3.11) |
| AI Engine | Groq API (Llama 3.1 8B Instant) |
| Tax Computation | Pure Python — deterministic, zero hallucination |
| HTTP Client | httpx (async) |
| Data Validation | Pydantic v2 |

---

## ⚡ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/rishabhdkmjha/dhansathi.git
cd dhansathi
```

### 2. Setup Backend
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Add your Groq API key to .env
```

### 3. Configure Environment
Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Backend
```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
# API docs at http://localhost:8000/docs
```

### 5. Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 6. Open the app
Go to **http://localhost:5173** 🎉

---

## 🏗️ Architecture

```
dhansathi/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── tax.py                 # Tax advisor endpoints
│   │   ├── investment.py          # Investment advisor endpoints
│   │   └── chat.py                # Chat endpoint
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── services/
│   │   ├── ai_service.py          # AI engine communication
│   │   └── tax_engine.py          # Deterministic tax computation
│   └── prompts/
│       └── system_prompts.py      # India-specific AI prompts
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css              # DhanSathi design system
        ├── pages/
        │   ├── TaxPage.jsx        # Tax advisor UI
        │   ├── InvestmentPage.jsx # Investment advisor UI
        │   └── ChatPage.jsx       # Chat UI
        ├── components/
        │   ├── Header.jsx         # Navigation + theme toggle
        │   └── StatCard.jsx       # Animated number cards
        ├── hooks/
        │   └── useCountUp.js      # Animated counter hook
        └── utils/
            └── api.js             # API calls + INR formatter
```

### Key Architecture Decision — Hybrid Intelligence

```
User Input
    │
    ▼
Python Tax Engine ──────────────────► Exact Numbers
(Deterministic Math)                  (Zero AI hallucination)
    │
    ▼
AI Engine ──────────────────────────► Plain English Explanation
(Explains results)                    (Action items, insights)
    │
    ▼
React Frontend ─────────────────────► Beautiful UI
```

**Why this matters:** Tax calculations are never delegated to AI. Python computes exact numbers. AI only explains them. This eliminates hallucination risk on financial figures.

---

## 📡 API Docs

Once backend is running, visit **http://localhost:8000/docs** for interactive Swagger UI.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tax-advisor` | Full AI tax analysis |
| POST | `/api/v1/tax-quick-estimate` | Instant tax estimate (no AI) |
| POST | `/api/v1/investment-advisor` | Personalized investment plan |
| GET | `/api/v1/investment-personas` | Demo personas |
| POST | `/api/v1/chat` | AI chat |

### Example Request
```bash
curl -X POST "http://localhost:8000/api/v1/tax-quick-estimate?annual_income=800000"
```

```json
{
  "income": 800000,
  "old_regime_tax": 44044,
  "new_regime_tax": 31460,
  "recommended": "new",
  "you_save": 12584
}
```

---

## 🇮🇳 Indian Tax Rules Implemented (FY 2024-25)

- ✅ New Regime slabs: 0% → 5% → 10% → 15% → 20% → 30%
- ✅ Old Regime slabs with senior citizen variations
- ✅ Section 87A rebate (₹5L old / ₹7L new)
- ✅ Standard Deduction ₹75,000 (Budget 2024)
- ✅ Section 80C (₹1,50,000 limit)
- ✅ Section 80D health insurance
- ✅ HRA exemption formula (metro/non-metro)
- ✅ Section 24B home loan interest
- ✅ NPS 80CCD(1B) additional ₹50,000
- ✅ 4% education cess
- ✅ Surcharge for high income

---

## 🗺️ Roadmap

- [ ] Hindi language support
- [ ] 10 Indian regional languages
- [ ] ITR filing assistance
- [ ] Portfolio tracker
- [ ] CA consultation booking
- [ ] WhatsApp bot integration
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Rishabh Jha**
Founder & AI Lead, DhanSathi

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/rishabhdkmjha)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github)](https://github.com/rishabhdkmjha)

*Amazon ML Scholar | IIT Research | CDAC Quantum Finance*

---

## ⚠️ Disclaimer

DhanSathi provides AI-generated financial information for educational purposes only. This is not SEBI-registered investment advice. Please consult a qualified financial advisor before making investment decisions.

---

<div align="center">

**Built with ❤️ for 150 million young Indians**

*ET Gen AI Hackathon — Phase 2 Submission*

</div>
