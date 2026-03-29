from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class AgeGroup(str, Enum):
    below_60  = "below_60"
    senior    = "60_to_80"
    super_sr  = "above_80"


class EmploymentType(str, Enum):
    salaried   = "salaried"
    self_emp   = "self_employed"
    gig_worker = "gig_worker"
    student    = "student"


# ── Tax Advisor ──────────────────────────────────────────────────────────────

class TaxRequest(BaseModel):
    annual_income:        float = Field(...,  description="Annual gross income in INR", example=800000)
    age_group:            AgeGroup = Field(AgeGroup.below_60, description="Age bracket for tax slab")
    employment_type:      EmploymentType = Field(EmploymentType.salaried)
    existing_80c:         float = Field(0,   description="Already invested under 80C (EPF, PPF, etc.)")
    existing_80d:         float = Field(0,   description="Health insurance premiums paid")
    hra_received:         float = Field(0,   description="HRA component in salary")
    hra_rent_paid:        float = Field(0,   description="Actual rent paid per year")
    hra_metro_city:       bool  = Field(True, description="Is employee in metro city?")
    home_loan_interest:   float = Field(0,   description="Home loan interest paid (Section 24)")
    nps_contribution:     float = Field(0,   description="NPS contribution (80CCD 1B)")
    other_deductions:     float = Field(0,   description="Any other known deductions")
    preferred_regime:     Optional[str] = Field(None, description="'old', 'new', or None for auto-compare")


class DeductionBreakdown(BaseModel):
    section:     str
    amount:      float
    max_limit:   float
    explanation: str


class RegimeSummary(BaseModel):
    regime:           str
    gross_income:     float
    total_deductions: float
    taxable_income:   float
    tax_before_cess:  float
    cess:             float
    total_tax:        float
    effective_rate:   float


class TaxResponse(BaseModel):
    old_regime:            RegimeSummary
    new_regime:            RegimeSummary
    recommended_regime:    str
    savings_vs_current:    float
    deductions_used:       List[DeductionBreakdown]
    missed_deductions:     List[DeductionBreakdown]
    ai_explanation:        str
    action_items:          List[str]


# ── Investment Advisor ────────────────────────────────────────────────────────

class RiskProfile(str, Enum):
    conservative = "conservative"
    moderate     = "moderate"
    aggressive   = "aggressive"


class InvestmentRequest(BaseModel):
    monthly_income:      float = Field(...,  description="Monthly take-home income in INR")
    monthly_expenses:    float = Field(...,  description="Current monthly expenses")
    age:                 int   = Field(...,  description="Age of the investor")
    risk_profile:        RiskProfile = Field(RiskProfile.moderate)
    existing_savings:    float = Field(0,    description="Current savings/investments")
    financial_goals:     List[str] = Field(default_factory=list, description="Goals like 'home', 'retirement', 'education'")
    investment_horizon:  int   = Field(5,    description="Investment horizon in years")
    has_emergency_fund:  bool  = Field(False)
    has_life_insurance:  bool  = Field(False)
    has_health_insurance:bool  = Field(False)


class InvestmentOption(BaseModel):
    instrument:         str
    category:           str
    recommended_amount: float
    expected_return:    str
    lock_in_period:     str
    tax_benefit:        Optional[str]
    why_this:           str
    how_to_start:       str


class InvestmentResponse(BaseModel):
    monthly_investable_surplus: float
    emergency_fund_needed:      bool
    emergency_fund_target:      float
    portfolio_allocation:       dict
    recommendations:            List[InvestmentOption]
    year_projection:            dict
    ai_explanation:             str
    priority_action:            str


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role:    str
    content: str


class ChatRequest(BaseModel):
    message:  str
    history:  List[ChatMessage] = Field(default_factory=list)
    context:  Optional[dict]    = Field(None, description="Optional user financial context")


class ChatResponse(BaseModel):
    reply:           str
    suggested_tools: List[str]
