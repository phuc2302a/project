# 🛡️ LÁ CHẮN SỐ — NỀN TẢNG AN TOÀN THÔNG TIN & PHÒNG CHỐNG LỪA ĐẢO TRỰC TUYẾN

> **Hội thi / Giải đấu:** Hackathon Đồng Nai 2026  
> **Chủ đề dự thi:** Đề 4 – Lá Chắn Số (An toàn thông tin – phòng, chống lừa đảo – kỹ năng số)  
> **Đối tượng phục vụ trọng tâm:** 
> 1. Người cao tuổi 65 tuổi (nhận cuộc gọi lạ, tin nhắn đe dọa/công an).
> 2. Học sinh THPT (bẫy "việc nhẹ lương cao", nạp game lậu, quà tri ân).
> 3. Đội thanh niên tình nguyện tại xã, phường (công cụ tuyên truyền số).

---

## 📌 1. Giới thiệu Tổng quan

Tình trạng lừa đảo qua điện thoại, tin nhắn, đường link giả mạo và tài khoản mạo danh cơ quan công an, ngân hàng đang diễn biến ngày càng tinh vi và phức tạp. Người cao tuổi và học sinh là hai nhóm đối tượng dễ bị tổn thương nhất do thiếu thông tin hoặc tâm lý lo sợ/ham lợi nhuận.

**Lá Chắn Số** là giải pháp web/PWA đa nền tảng, cung cấp công cụ **kiểm tra nhanh trước khi chuyển tiền**, rèn luyện **kỹ năng nhận diện qua bài học 01 phút**, kết nối **khẩn cấp với người thân** và hỗ trợ **Đội tình nguyện viên địa phương** theo dõi các hình thức lừa đảo mới phát sinh.

---

## ✨ 2. Các Tính năng Nổi bật

### I. 6 Tính năng / Màn hình bắt buộc (MVP)
1. **Trang chủ — Kiểm tra nhanh:**
   - Ô tra cứu hợp nhất cho **Số điện thoại**, **Đường dẫn (URL)** hoặc **Số tài khoản ngân hàng**.
   - Trả về kết quả đánh giá theo hệ thống đèn giao thông trực quan:
     - 🟢 **An toàn (Xanh):** Tên miền chính thống của ngân hàng, cơ quan nhà nước (`.gov.vn`).
     - 🟡 **Nghi ngờ (Vàng):** Chưa có báo cáo nhưng cần cảnh giác khi yêu cầu chuyển tiền gấp.
     - 🔴 **Nguy hiểm (Đỏ):** Số nằm trong Blacklist, tên miền lừa đảo mạo danh (Typosquatting) hoặc đuôi tên miền rủi ro cao (`.xyz`, `.top`).
   - Đi kèm lý do giải thích dễ hiểu và khuyến nghị hành động cụ thể.

2. **Nút & Popup khẩn cấp "Hỏi người thân" (SOS):**
   - Đặt cố định trên thanh điều hướng (Navbar) và ngay bên dưới khung kết quả cảnh báo rủi ro.
   - Quản lý danh bạ người thân trong gia đình (con cái, người phụ trách).
   - 1 chạm gửi nhanh thông tin nghi ngờ qua **Zalo**, **SMS** (soạn sẵn nội dung) hoặc **Gọi điện thoại trực tiếp**.

3. **Trang Báo cáo lừa đảo:**
   - Biểu mẫu ngắn gọn 3 bước: Chọn thủ đoạn $\rightarrow$ Nhập đối tượng $\rightarrow$ Mô tả & đính kèm ảnh bằng chứng.
   - Tích hợp nút gạt **"Gửi đồng thời đến kênh tiếp nhận tin báo của Công an tỉnh Đồng Nai"**.
   - Tự động sinh và cấp **Mã số tiếp nhận hồ sơ điện tử** (ví dụ: `CA-ĐN-2026-XXXX`).

4. **Trang Bài học ngắn 01 phút:**
   - Hiển thị dạng lưới 10 tình huống lừa đảo phổ biến nhất (giả danh công an, việc nhẹ lương cao, quà tri ân, tai nạn cần tiền viện phí, nạp game lậu, mã độc APK...).
   - Bộ lọc đối tượng: *Tất cả*, *Người cao tuổi (65+)*, *Học sinh THPT*.
   - Tích hợp nút **Loa đọc to nội dung** bài học.

