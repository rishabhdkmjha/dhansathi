# 🪙 DhanSathi — AI Financial Advisor for India

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Free tax optimization and investment advice for 150 million young Indians**

</div>

---

## What is DhanSathi?

70% of young Indians lack access to financial planning. A CA charges ₹5,000–₹50,000/year. DhanSathi gives you the same quality advice — free, instant, in plain language.

---

## Features

**🧾 Tax Advisor**
Computes Old vs New Regime with exact FY 2024-25 slabs. Finds missed deductions across 80C, 80D, HRA, NPS. AI explains savings in plain Hindi-English.

**📈 Investment Advisor**
Personalized SIP, ELSS, PPF and NPS recommendations based on your age, income and risk profile. Includes 10-year wealth projection.

**💬 Ask DhanSathi**
Conversational AI that understands Indian financial context — CTC vs in-hand, PF, gratuity, tax slabs. Ask in plain language.

**🌗 Dark / Light Mode**
Full theme support with SEBI-compliant disclaimers throughout.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python 3.11) |
| AI Engine | Groq API (Llama 3.1 8B Instant) |
| Tax Computation | Pure Python — deterministic, zero hallucination |
| Data Validation | Pydantic v2 |

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Free API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/rishabhdkmjha/dhansathi.git
cd dhansathi
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Add your API key
Create a file called `.env` inside the `backend` folder:
```
GROQ_API_KEY=your_api_key_here
```

> ⚠️ **Never commit `.env` to GitHub.** It's already listed in `.gitignore` — keep it that way. Each person running this project needs their own free key from [console.groq.com](https://console.groq.com) in their own local `.env`.

### 4. Run Backend
```bash
python main.py
# Runs on http://localhost:8000
```

### 5. Run Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 6. Open the app
Go to **http://localhost:5173**

---

## Deployment (Vercel)

This repo's `vercel.json` deploys both the frontend (Vite) and backend (FastAPI) as a single Vercel project, with `/api/v1/*` routed to the backend.

1. Import the repo into [Vercel](https://vercel.com/new)
2. Go to **Settings → Environment Variables** on the Vercel project
3. Add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** your Groq API key
   - **Environment:** Production (and Preview/Development if needed)
4. Redeploy — environment variable changes only apply to deployments triggered after they're saved

Same rule as local dev applies: the key lives only in Vercel's dashboard, never in the repo.

---

## Project Structure

```
dhansathi/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/        # tax.py, investment.py, chat.py
│   ├── services/       # ai_service.py, tax_engine.py
│   ├── models/         # schemas.py
│   └── prompts/        # system_prompts.py
└── frontend/
    └── src/
        ├── pages/      # TaxPage, InvestmentPage, ChatPage
        ├── components/ # Header, StatCard
        └── utils/      # api.js
```

---

## Tax Rules Implemented (FY 2024-25)

- New and Old Regime slabs with senior citizen variations
- Section 87A rebate — ₹7L (new) / ₹5L (old)
- Standard Deduction ₹75,000 (Budget 2024)
- Sections 80C, 80D, 80CCD(1B), 24B
- HRA exemption formula (metro/non-metro)
- Education cess and surcharge

---

## Author

**Rishabh Jha** — [GitHub](https://github.com/rishabhdkmjha)

---

> For educational purposes only. Not SEBI-registered investment advice.
