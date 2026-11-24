from enum import Enum

from pydantic import BaseModel, Field

from backend.schemas.analysis import RiskLevel


class TargetType(str, Enum):
    PHONE = "phone"
    LINK = "link"
    BANK_ACCOUNT = "bank_account"


class LookupRequest(BaseModel):
    query: str = Field(..., min_length=2, description="SĐT, số tài khoản hoặc link website")


class LookupResponse(BaseModel):
    target: str
    target_type: TargetType
    risk_level: RiskLevel
    title: str
    reason: str
    reports_count: int = 0
    recommended_action: str
