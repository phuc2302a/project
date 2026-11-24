from datetime import UTC, datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class Blacklist(Base):
    __tablename__ = "blacklists"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    target: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    target_type: Mapped[str] = mapped_column(String(50), nullable=False)  # phone, link, bank_account
    risk_level: Mapped[str] = mapped_column(String(20), default="DANGEROUS")  # DANGEROUS, SUSPICIOUS
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    reports_count: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))


class ScamReport(Base):
    __tablename__ = "scam_reports"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    target: Mapped[str] = mapped_column(String(255), nullable=False)
    target_type: Mapped[str] = mapped_column(String(50), nullable=False)
    tactic_type: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True, default=None)
    risk_level: Mapped[str] = mapped_column(String(20), default="DANGEROUS")
    is_police_reported: Mapped[int] = mapped_column(default=0)
    police_case_code: Mapped[str | None] = mapped_column(String(100), nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
