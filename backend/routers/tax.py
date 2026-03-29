from fastapi import APIRouter, HTTPException
from models.schemas import TaxRequest
from services.tax_engine import full_tax_analysis
from services.ai_service import get_ai_json
from prompts.system_prompts import TAX_ADVISOR_SYSTEM
import json

router = APIRouter()


@router.post("/tax-advisor", summary="Get AI-powered tax optimization advice")
async def tax_advisor(req: TaxRequest):
    try:
        analysis = full_tax_analysis(req)

        user_message = f"""
Analyze this Indian taxpayer's situation and provide advice:

TAXPAYER PROFILE:
- Annual Income: \u20b9{req.annual_income:,.0f}
- Employment: {req.employment_type}
- Age Group: {req.age_group}

TAX CALCULATION RESULTS (already computed):
Old Regime:
  - Total Deductions: \u20b9{analysis['old_regime']['total_deductions']:,.0f}
  - Taxable Income: \u20b9{analysis['old_regime']['taxable_income']:,.0f}
  - Total Tax: \u20b9{analysis['old_regime']['total_tax']:,.0f}
  - Effective Rate: {analysis['old_regime']['effective_rate']}%

New Regime:
  - Total Deductions: \u20b9{analysis['new_regime']['total_deductions']:,.0f}
  - Taxable Income: \u20b9{analysis['new_regime']['taxable_income']:,.0f}
  - Total Tax: \u20b9{analysis['new_regime']['total_tax']:,.0f}
  - Effective Rate: {analysis['new_regime']['effective_rate']}%

RECOMMENDED: {analysis['recommended'].upper()} REGIME
TAX SAVINGS: \u20b9{analysis['savings']:,.0f}

DEDUCTIONS USED: {json.dumps(analysis['deductions_used'], indent=2)}
MISSED OPPORTUNITIES: {json.dumps(analysis['deductions_missed'], indent=2)}

Provide personalized advice using the JSON format specified.
"""

        ai_response = await get_ai_json(TAX_ADVISOR_SYSTEM, user_message)

        return {
            "status": "success",
            "tax_analysis": {
                "old_regime": analysis["old_regime"],
                "new_regime": analysis["new_regime"],
                "recommended_regime": analysis["recommended"],
                "savings_by_choosing_recommended": analysis["savings"],
            },
            "deductions": {
                "applied": analysis["deductions_used"],
                "missed_opportunities": analysis["deductions_missed"],
            },
            "ai_insights": ai_response,
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Response parsing failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tax-quick-estimate", summary="Fast tax estimate")
async def quick_estimate(annual_income: float):
    from models.schemas import TaxRequest, AgeGroup, EmploymentType
    req = TaxRequest(
        annual_income=annual_income,
        age_group=AgeGroup.below_60,
        employment_type=EmploymentType.salaried,
    )
    analysis = full_tax_analysis(req)
    return {
        "income": annual_income,
        "old_regime_tax": analysis["old_regime"]["total_tax"],
        "new_regime_tax": analysis["new_regime"]["total_tax"],
        "recommended": analysis["recommended"],
        "you_save": analysis["savings"],
    }