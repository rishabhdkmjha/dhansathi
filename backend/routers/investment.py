from fastapi import APIRouter, HTTPException
from models.schemas import InvestmentRequest
from services.ai_service import get_ai_json
from prompts.system_prompts import INVESTMENT_ADVISOR_SYSTEM
import json

router = APIRouter()


def compute_portfolio_basics(req: InvestmentRequest) -> dict:
    monthly_surplus  = req.monthly_income - req.monthly_expenses
    emergency_target = req.monthly_expenses * 6

    equity_pct = min(90, max(30, (100 - req.age) + {
        "conservative": -15, "moderate": 0, "aggressive": 15,
    }.get(req.risk_profile, 0)))
    debt_pct = 100 - equity_pct

    monthly_investment = monthly_surplus * 0.30
    months = req.investment_horizon * 12
    rate_monthly = 0.10 / 12
    projected_value = monthly_investment * (((1 + rate_monthly) ** months - 1) / rate_monthly) * (1 + rate_monthly)

    return {
        "monthly_surplus":    round(monthly_surplus, 2),
        "annual_surplus":     round(monthly_surplus * 12, 2),
        "emergency_target":   round(emergency_target, 2),
        "emergency_needed":   not req.has_emergency_fund,
        "equity_allocation":  equity_pct,
        "debt_allocation":    debt_pct,
        "monthly_investable": round(monthly_investment, 2),
        "projected_value":    round(projected_value, 2),
        "total_invested":     round(monthly_investment * months, 2),
    }


@router.post("/investment-advisor", summary="Get personalized investment recommendations")
async def investment_advisor(req: InvestmentRequest):
    try:
        basics = compute_portfolio_basics(req)

        user_message = f"""
Give investment advice for this young Indian investor:

FINANCIAL SNAPSHOT:
- Monthly Income (take-home): \u20b9{req.monthly_income:,.0f}
- Monthly Expenses: \u20b9{req.monthly_expenses:,.0f}
- Monthly Surplus: \u20b9{basics['monthly_surplus']:,.0f}
- Age: {req.age}
- Risk Profile: {req.risk_profile}
- Investment Horizon: {req.investment_horizon} years
- Existing Savings: \u20b9{req.existing_savings:,.0f}

PROTECTION STATUS:
- Emergency Fund: {'Has it' if req.has_emergency_fund else 'MISSING - critical gap'}
- Life Insurance: {'Has it' if req.has_life_insurance else 'Missing'}
- Health Insurance: {'Has it' if req.has_health_insurance else 'Missing'}

GOALS: {', '.join(req.financial_goals) if req.financial_goals else 'Not specified'}

ALLOCATION GUIDANCE:
- Equity: {basics['equity_allocation']}%
- Debt: {basics['debt_allocation']}%
- Monthly Investable: ~\u20b9{basics['monthly_investable']:,.0f}

PROJECTION: Over {req.investment_horizon} years at 10% blended return
- Total Invested: \u20b9{basics['total_invested']:,.0f}
- Projected Corpus: \u20b9{basics['projected_value']:,.0f}

Provide specific, actionable recommendations using the JSON format.
"""

        ai_response = await get_ai_json(INVESTMENT_ADVISOR_SYSTEM, user_message, max_tokens=2500)

        return {
            "status": "success",
            "financial_basics": basics,
            "ai_recommendations": ai_response,
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Response parsing failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/investment-personas", summary="Demo personas for presentation")
async def get_demo_personas():
    return {
        "personas": [
            {
                "name": "Priya — Fresh Graduate",
                "description": "23yr, \u20b95L package, Mumbai, first job",
                "monthly_income": 35000, "monthly_expenses": 22000,
                "age": 23, "risk_profile": "moderate",
                "has_emergency_fund": False, "has_life_insurance": False,
                "has_health_insurance": False,
                "financial_goals": ["emergency_fund", "travel", "retirement_start"],
            },
            {
                "name": "Rahul — IT Professional",
                "description": "28yr, \u20b912L package, Bangalore, 3yrs experience",
                "monthly_income": 75000, "monthly_expenses": 42000,
                "age": 28, "risk_profile": "aggressive",
                "has_emergency_fund": True, "has_life_insurance": False,
                "has_health_insurance": True,
                "financial_goals": ["home_purchase", "early_retirement", "wealth_creation"],
            },
            {
                "name": "Meera — Gig Worker",
                "description": "26yr, freelancer, \u20b98L/yr variable income, Delhi",
                "monthly_income": 55000, "monthly_expenses": 30000,
                "age": 26, "risk_profile": "conservative",
                "has_emergency_fund": False, "has_life_insurance": False,
                "has_health_insurance": False,
                "financial_goals": ["stability", "tax_saving", "retirement"],
            }
        ]
    }