from fastapi import APIRouter, Depends
from backend.ai.factory import get_ai_provider
from backend.ai.protocol import ScamAnalyzerProvider
from backend.schemas.analysis import AnalyzeMessageRequest, ScamAnalysisResult

router = APIRouter(prefix="/analyze", tags=["AI Analysis"])

@router.post("", response_model=ScamAnalysisResult)
async def analyze_message(
    payload: AnalyzeMessageRequest,
    ai_provider: ScamAnalyzerProvider = Depends(get_ai_provider)
) -> ScamAnalysisResult:
    """Phân tích nội dung tin nhắn lừa đảo thông qua AI Provider (Zero-Cost Abstraction)"""
    return await ai_provider.analyze(payload.message)