5. **Trang Trắc nghiệm nhận diện (Quiz):**
   - Bộ 5 câu hỏi tình huống đời sống thực tế.
   - Chấm điểm ngay, giải thích chi tiết cho từng câu trả lời và cấp xếp loại mức độ "An toàn số".

6. **Dashboard Đội tình nguyện:**
   - Giao diện thống kê phục vụ đội thanh niên tình nguyện tuyên truyền tại xã, phường.
   - Tích hợp đúng dữ liệu mẫu đề bài: **120 lượt báo cáo trong tháng**, **35% là đường dẫn giả mạo**.
   - Biểu đồ phân bổ tỷ lệ các kiểu lừa đảo và danh sách tin báo mới nhất.

---

### II. 3 Tính năng Điểm cộng / Mở rộng
7. **AI Phân tích tin nhắn dán vào (Smart Paste Analyzer):**
   - Tích hợp thành 1 tab riêng biệt ngay trên Trang chủ.
   - Dán đoạn tin nhắn SMS/chat; AI phân tích ngữ cảnh, tính điểm rủi ro (0-100%), nhận diện thủ đoạn thao túng tâm lý và **tô đỏ các cụm từ nguy hiểm** trên giao diện.
8. **Chế độ Giọng nói & Chữ to cho Người cao tuổi (Elder Mode 65+):**
   - Nút gạt chuyển đổi nhanh trên Navbar để phóng to toàn bộ font chữ (`text-2xl`), nút bấm kích thước lớn, độ tương phản cao.
   - Tích hợp nút **Micro** (nhập liệu bằng giọng nói tiếng Việt) và nút **Loa** (đọc to kết quả kiểm tra và bài học qua Web Speech API).
9. **Zero-Cost AI Provider Abstraction:**
   - Thiết kế theo mô hình Protocol + Factory Pattern: tráo đổi linh hoạt giữa **Mock** (chạy offline không tốn API key), **Gemini 2.5 Flash**, **DeepSeek**, hoặc OpenAI chỉ bằng 1 biến cấu hình trong `.env`.

---

## 🏗️ 3. Kiến trúc Kỹ thuật (Tech Stack)

```
hackathon-dongnai-2026/
├── backend/                       # API & AI Engine (FastAPI + uv)
│   ├── src/backend/
│   │   ├── ai/                    # Zero-Cost Abstraction (Protocol, Factory, Providers)
│   │   ├── api/v1/                # REST Routers (analyze, lookup, reports, stats, scenarios)
│   │   ├── core/                  # Config & SQLite Database
│   │   ├── models/                # SQLAlchemy Models (Blacklist, ScamReport)
│   │   ├── schemas/               # Pydantic v2 Models (Validation)
│   │   └── services/              # Link Typosquatting Checker (Levenshtein + tldextract)
│   ├── data/                      # 10 kịch bản mẫu, 120 báo cáo mẫu, danh bạ tên miền sạch
│   └── pyproject.toml             # Quản lý dependencies với uv
│
├── frontend/                      # Web Client & PWA (React + Vite + npm)
│   ├── src/
│   │   ├── components/            # Navbar, SOSModal, TrafficLightBadge...
│   │   ├── contexts/              # ElderModeContext (chế độ chữ to 65+)
│   │   ├── hooks/                 # useSpeech (Web Speech STT & TTS)
│   │   ├── pages/                 # CheckScreen, ReportScreen, EducationScreen, QuizScreen, VolunteerScreen
│   │   └── services/              # API Client
│   ├── vite.config.ts             # Tailwind v4, VitePWA, API Proxy
│   └── package.json
│
└── docker/                        # Cấu hình Docker & Nginx Reverse Proxy
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    ├── nginx.conf
    └── docker-compose.yml
```

