import json
from fastapi import APIRouter
from backend.core.config import DATA_DIR
from backend.schemas.stats import VolunteerDashboardStats, CategoryStats
from backend.schemas.report import ReportResponse

router = APIRouter(prefix="/stats", tags=["Volunteer Dashboard"])

DATA_PATH = DATA_DIR / "sample_reports.json"

@router.get("", response_model=VolunteerDashboardStats)
def get_volunteer_stats() -> VolunteerDashboardStats:
    """Thống kê các kiểu lừa đảo tại địa phương dành cho Đội tình nguyện (120 lượt báo cáo, 35% link giả)"""
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return VolunteerDashboardStats(
                total_reports_month=data["total_reports_month"],
                fake_links_percentage=data["fake_links_percentage"],
                phone_scams_percentage=data["phone_scams_percentage"],
                bank_scams_percentage=data["bank_scams_percentage"],
                summary_by_category=CategoryStats(**data["summary_by_category"]),
                recent_reports=[
                    ReportResponse(
                        id=r["id"],
                        target=r["target"],
                        target_type=r["target_type"],
                        tactic_type=r["tactic_type"],
                        description=r["description"],
                        risk_level=r["risk_level"],
                        reported_at=r["reported_at"],
                        is_police_reported=r["is_police_reported"],
                        police_case_code=r["police_case_code"]
                    )
                    for r in data["recent_reports"]
                ]
            )

    return VolunteerDashboardStats(
        total_reports_month=120,
        fake_links_percentage=35,
        phone_scams_percentage=40,
        bank_scams_percentage=25,
        summary_by_category=CategoryStats(
            fake_link=42,
            impersonation_police=36,
            fake_job_ctv=24,
            emergency_accident=18
        ),
        recent_reports=[]
    )
