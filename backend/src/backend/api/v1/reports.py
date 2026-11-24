import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.models.report import Blacklist, ScamReport
from backend.schemas.lookup import TargetType
from backend.schemas.report import ReportCreate, ReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("", response_model=ReportResponse)
def submit_report(payload: ReportCreate, db: Session = Depends(get_db)) -> ReportResponse:
    """Gửi báo cáo một trường hợp lừa đảo mới"""
    report_id = f"RP-{uuid.uuid4().hex[:6].upper()}"
    police_case_code = f"CA-ĐN-2026-{uuid.uuid4().hex[:4].upper()}" if payload.is_police_reported else None

    report = ScamReport(
        id=report_id,
        target=payload.target,
        target_type=payload.target_type.value,
        tactic_type=payload.tactic_type,
        description=payload.description,
        evidence_image_url=payload.evidence_image_url,
        risk_level="DANGEROUS",
        is_police_reported=1 if payload.is_police_reported else 0,
        police_case_code=police_case_code,
        created_at=datetime.now(UTC),
    )
    db.add(report)

    # Cập nhật hoặc thêm vào danh sách đen (Blacklist)
    existing_blacklist = db.query(Blacklist).filter(Blacklist.target == payload.target).first()
    if existing_blacklist:
        existing_blacklist.reports_count = int(existing_blacklist.reports_count) + 1
    else:
        new_blacklist = Blacklist(
            target=payload.target,
            target_type=payload.target_type.value,
            risk_level="DANGEROUS",
            reason=f"Bị người dân phản ánh: {payload.tactic_type}",
            reports_count=1,
        )
        db.add(new_blacklist)

    db.commit()
    db.refresh(report)

    return ReportResponse(
        id=report.id,
        target=report.target,
        target_type=payload.target_type,
        tactic_type=report.tactic_type,
        description=report.description,
        risk_level=report.risk_level,
        reported_at=report.created_at.isoformat(),
        is_police_reported=bool(report.is_police_reported),
        police_case_code=report.police_case_code,
    )


@router.get("", response_model=list[ReportResponse])
def get_recent_reports(limit: int = 20, db: Session = Depends(get_db)):
    """Lấy danh sách các tin báo lừa đảo gần đây"""
    reports = db.query(ScamReport).order_by(ScamReport.created_at.desc()).limit(limit).all()
    return [
        ReportResponse(
            id=r.id,
            target=r.target,
            target_type=TargetType(r.target_type),
            tactic_type=r.tactic_type,
            description=r.description,
            risk_level=r.risk_level,
            reported_at=r.created_at.isoformat(),
            is_police_reported=bool(r.is_police_reported),
            police_case_code=r.police_case_code,
        )
        for r in reports
    ]
