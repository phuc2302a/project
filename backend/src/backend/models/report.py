from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.core.database import Base

class Blacklist(Base):
    __tablename__ = "blacklists"

    id = Column(Integer, primary_key=True, index=True)
    target = Column(String(255), unique=True, index=True, nullable=False)
    target_type = Column(String(50), nullable=False) # phone, link, bank_account
    risk_level = Column(String(20), default="DANGEROUS") # DANGEROUS, SUSPICIOUS
    reason = Column(Text, nullable=False)
    reports_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(String(50), primary_key=True, index=True)
    target = Column(String(255), nullable=False)
    target_type = Column(String(50), nullable=False)
    tactic_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    evidence_image_url = Column(String(500), nullable=True)
    risk_level = Column(String(20), default="DANGEROUS")
    is_police_reported = Column(Integer, default=0)
    police_case_code = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
