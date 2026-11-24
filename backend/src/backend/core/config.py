from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Đường dẫn tuyệt đối đến thư mục gốc của backend và thư mục data
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "Lá Chắn Số - Backend API"
    VERSION: str = "1.0.0"

    # AI Configuration (mock | gemini | deepseek)
    AI_PROVIDER: str = "mock"
    GEMINI_API_KEY: str = ""
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"

    # Database
    DATABASE_URL: str = "sqlite:///./data/app.db"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
