from enum import Enum

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    DANGEROUS = "DANGEROUS"


class ExtractedEntities(BaseModel):
    phones: list[str] = Field(default_factory=list, description="Số điện thoại trích xuất")
    bank_accounts: list[str] = Field(default_factory=list, description="Số tài khoản ngân hàng")
    urls: list[str] = Field(default_factory=list, description="Đường link trích xuất")


class AnalyzeMessageRequest(BaseModel):
    message: str = Field(..., min_length=2, description="Nội dung tin nhắn cần phân tích")


class ScamAnalysisResult(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Điểm rủi ro từ 0 đến 100")
    risk_level: RiskLevel = Field(..., description="Mức độ rủi ro: SAFE, SUSPICIOUS, DANGEROUS")
    tactics: list[str] = Field(default_factory=list, description="Thủ đoạn thao túng được nhận diện")
    dangerous_phrases: list[str] = Field(default_factory=list, description="Cụm từ nguy hiểm cần tô đỏ")
    reasoning: str = Field(..., description="Giải thích lý do ngắn gọn, dễ hiểu")
    recommended_action: str = Field(..., description="Khuyến nghị hành động tức thì")
    extracted_entities: ExtractedEntities = Field(default_factory=ExtractedEntities)
