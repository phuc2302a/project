# DANH SÁCH TÍNH NĂNG CHỐT — WEBSITE LÁ CHẮN SỐ
> **Hội thi:** Hackathon Đồng Nai 2026  
> **Chủ đề:** Đề 4 – Lá Chắn Số (An toàn thông tin – phòng, chống lừa đảo – kỹ năng số)  
> **Mục tiêu:** Nền tảng web/PWA hỗ trợ kiểm tra nhanh, học kỹ năng nhận diện lừa đảo và kết nối hỗ trợ khẩn cấp cho người dân địa phương.

---

## I. 6 Tính năng / Màn hình bắt buộc (MVP)

### 1. Trang chủ — Kiểm tra nhanh
- Ô nhập liệu thông minh cho phép kiểm tra nhanh: **Số điện thoại**, **Đường dẫn (URL)** hoặc **Số tài khoản ngân hàng**.
- Hệ thống trả về kết quả đánh giá theo 3 mức màu trực quan:
  - 🟢 **An toàn (Xanh)**
  - 🟡 **Nghi ngờ (Vàng)**
  - 🔴 **Nguy hiểm (Đỏ)**
- Đi kèm lý do giải thích ngắn gọn, dễ hiểu và khuyến nghị hành động cụ thể.

### 2. Nút & Popup "Hỏi người thân"
- Đặt nút khẩn cấp cố định trên thanh điều hướng (**Navbar**) và ngay bên dưới khung kết quả cảnh báo.
- Khi người dùng bấm nút, hệ thống hiển thị popup cho phép gửi nhanh thông tin nghi ngờ (nội dung tin nhắn, số lạ, link giả mạo) cho người thân đã được chỉ định trước (thông qua Zalo, SMS hoặc gọi điện xác nhận nhanh).

### 3. Trang Báo cáo lừa đảo
- Biểu mẫu tinh gọn 3 bước để người dùng dễ dàng phản ánh vụ việc:
  - Chọn nhóm thủ đoạn lừa đảo.
  - Nhập thông tin đối tượng (SĐT / đường dẫn / số tài khoản).
  - Viết mô tả ngắn và tải lên ảnh chụp màn hình bằng chứng.

### 4. Trang Bài học ngắn 01 phút
- Giao diện lưới hiển thị các thẻ bài học ngắn đọc trong 01 phút dựa trên **10 tình huống lừa đảo phổ biến** (theo đề bài):
  1. Giả danh cơ quan công an yêu cầu chuyển tiền.
  2. Đường dẫn nhận quà tri ân / trúng thưởng giả mạo.
  3. Tuyển cộng tác viên đặt đơn Shopee / TikTok ("việc nhẹ lương cao").
  4. Người thân gặp tai nạn cần chuyển tiền gấp.
  5. Nạp thẻ game lậu / mua bán tài khoản giá rẻ.
  6. Khóa sim điện thoại / nợ cước viễn thông.
  7. Nâng cấp hạn mức thẻ tín dụng / vay online nhanh.
  8. Giả mạo tin nhắn thương hiệu (SMS Brandname) ngân hàng.
  9. Lừa đảo làm nhiệm vụ tài chính / đầu tư tiền ảo.
  10. Cài đặt file APK mã độc giả mạo cổng Dịch vụ công.
- Có bộ lọc đối tượng chuyên biệt: **Dành cho Người cao tuổi** và **Dành cho Học sinh THPT**.

### 5. Trang Bài kiểm tra nhận diện (Quiz)
- Bộ câu hỏi trắc nghiệm tương tác mô phỏng các tình huống lừa đảo thực tế đời sống.
- Cơ chế chấm điểm tổng kết, xếp loại mức độ an toàn số và hiển thị giải thích chi tiết cho từng câu trả lời.

### 6. Trang Dashboard Đội tình nguyện
- Giao diện chuyên trách hỗ trợ Đội thanh niên tình nguyện tuyên truyền tại xã, phường.
- Thống kê các kiểu lừa đảo mới phát sinh tại địa phương, tích hợp sẵn dữ liệu mẫu đề bài:
  - **120 lượt báo cáo trong tháng**.
  - **35% là đường dẫn giả mạo**.
- Biểu đồ phân bổ hình thức lừa đảo và danh sách tin báo mới nhất để hỗ trợ công tác phổ biến kiến thức an toàn số.

---

## II. 3 Tính năng Điểm cộng / Mở rộng

### 7. AI Phân tích nội dung tin nhắn
- Tích hợp thành 1 tab riêng biệt ngay trên **Trang chủ**.
- Cho phép người dùng dán toàn bộ đoạn tin nhắn chat/SMS bất kỳ.
- Trí tuệ nhân tạo (hỗ trợ tráo đổi linh hoạt qua Zero-Cost Abstraction) phân tích mức độ rủi ro, phân loại thủ đoạn thao túng tâm lý và tô đỏ/làm nổi bật các cụm từ nguy hiểm.

### 8. Chế độ Giọng nói & Chữ to cho Người cao tuổi
- Nút gạt chuyển đổi nhanh trên Navbar để kích hoạt **Giao diện Người cao tuổi**: Chữ cực to, độ tương phản cao, bố cục tối giản phục vụ người già 65 tuổi.
- Tích hợp nút **Micro** (nhập liệu nội dung bằng giọng nói qua Web Speech API) và nút **Loa** (đọc to kết quả kiểm tra, cảnh báo rủi ro và các bài học 01 phút).

### 9. Kết nối Kênh tiếp nhận tin báo của Công an
- Tích hợp tùy chọn nút gạt *"Gửi đồng thời đến kênh tiếp nhận tin báo của Công an"* ngay trong form của Trang Báo cáo lừa đảo.
- Tự động xuất thông báo xác nhận và cấp **Mã hồ sơ tiếp nhận** sau khi người dân gửi phản ánh thành công.

---

## III. Phạm vi cắt bỏ (Out of Scope - Tối ưu cho Hackathon)

- ❌ **Không làm:** Luồng Đăng ký, Đăng nhập, Quên mật khẩu hay quản lý hồ sơ cá nhân phức tạp.
- ❌ **Không làm:** Tính năng nhắn tin (Chat) trực tiếp trên website (nút "Hỏi người thân" chỉ kích hoạt mở popup chọn người thân và gửi nhanh qua Zalo/SMS hoặc kích hoạt cuộc gọi).
- ❌ **Không làm:** Chế độ tối (Dark Mode) và Đa ngôn ngữ (chỉ tập trung tối đa vào tiếng Việt và độ tương phản chuẩn cho người lớn tuổi).
