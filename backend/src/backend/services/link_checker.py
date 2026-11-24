import json
import tldextract
import Levenshtein
from backend.core.config import DATA_DIR
from backend.schemas.analysis import RiskLevel

DATA_PATH = DATA_DIR / "legitimate_domains.json"

def load_legitimate_domains() -> list[str]:
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return ["vietcombank.com.vn", "bidv.com.vn", "dichvucong.gov.vn", "dongnai.gov.vn"]

SUSPICIOUS_TLDS = {".xyz", ".top", ".tk", ".icu", ".buzz", ".cfd", ".rest", ".online", ".site", ".club"}

def check_url_safety(url: str) -> tuple[RiskLevel, str, str]:
    """Kiểm tra độ an toàn của đường link dựa trên tên miền và thuật toán Levenshtein"""
    ext = tldextract.extract(url)
    registered_domain = ext.registered_domain.lower()
    domain_suffix = f".{ext.suffix.lower()}"

    if not registered_domain:
        return RiskLevel.SUSPICIOUS, "Đường dẫn không hợp lệ", "Không thể xác định tên miền chính thức của đường dẫn."

    legit_domains = load_legitimate_domains()

    # 1. Khớp chính xác tên miền chính thống
    for legit in legit_domains:
        if registered_domain == legit or f"{ext.subdomain}.{registered_domain}".endswith(legit):
            return RiskLevel.SAFE, "Tên miền chính thống", f"Đường dẫn thuộc tổ chức chính thức hợp pháp ({legit})."

    # 2. Phát hiện Typosquatting (Mạo danh bằng cách viết sai lệch 1-2 ký tự)
    for legit in legit_domains:
        legit_name = legit.split(".")[0]
        current_name = ext.domain.lower()

        # Nếu tên gần giống (ví dụ vietconbank vs vietcombank)
        distance = Levenshtein.distance(current_name, legit_name)
        if 1 <= distance <= 2 and len(current_name) >= 5:
            return (
                RiskLevel.DANGEROUS,
                "Phát hiện tên miền giả mạo (Typosquatting)",
                f"Tên miền '{registered_domain}' cố tình viết tương tự thương hiệu chính thống '{legit}' để đánh lừa người dùng."
            )

    # 3. Kiểm tra đuôi tên miền rủi ro cao thường dùng để lừa đảo
    if domain_suffix in SUSPICIOUS_TLDS:
        return (
            RiskLevel.DANGEROUS,
            "Đuôi tên miền rủi ro cao",
            f"Đuôi tên miền '{domain_suffix}' thường được các nhóm lừa đảo đăng ký giá rẻ để mạo danh cơ quan hoặc ngân hàng."
        )

    # 4. Kiểm tra từ khóa nhạy cảm trong subdomain hoặc domain
    sensitive_keywords = ["bank", "vietcom", "dichvucong", "cong-an", "vneid", "chinhphu"]
    for kw in sensitive_keywords:
        if kw in url.lower() and not any(legit in url.lower() for legit in legit_domains):
            return (
                RiskLevel.DANGEROUS,
                "Dấu hiệu mạo danh ngân hàng / dịch vụ công",
                f"Đường dẫn chứa từ khóa nhạy cảm '{kw}' nhưng không thuộc hệ thống tên miền chính thống."
            )

    return RiskLevel.SUSPICIOUS, "Tên miền chưa được xác minh", "Đường dẫn lạ chưa có trong danh bạ an toàn. Vui lòng không đăng nhập hoặc nộp tiền."