| Thành phần | Công nghệ chính | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 | Build siêu tốc, responsive mobile-first, dễ cấu hình cỡ chữ lớn cho người già. |
| **PWA & Voice** | `vite-plugin-pwa`, Web Speech API | Cài đặt được về màn hình chính điện thoại, hỗ trợ đọc/nói tiếng Việt miễn phí 100%. |
| **Backend** | FastAPI, Python (Astral `uv`), Pydantic v2 | Hiệu năng cao, bất đồng bộ (`async`), tự sinh tài liệu Swagger UI. |
| **Phishing Engine**| `tldextract`, `python-Levenshtein` | So khớp tên miền giả mạo ngân hàng không tốn chi phí token AI. |
| **AI Engine** | Zero-Cost Abstraction (Mock, Gemini, DeepSeek) | Dễ dàng chuyển đổi mô hình chỉ qua cấu hình `.env`. |
| **Database** | SQLite + SQLAlchemy | Gọn nhẹ, sẵn sàng chạy ngay khi nộp bài thi mà không cần cấu hình server DB phức tạp. |

---

## 🚀 4. Hướng dẫn Cài đặt & Khởi chạy

### Cách 1: Khởi chạy bằng Docker (Khuyên dùng cho Ban Giám Khảo)

Yêu cầu đã cài đặt **Docker** và **Docker Compose**. Tại thư mục gốc của dự án, chạy lệnh:

```bash
docker compose up --build
```

Sau khi hoàn tất:
* **Giao diện Web (Frontend):** Truy cập `http://localhost` (Port 80)
* **Backend API Swagger Docs:** Truy cập `http://localhost:8000/docs`

---

### Cách 2: Khởi chạy thủ công trong môi trường Phát triển (Local Dev)

#### 1. Khởi chạy Backend (`backend/`):
Yêu cầu đã cài đặt [Astral uv](https://github.com/astral-sh/uv).

```bash
cd backend

# 1. Đồng bộ thư viện
uv sync

# 2. Tạo file cấu hình môi trường (mặc định dùng mock AI không cần key)
cp .env.example .env

# 3. Khởi động server FastAPI
uv run uvicorn backend.main:app --reload --port 8000
```
*API tài liệu Swagger sẽ sẵn sàng tại:* `http://localhost:8000/docs`

#### 2. Khởi chạy Frontend (`frontend/`):
Yêu cầu đã cài đặt **Node.js 20+** và **npm**. Mở một cửa sổ Terminal mới:

```bash
cd frontend

# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy server phát triển
npm run dev
```
*Ứng dụng sẽ mở tại:* `http://localhost:5173`

---

## 📡 5. Danh sách API Endpoints Chính

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra tình trạng server và AI Provider đang kích hoạt |
| `GET` | `/api/v1/lookup?q=...` | Kiểm tra nhanh SĐT, Link hoặc STK (trả về Xanh - Vàng - Đỏ) |
| `POST` | `/api/v1/analyze` | Dán tin nhắn để AI phân tích rủi ro và các cụm từ nguy hiểm |
| `POST` | `/api/v1/reports` | Gửi báo cáo lừa đảo (có tùy chọn gửi sang Công an cấp mã hồ sơ) |
| `GET` | `/api/v1/reports` | Lấy danh sách các tin báo lừa đảo gần đây |
| `GET` | `/api/v1/scenarios` | Lấy danh sách 10 bài học tình huống 01 phút (hỗ trợ lọc `audience`) |
| `GET` | `/api/v1/stats` | Dữ liệu thống kê cho Dashboard Đội tình nguyện (120 lượt báo cáo, 35% link giả) |

---

## ⚙️ 6. Cấu hình AI Provider (Zero-Cost Abstraction)

Trong file `backend/.env`:

```ini
# Chọn 1 trong 3: mock | gemini | deepseek
AI_PROVIDER=mock

# Nếu dùng Gemini (Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Nếu dùng DeepSeek
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

*Khi đặt `AI_PROVIDER=mock`, hệ thống sẽ sử dụng bộ phân tích từ khóa offline thông minh, phù hợp khi demo chấm thi mà không có kết nối Internet hoặc chưa có API Key.*

---

## 👥 7. Giấy phép & Tác giả

Dự án được xây dựng phục vụ Hội thi Tin học / Hackathon tỉnh Đồng Nai 2026.  
Mã nguồn mở theo giấy phép MIT.
