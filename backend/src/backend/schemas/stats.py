from pydantic import BaseModel
from backend.schemas.report import ReportResponse

class CategoryStats(BaseModel):
    fake_link: int
    impersonation_police: int
    fake_job_ctv: int
    emergency_accident: int

class VolunteerDashboardStats(BaseModel):
    total_reports_month: int
    fake_links_percentage: int
    phone_scams_percentage: int
    bank_scams_percentage: int
    summary_by_category: CategoryStats
    recent_reports: list[ReportResponse]

class ScenarioItem(BaseModel):
    id: int
    title: str
    target_audience: str
    category: str
    summary: str
    key_warning: str
    action_guide: str
    duration_minutes: int
