from openai import OpenAI
from backend.core.config import settings
from backend.schemas.analysis import ScamAnalysisResult

SYSTEM_INSTRUCTION = """
Bạn là chuyên gia phân tích an toàn thông tin chuyên phát hiện lừa đảo trực tuyến (Lá Chắn Số).
Phân tích tin nhắn và trả về kết quả JSON chuẩn xác với cấu trúc:
{
  "risk_score": int (0-100),
  "risk_level": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "tactics": [string],
  "dangerous_phrases": [string],
  "reasoning": string,
  "recommended_action": string,
  "extracted_entities": { "phones": [], "bank_accounts": [], "urls": [] }
}
"""

class DeepSeekProvider:
    def __init__(self):
        if not settings.DEEPSEEK_API_KEY:
            raise ValueError("DEEPSEEK_API_KEY is not configured.")
        self.client = OpenAI(
            api_key=settings.DEEPSEEK_API_KEY,
            base_url=settings.DEEPSEEK_BASE_URL
        )

    async def analyze(self, message: str) -> ScamAnalysisResult:
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": f"Phân tích tin nhắn sau:\n{message}"}
            ],
            temperature=0.2
        )
        content = response.choices[0].message.content or "{}"
        return ScamAnalysisResult.model_validate_json(content)
