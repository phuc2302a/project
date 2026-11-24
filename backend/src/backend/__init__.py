import uvicorn

from backend.main import app

__all__ = ["app", "main"]


def main() -> None:
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
