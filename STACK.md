# TECH STACK ARCHITECTURE: LÁ CHẮN SỐ
> **Dự án:** Lá Chắn Số – Hackathon Đồng Nai 2026  
> **Nguyên tắc cốt lõi:** Nhẹ, tốc độ phát triển nhanh, Zero-Cost AI Abstraction, PWA hỗ trợ người cao tuổi & offline.

---

## 1. Tổng quan Kiến trúc Hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (PWA)                          │
│  React (Vite) + Tailwind CSS + Lucide Icons + Web Speech    │
│  - Chế độ Chuẩn (Học sinh/Tình nguyện viên)                 │
│  - Chế độ Người cao tuổi (Big UI, Chữ to, Nút lớn)          │
│  - Offline Cache (Service Worker / IndexedDB)               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON API
┌──────────────────────────────▼──────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│  FastAPI + Pydantic v2 + SQLAlchemy (SQLite)                │
│  ├── Unified Verification Router (SĐT / STK / URL)          │
│  ├── Link Phishing Detector (Levenshtein + tldextract)      │
│  ├── Report Moderation & PDF Export (ReportLab)             │
│  └── AI Service (Zero-Cost Abstraction Layer)               │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [GeminiProvider]                      [DeepSeekProvider]
(google-genai SDK)                     (openai-compatible SDK)
            │                                     │
            └───────────────┬─────────────────────┘
                            ▼
               LLM Cloud Service / Local
```

---

## 2. Thiết kế Zero-Cost Abstraction cho AI Engine

Để linh hoạt chuyển đổi mô hình (Gemini, DeepSeek, OpenAI, Groq, hoặc Ollama) chỉ bằng cấu hình biến môi trường (`.env`), tầng AI được thiết kế theo mô hình **Protocol + Factory Pattern**:

### a. Protocol / Interface chuẩn (`ScamAnalyzerInterface`)
```python
from typing import Protocol
from pydantic import BaseModel

class ScamAnalysisResult(BaseModel):
    risk_score: int                 # 0 - 100
    risk_level: str                 # SAFE | SUSPICIOUS | DANGEROUS
    tactics: list[str]              # ['giả danh công an', 'tạo áp lực thời gian', ...]
    reasoning: str                  # Lời giải thích ngắn gọn, dễ hiểu
    recommended_action: str         # Lời khuyên hành động tức thì
    extracted_entities: dict        # {'phones': [], 'bank_accounts': [], 'urls': []}

class ScamAnalyzerProvider(Protocol):
    async def analyze(self, content: str) -> ScamAnalysisResult:
        ...
```

### b. Implementations
1. **`GeminiProvider`:** Sử dụng SDK `google-genai` (Gemini 2.5 Flash), tận dụng Structured Outputs (JSON Schema) siêu nhanh.
2. **`DeepSeekProvider`:** Sử dụng thư viện `openai` trỏ đến `https://api.deepseek.com` với `model="deepseek-chat"`.
3. **`MockProvider`:** Dùng cho phát triển cục bộ và test tự động không cần kết nối internet hay tiêu tốn API key.

### c. Zero-Cost Switch via Config
Trong file `.env`:
```ini
AI_PROVIDER=gemini        # Hoặc: deepseek, openai, mock
GEMINI_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
```
Thông qua Dependency Injection của FastAPI (`Depends(get_ai_provider)`), Factory chỉ khởi tạo duy nhất Provider được chọn khi ứng dụng khởi động mà không tạo ra bất kỳ độ trễ runtime nào.

---

## 3. Chi tiết Tech Stack & Giải thích Thư viện

### A. Frontend (Client / PWA)
| Công nghệ / Thư viện | Vai trò | Giải thích ngắn |
| :--- | :--- | :--- |
| **Vite + React (TypeScript)** | Single Page Application | Thời gian khởi động và build siêu nhanh; cấu hình gọn nhẹ, ít rủi ro lỗi môi trường hơn so với Next.js trong thời gian thi Hackathon. |
| **Tailwind CSS** | Styling | Xây dựng giao diện responsive mobile-first nhanh chóng; hỗ trợ tạo theme cho Chế độ Người cao tuổi (chữ to `text-2xl`, nút bấm kích thước lớn, tương phản cao) chỉ bằng class CSS. |
| **Lucide React** | Icon Pack | Bộ icon hiện đại, nhẹ, trực quan cho các biểu tượng đèn cảnh báo, số điện thoại, ngân hàng, nút SOS. |
| **vite-plugin-pwa** | PWA & Offline Support | Biến web app thành ứng dụng có thể cài đặt về màn hình chính điện thoại; cache dữ liệu hotline và cẩm nang offline. |
| **Web Speech API (Trình duyệt)** | Speech Synthesis (TTS) | Tận dụng giọng đọc tiếng Việt tích hợp sẵn trên trình duyệt (Android, iOS, Chrome) để đọc to cảnh báo cho người lớn tuổi, không cần backend voice riêng. |

### B. Backend (API & Nghiệp vụ)
| Công nghệ / Thư viện | Vai trò | Giải thích ngắn |
| :--- | :--- | :--- |
| **FastAPI** | REST API Framework | Framework Python hiệu năng cao, hỗ trợ bất đồng bộ (`async`), tự động sinh tài liệu OpenAPI/Swagger để kiểm thử API ngay tức thì. |
| **Pydantic v2** | Data Validation | Xác thực dữ liệu đầu vào (SĐT, số tài khoản, link URL) và định dạng kết quả trả về từ AI một cách chặt chẽ. |
| **tldextract** | Domain Parsing | Bóc tách chính xác tên miền gốc, subdomain và phần mở rộng (TLD) của đường dẫn cần kiểm tra. |
| **python-Levenshtein** | Typosquatting Detection | Tính khoảng cách sai biệt ký tự tên miền để phát hiện ngay các chiêu trò mạo danh tên miền ngân hàng/cơ quan nhà nước mà không cần gọi đến AI. |
| **ReportLab** | PDF Generation | Sinh file PDF biên bản báo cáo gửi Công an tự động, định dạng văn bản chuẩn chỉnh kèm bằng chứng và kết quả phân tích. |
| **SQLite + SQLAlchemy** | Database & ORM | Cơ sở dữ liệu file cục bộ, không cần cài đặt máy chủ riêng; dễ dàng nạp dữ liệu mẫu (10 kịch bản và 120 lượt báo cáo) và demo trực tiếp. |
