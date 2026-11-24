from functools import lru_cache
from backend.core.config import settings
from backend.ai.protocol import ScamAnalyzerProvider
from backend.ai.providers.mock import MockProvider

@lru_cache()
def get_ai_provider() -> ScamAnalyzerProvider:
    """Zero-Cost Factory: Khởi tạo đúng 1 Provider duy nhất dựa theo cấu hình .env"""
    provider_name = settings.AI_PROVIDER.lower().strip()

    if provider_name == "gemini":
        from backend.ai.providers.gemini import GeminiProvider
        return GeminiProvider()
    elif provider_name == "deepseek":
        from backend.ai.providers.deepseek import DeepSeekProvider
        return DeepSeekProvider()
    else:
        # Mặc định dùng MockProvider chạy offline an toàn cho phát triển & demo
        return MockProvider()
