from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.lookup import LookupResponse
from backend.services.lookup_service import lookup_target

router = APIRouter(prefix="/lookup", tags=["Quick Verification"])

@router.get("", response_model=LookupResponse)
def verify_target(
    q: str = Query(..., min_length=2, description="SĐT, link hoặc số tài khoản cần kiểm tra"),
    db: Session = Depends(get_db)
) -> LookupResponse:
    """Kiểm tra nhanh đối tượng và trả về kết quả đèn giao thông: Xanh - Vàng - Đỏ"""
    return lookup_target(q, db)
