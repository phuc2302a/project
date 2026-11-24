from typing import Protocol, runtime_checkable

from backend.schemas.analysis import ScamAnalysisResult


@runtime_checkable
class ScamAnalyzerProvider(Protocol):
    """Zero-Cost Abstraction Interface cho AI Phân tích Lừa đảo"""

    async def analyze(self, message: str) -> ScamAnalysisResult:
        """Phân tích nội dung tin nhắn và trả về kết quả cấu trúc chuẩn"""
        ...
