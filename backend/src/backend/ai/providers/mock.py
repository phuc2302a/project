import re
import unicodedata
from backend.schemas.analysis import ScamAnalysisResult, RiskLevel, ExtractedEntities

def remove_accents(input_str: str) -> str:
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)]).replace('đ', 'd').replace('Đ', 'd')

class MockProvider:
    """Mock Provider chạy offline, giả lập phân tích AI dựa trên từ khóa tiếng Việt (có dấu & không dấu)"""

    async def analyze(self, message: str) -> ScamAnalysisResult:
        text_lower = message.lower()
        text_no_accents = remove_accents(text_lower)

        # Trích xuất thực thể bằng regex
        phones = re.findall(r"(?:0|\+84)[3|5|7|8|9]\d{8}\b", message)
        urls = re.findall(r"https?://[^\s]+", message)
        bank_accounts = re.findall(r"\b\d{9,16}\b", message)

        dangerous_phrases: list[str] = []
        tactics: list[str] = []

        # 1. Giả danh cơ quan công an / viện kiểm sát
        police_keywords = ["công an", "viện kiểm sát", "lệnh bắt", "rửa tiền", "tạm giam", "cong an", "vien kiem sat", "lenh bat", "rua tien", "tam giam"]
        if any(w in text_lower or w in text_no_accents for w in police_keywords):
            tactics.append("Giả danh cơ quan bảo vệ pháp luật")
            dangerous_phrases.extend([w for w in ["công an", "lệnh bắt", "chuyển tiền vào tài khoản", "tạm giam", "cong an", "tam giam"] if w in text_lower or w in text_no_accents])

        # 2. Tuyển CTV việc nhẹ lương cao
        job_keywords = ["việc nhẹ", "lương cao", "hoa hồng", "ctv", "cộng tác viên", "chốt đơn", "viec nhe", "luong cao", "hoa hong", "chot don"]
        if any(w in text_lower or w in text_no_accents for w in job_keywords):
            tactics.append("Dụ dỗ việc nhẹ lương cao / CTV ảo")
            dangerous_phrases.extend([w for w in ["việc nhẹ lương cao", "hoa hồng", "chốt đơn", "viec nhe luong cao", "chot don"] if w in text_lower or w in text_no_accents])

        # 3. Trúng thưởng / quà tri ân
        gift_keywords = ["trúng thưởng", "quà tri ân", "nhận quà", "bấm vào link", "miễn phí", "trung thuong", "qua tri an", "nhan qua", "bam vao link"]
        if any(w in text_lower or w in text_no_accents for w in gift_keywords):
            tactics.append("Lừa đảo quà tặng tri ân / link nhận quà")
            dangerous_phrases.extend([w for w in ["trúng thưởng", "quà tri ân", "bấm vào link", "trung thuong", "qua tri an"] if w in text_lower or w in text_no_accents])

        # 4. Tai nạn / cấp cứu chuyển tiền gấp
        accident_keywords = ["tai nạn", "cấp cứu", "viện phí", "chuyển gấp", "bệnh viện", "tai nan", "cap cuu", "vien phi", "chuyen gap", "benh vien"]
        if any(w in text_lower or w in text_no_accents for w in accident_keywords):
            tactics.append("Thao túng tâm lý khẩn cấp (tai nạn người thân)")
            dangerous_phrases.extend([w for w in ["tai nạn", "cấp cứu", "chuyển gấp", "tai nan", "cap cuu", "chuyen gap"] if w in text_lower or w in text_no_accents])

        # 5. Đòi mã OTP
        otp_keywords = ["otp", "mã xác nhận", "mật khẩu", "số thẻ", "ma xac nhan", "mat khau"]
        if any(w in text_lower or w in text_no_accents for w in otp_keywords):
            tactics.append("Yêu cầu cung cấp thông tin bảo mật nhạy cảm")
            dangerous_phrases.extend([w for w in ["otp", "mã xác nhận", "mật khẩu"] if w in text_lower or w in text_no_accents])

        if tactics:
            risk_score = 92
            risk_level = RiskLevel.DANGEROUS
            reasoning = f"Phát hiện dấu hiệu lừa đảo rõ ràng: {', '.join(tactics)}. Tin nhắn có chứa từ ngữ đe dọa hoặc mồi chài nguy hiểm."
            recommended_action = "Tuyệt đối KHÔNG làm theo hướng dẫn, KHÔNG chuyển tiền, KHÔNG bấm vào đường dẫn và KHÔNG cung cấp mã OTP. Hãy bấm nút 'Hỏi người thân' để xác minh ngay."
        elif urls or phones:
            risk_score = 55
            risk_level = RiskLevel.SUSPICIOUS
            reasoning = "Tin nhắn chứa số điện thoại hoặc đường link lạ chưa rõ nguồn gốc, cần kiểm tra kỹ trước khi tương tác."
            recommended_action = "Xác minh lại với người gửi qua kênh liên lạc chính thức trước khi cung cấp thông tin."
        else:
            risk_score = 15
            risk_level = RiskLevel.SAFE
            reasoning = "Không phát hiện các dấu hiệu lừa đảo, đe dọa hay thao túng tâm lý điển hình."
            recommended_action = "Nội dung có vẻ an toàn. Vẫn luôn giữ cảnh giác khi chia sẻ thông tin cá nhân."

        return ScamAnalysisResult(
            risk_score=risk_score,
            risk_level=risk_level,
            tactics=tactics if tactics else ["Không phát hiện"],
            dangerous_phrases=list(set(dangerous_phrases)),
            reasoning=reasoning,
            recommended_action=recommended_action,
            extracted_entities=ExtractedEntities(
                phones=phones,
                bank_accounts=bank_accounts,
                urls=urls
            )
        )
