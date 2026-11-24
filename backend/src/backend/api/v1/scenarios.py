import json

from fastapi import APIRouter, Query

from backend.core.config import DATA_DIR
from backend.schemas.stats import ScenarioItem

router = APIRouter(prefix="/scenarios", tags=["01-Minute Lessons & Quiz"])

DATA_PATH = DATA_DIR / "sample_scenarios.json"


@router.get("", response_model=list[ScenarioItem])
def get_scenarios(
    audience: str | None = Query(None, description="Lọc theo đối tượng: elderly, student, general"),
) -> list[ScenarioItem]:
    """Lấy danh sách 10 tình huống lừa đảo phổ biến để học kỹ năng 01 phút"""
    if not DATA_PATH.exists():
        return []

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    if audience and audience != "all":
        items = [i for i in items if i.get("target_audience") == audience or i.get("target_audience") == "general"]

    return [ScenarioItem(**i) for i in items]
