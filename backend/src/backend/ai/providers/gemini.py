from google import genai
from google.genai import types

from backend.core.config import settings
from backend.schemas.analysis import ScamAnalysisResult

SYSTEM_INSTRUCTION = """
Bạn là chuyên gia phân tích an toàn thông tin chuyên phát hiện lừa đảo trực tuyến (Lá Chắn Số).
Nhiệm vụ của bạn là phân tích đoạn tin nhắn do người dùng cung cấp và trả về kết quả JSON theo đúng schema:
- risk_score: số nguyên từ 0 đến 100
- risk_level: SAFE (0-39), SUSPICIOUS (40-69), DANGEROUS (70-100)
- tactics: danh sách các thủ đoạn nhận diện được (ví dụ: 'Giả danh cơ quan công an', 'Tuyển CTV việc nhẹ lương cao'...)
- dangerous_phrases: danh sách cụ thể các từ/cụm từ trong tin nhắn mang tính thao túng hoặc nguy hiểm (để tô đỏ trên giao diện)
- reasoning: giải thích ngắn gọn, dễ hiểu cho người cao tuổi và học sinh
- recommended_action: lời khuyên hành động tức thì, dứt khoát
- extracted_entities: { phones: [], bank_accounts: [], urls: [] } trích xuất từ tin nhắn
"""


class GeminiProvider:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured.")
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def analyze(self, message: str) -> ScamAnalysisResult:
        prompt = f"Hãy phân tích đoạn tin nhắn sau đây:\n\n---\n{message}\n---"
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=ScamAnalysisResult,
                temperature=0.2,
            ),
        )
        return ScamAnalysisResult.model_validate_json(response.text or "{}")
