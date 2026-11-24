import re

from sqlalchemy.orm import Session

from backend.models.report import Blacklist
from backend.schemas.analysis import RiskLevel
from backend.schemas.lookup import LookupResponse, TargetType
from backend.services.link_checker import check_url_safety


def detect_target_type(query: str) -> TargetType:
    query_clean = query.strip()
    if query_clean.startswith(("http://", "https://")) or "." in query_clean:
        return TargetType.LINK
    # Kiểm tra SĐT (9-11 số, bắt đầu bằng 0 hoặc +84)
    if re.match(r"^(?:0|\+84)\d{9,10}$", query_clean.replace(" ", "")):
        return TargetType.PHONE
    # Mặc định là số tài khoản nếu toàn số hoặc kết hợp số
    return TargetType.BANK_ACCOUNT


def lookup_target(query: str, db: Session) -> LookupResponse:
    target_clean = query.strip()
    target_type = detect_target_type(target_clean)

    # 1. Kiểm tra đối chiếu Blacklist trong Database
    db_entry = db.query(Blacklist).filter(Blacklist.target.ilike(f"%{target_clean}%")).first()
    if db_entry:
        return LookupResponse(
            target=target_clean,
            target_type=target_type,
            risk_level=RiskLevel(db_entry.risk_level),
            title=f"Đã bị cảnh báo trong danh sách đen ({db_entry.risk_level})",
            reason=db_entry.reason,
            reports_count=db_entry.reports_count,
            recommended_action="Tuyệt đối KHÔNG giao dịch, chuyển tiền hoặc làm theo yêu cầu từ đối tượng này.",
        )

    # 2. Xử lý đường dẫn qua engine Levenshtein
    if target_type == TargetType.LINK:
        risk_level, title, reason = check_url_safety(target_clean)
        action = (
            "Tuyệt đối không truy cập, không nhập thông tin tài khoản."
            if risk_level == RiskLevel.DANGEROUS
            else (
                "Bạn có thể yên tâm sử dụng đường dẫn chính thức này."
                if risk_level == RiskLevel.SAFE
                else "Hãy hỏi người thân hoặc kiểm tra kỹ trước khi click."
            )
        )
        return LookupResponse(
            target=target_clean,
            target_type=target_type,
            risk_level=risk_level,
            title=title,
            reason=reason,
            reports_count=0,
            recommended_action=action,
        )

    # 3. Xử lý SĐT hoặc Số tài khoản chưa có trong Blacklist
    return LookupResponse(
        target=target_clean,
        target_type=target_type,
        risk_level=RiskLevel.SUSPICIOUS,
        title="Chưa có báo cáo lừa đảo (Cần thận trọng)",
        reason="Thông tin này chưa nằm trong danh sách đen của hệ thống. Tuy nhiên, nếu là cuộc gọi yêu cầu chuyển tiền gấp hoặc tự xưng công an, bạn vẫn cần cảnh giác cao độ.",
        reports_count=0,
        recommended_action="Bấm 'Hỏi người thân' hoặc liên hệ trực tiếp người nhận để xác minh trước khi chuyển tiền.",
    )
