# Vincent Trần · Grok Bot Personal Dashboard

Dashboard cá nhân dành cho Vincent Trần, được thiết kế theo đúng ngôn ngữ thiết kế của **Grok Bot** (từ case study *"Designing Grok Bot for a world of persistent agents"* của xAI / SpaceXSI - John Bai & Peng Zheng) và tối ưu để nhúng trực tiếp vào Notion qua `/embed`.

![Grok Bot Light Theme](https://img.shields.io/badge/Design-Grok%20Bot%20xAI-7c3aed)
![Notion Embed](https://img.shields.io/badge/Notion-Embed%20Ready-000000)
![Vanilla Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-10b981)

---

## ✨ Điểm nổi bật & Tính năng

1. **Ngôn ngữ thiết kế Grok Bot Light Theme:**
   - Khung cửa sổ macOS native (`rounded-2xl`, nút traffic lights đỏ/vàng/xanh, bóng đổ mềm).
   - Nền lụa thời gian sáng (Luminous Pearl/Platinum Silk Temporal Gradient).
   - Huy hiệu `GROK BOT ACTIVE` với chấm tím phát sáng (`#7c3aed`).
2. **Cấu trúc 3 cột đặc trưng (Three-Column Workspace):**
   - **Cột 1 (Bot Roster):** Mô hình hóa 6 mảng làm việc thành 6 Persistent Agents (*Thanh Long, SATORI, Agent-os, Edit, VLU, BUILD*) với Avatar 2.5D đa diện đầy màu sắc và đôi mắt chớp nháy (blinking animation).
   - **Cột 2 (Mission Timeline):** 
     - 3 thẻ telemetry (*STREAK, HOÀN THÀNH, QUÁ HẠN*).
     - Thẻ **LÀM NGAY** chuẩn Approval Card của Grok Bot với ưu tiên số 1 cho startup Thanh Long.
     - **3 Việc chính hôm nay** kèm hiệu ứng ăn mừng & cộng chuỗi Streak khi tick đủ.
     - **Tiến độ theo mảng (Chunky Progress Bars)** dày dặn, tương phản cao, phân cấp màu theo % (Xanh / Vàng / Cam / Đỏ).
     - **Bảng việc**: Xem dạng danh sách và cột Kanban, lọc nhanh theo mảng, độ ưu tiên, trễ hạn.
   - **Cột 3 (Bot Screen Preview & Routines):**
     - Widget mini `VINCENT BOT RUNTIME` theo dõi trạng thái.
     - Danh sách môn học VLU và mốc nộp bài.
     - Thói quen tập Gym theo tuần (Chủ Nhật → Thứ 7).
     - Ghi chú nhanh (tích hợp cảnh báo an toàn bảo mật).
3. **Kỹ thuật & Độ tương thích:**
   - 100% Vanilla HTML + CSS + JS thuần, 0 dependencies, chạy ngay khi mở file.
   - Lưu trữ an toàn trong `localStorage` (có try/catch và bộ nhớ đệm dự phòng).
   - Nút Xuất / Nhập JSON để sao lưu và chuyển thiết bị.
   - Hoàn toàn tương thích iframe `/embed` của Notion (co giãn từ 400px đến 1400px không cuộn ngang).

---

## 🚀 Cách nhúng vào Notion qua GitHub Pages

1. Vào repository trên GitHub > **Settings** > **Pages**.
2. Tại mục **Branch**, chọn `main` (hoặc `master`) và bấm **Save**.
3. Sau 1 phút, GitHub sẽ tạo link web dạng:
   ```
   https://<username>.github.io/<repo-name>/
   ```
4. Mở trang Notion, gõ `/embed` rồi dán đường link trên vào là xong!
