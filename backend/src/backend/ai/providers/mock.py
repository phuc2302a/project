import re
import unicodedata

from backend.schemas.analysis import ExtractedEntities, RiskLevel, ScamAnalysisResult


def remove_accents(input_str: str) -> str:
    nfkd_form = unicodedata.normalize("NFKD", input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)]).replace("đ", "d").replace("Đ", "d")


class MockProvider:
    """Mock Provider chạy offline, phân tích phát hiện dấu hiệu lừa đảo tiếng Việt (có dấu & không dấu)."""

    async def analyze(self, message: str) -> ScamAnalysisResult:
        text_lower = message.lower()
        text_no_accents = remove_accents(text_lower)

        # Trích xuất thực thể bằng regex
        phones = re.findall(r"(?:0|\+84)[3|5|7|8|9]\d{8}\b", message)
        urls = re.findall(r"https?://[^\s]+", message)
        bank_accounts = re.findall(r"\b\d{9,16}\b", message)

        dangerous_phrases: list[str] = []
        tactics: list[str] = []

        # 1. Giả danh cơ quan công an / viện kiểm sát / tòa án / CSGT
        police_keywords = [
            "công an",
            "viện kiểm sát",
            "lệnh bắt",
            "rửa tiền",
            "tạm giam",
            "tòa án",
            "csgt",
            "phạt nguội",
            "khởi tố",
            "phong tỏa tài khoản",
            "cong an",
            "vien kiem sat",
            "lenh bat",
            "rua tien",
            "tam giam",
            "toa an",
            "phat nguoi",
            "khoi to",
        ]
        if any(w in text_lower or w in text_no_accents for w in police_keywords):
            tactics.append("Giả danh cơ quan pháp luật / đe dọa tố tụng")
            for phrase in ["công an", "viện kiểm sát", "lệnh bắt", "rửa tiền", "tạm giam", "phạt nguội", "phong tỏa tài khoản"]:
                if phrase in text_lower:
                    dangerous_phrases.append(phrase)

        # 2. Tuyển CTV việc nhẹ lương cao / làm nhiệm vụ nạp tiền
        job_keywords = [
            "việc nhẹ",
            "lương cao",
            "hoa hồng",
            "ctv",
            "cộng tác viên",
            "chốt đơn",
            "nạp tiền nhận hoa hồng",
            "làm nhiệm vụ",
            "shopee",
            "lazada",
            "viec nhe",
            "luong cao",
            "hoa hong",
            "chot don",
            "lam nhiem vu",
        ]
        if any(w in text_lower or w in text_no_accents for w in job_keywords):
            tactics.append("Dụ dỗ việc nhẹ lương cao / CTV nạp tiền ảo")
            for phrase in ["việc nhẹ lương cao", "hoa hồng", "chốt đơn", "cộng tác viên", "nhiệm vụ", "shopee"]:
                if phrase in text_lower:
                    dangerous_phrases.append(phrase)

        # 3. Lừa đảo trúng thưởng / Quà tri ân / Nạp tiền làm hồ sơ nhận xe
        gift_keywords = [
            "trúng thưởng",
            "trúng giải",
            "giải nhất",
            "giải đặc biệt",
            "tri ân",
            "quà tri ân",
            "nhận quà",
            "nhận xe",
            "honda sh",
            "sh 150",
            "làm hồ sơ",
            "hồ sơ nhận xe",
            "nạp",
            "phí nhận xe",
            "phí vận chuyển",
            "phí hồ sơ",
            "bấm vào link",
            "miễn phí",
            "trung thuong",
            "trung giai",
            "giai nhat",
            "tri an",
            "qua tri an",
            "nhan qua",
            "nhan xe",
            "lam ho so",
            "ho so nhan xe",
            "nap",
        ]
        if any(w in text_lower or w in text_no_accents for w in gift_keywords):
            tactics.append("Lừa đảo trúng thưởng / Quà tri ân mồi nạp phí")
            for phrase in ["trúng giải", "trúng thưởng", "giải nhất", "tri ân", "nhận xe", "honda sh", "làm hồ sơ", "nạp"]:
                if phrase in text_lower:
                    dangerous_phrases.append(phrase)

        # 4. Tai nạn / cấp cứu chuyển tiền viện phí gấp
        accident_keywords = [
            "tai nạn",
            "cấp cứu",
            "viện phí",
            "chuyển gấp",
            "bệnh viện",
            "mổ gấp",
            "nguy kịch",
            "tai nan",
            "cap cuu",
            "vien phi",
            "chuyen gap",
            "benh vien",
            "mo gap",
        ]
        if any(w in text_lower or w in text_no_accents for w in accident_keywords):
            tactics.append("Thao túng tâm lý khẩn cấp (tai nạn người thân)")
            for phrase in ["tai nạn", "cấp cứu", "viện phí", "chuyển gấp", "bệnh viện", "mổ ngay"]:
                if phrase in text_lower:
                    dangerous_phrases.append(phrase)

        # 5. Đòi mã OTP / khóa tài khoản / trừ tiền giả mạo ngân hàng
        otp_keywords = [
            "otp",
            "mã xác nhận",
            "mật khẩu",
            "số thẻ",
            "trừ tiền",
            "hủy giao dịch",
            "khóa tài khoản",
            "biến động số dư",
            "ma xac nhan",
            "mat khau",
            "tru tien",
            "huy giao dich",
            "khoa tai khoan",
        ]
        if any(w in text_lower or w in text_no_accents for w in otp_keywords):
            tactics.append("Đánh cắp thông tin bảo mật / Giả mạo tin nhắn ngân hàng")
            for phrase in ["otp", "mã xác nhận", "mật khẩu", "trừ tiền", "hủy giao dịch", "khóa tài khoản"]:
                if phrase in text_lower:
                    dangerous_phrases.append(phrase)

        # Quyết định điểm số và mức độ rủi ro
        if tactics:
            risk_score = 98 if len(tactics) >= 2 or "nạp" in text_lower or "công an" in text_lower else 92
            risk_level = RiskLevel.DANGEROUS
            reasoning = (
                f"CẢNH BÁO NGUY HIỂM: Phát hiện {len(tactics)} thủ đoạn lừa đảo tinh vi: {', '.join(tactics)}. "
                f"Kẻ xấu đang thao túng lòng tham hoặc tâm lý hoảng loạn để yêu cầu nạn nhân chuyển tiền hoặc nạp phí."
            )
            recommended_action = (
                "Tuyệt đối KHÔNG làm theo hướng dẫn, KHÔNG nạp tiền, KHÔNG chuyển khoản và KHÔNG cung cấp mã OTP. "
                "Hãy bấm nút 'Hỏi người thân (SOS)' hoặc liên hệ trực tiếp Tổng đài Công an Đồng Nai (0693.480.113) để được trợ giúp."
            )
        elif urls or phones:
            risk_score = 65
            risk_level = RiskLevel.SUSPICIOUS
            reasoning = "Nội dung chứa số điện thoại hoặc đường link lạ chưa qua kiểm duyệt, tiềm ẩn nguy cơ dẫn dụ vào bẫy lừa đảo."
            recommended_action = "Cẩn trọng không bấm vào link lạ. Kiểm chứng lại với người thân hoặc đơn vị chính thống."
        else:
            risk_score = 10
            risk_level = RiskLevel.SAFE
            reasoning = "Không phát hiện các dấu hiệu lừa đảo, đe dọa hay mồi chài tài chính điển hình."
            recommended_action = "Nội dung có vẻ an toàn. Vẫn luôn giữ cảnh giác trước bất kỳ yêu cầu chuyển tiền bất thường nào."

        return ScamAnalysisResult(
            risk_score=risk_score,
            risk_level=risk_level,
            tactics=tactics if tactics else ["Không phát hiện"],
            dangerous_phrases=list(dict.fromkeys(dangerous_phrases)),
            reasoning=reasoning,
            recommended_action=recommended_action,
            extracted_entities=ExtractedEntities(phones=phones, bank_accounts=bank_accounts, urls=urls),
        )
