from datetime import datetime

from pydantic import BaseModel, Field

from backend.schemas.lookup import TargetType


class ReportCreate(BaseModel):
    tactic_type: str = Field(..., description="Nhóm thủ đoạn lừa đảo")
    target: str = Field(..., min_length=3, description="SĐT / link / số tài khoản đối tượng")
    target_type: TargetType = Field(..., description="Loại đối tượng")
    description: str = Field(..., min_length=5, description="Mô tả vụ việc")
    evidence_image_url: str | None = Field(default=None, description="URL ảnh bằng chứng")
    is_police_reported: bool = Field(default=False, description="Gửi đồng thời đến kênh Công an")


class ReportResponse(BaseModel):
    id: str
    target: str
    target_type: TargetType
    tactic_type: str
    description: str
    risk_level: str
    reported_at: datetime
    is_police_reported: bool
    police_case_code: str | None = None
