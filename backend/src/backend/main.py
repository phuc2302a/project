import json
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.core.database import engine, Base, SessionLocal
from backend.models.report import Blacklist, ScamReport
from backend.api.v1.analyze import router as analyze_router
from backend.api.v1.lookup import router as lookup_router
from backend.api.v1.reports import router as reports_router
from backend.api.v1.stats import router as stats_router
from backend.api.v1.scenarios import router as scenarios_router

def seed_initial_data():
    """Khởi tạo bảng và nạp dữ liệu mẫu ban đầu nếu database trống"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Blacklist).count() == 0:
            sample_file = os.path.join(os.path.dirname(__file__), "../data/sample_reports.json")
            if os.path.exists(sample_file):
                with open(sample_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for r in data.get("recent_reports", []):
                        db.add(Blacklist(
                            target=r["target"],
                            target_type=r["target_type"],
                            risk_level=r["risk_level"],
                            reason=r["tactic_type"],
                            reports_count=5
                        ))
                    db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo DB khi ứng dụng chạy
    seed_initial_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống API Nền tảng Phòng chống lừa đảo - Lá Chắn Số (Hackathon Đồng Nai 2026)",
    lifespan=lifespan
)

# Cấu hình CORS cho phép Frontend truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router
app.include_router(analyze_router, prefix="/api/v1")
app.include_router(lookup_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(stats_router, prefix="/api/v1")
app.include_router(scenarios_router, prefix="/api/v1")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "ai_provider": settings.AI_PROVIDER
    }
