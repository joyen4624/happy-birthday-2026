# 🎂 Hướng Dẫn Sử Dụng & Tùy Biến Thiệp Sinh Nhật

Thiệp slide sinh nhật được thiết kế theo phong cách **Instagram / Reels Story**, ưu tiên hiển thị hoàn hảo trên điện thoại di động (Mobile First), tone màu **Hồng pastel lãng mạn** ngọt ngào.

---

## 🚀 Cách mở thiệp xem ngay

1. Nhấp đúp vào file **[Mo_Thiep.bat](file:///d:/happy-bd/Mo_Thiep.bat)** hoặc mở trực tiếp **[index.html](file:///d:/happy-bd/index.html)** bằng bất kỳ trình duyệt nào (Chrome, Safari, Edge, Cốc Cốc).
2. Khi mở trên máy tính, thiệp sẽ tự động hiển thị trong **khung điện thoại iPhone sang trọng**. Khi mở trên điện thoại thật, thiệp sẽ tràn viền 100% màn hình cực đẹp.

---

## 💖 Các tính năng & trải nghiệm trong thiệp

1. **Màn hình chào (Intro Gate)**:
   - Hộp quà nhún nhảy kèm nút *"Chạm để mở thiệp 💌"*.
   - Chạm vào sẽ bắt đầu phát **nhạc nền du dương** (Web Audio API phong cách hộp âm nhạc Music Box) và bay hoa rơi/tim nhẹ nhàng.
2. **Slide 1 - Lời chào & Avatar**:
   - Ảnh đại diện có vòng hào quang lấp lánh và vương miện hoàng gia.
3. **Slide 2 - Kỷ niệm & 4 điều anh yêu ở em**:
   - Khung ảnh polaroid nghiêng vintage (chạm vào sẽ nổ tim bay).
   - 4 thẻ lý do yêu thương có thể chạm tương tác.
4. **Slide 3 - Bánh kem 3 tầng tương tác & Thổi nến 🕯️**:
   - Ngọn nến có ngọn lửa bập bùng chuyển động chân thực.
   - Khi bấm **"Thổi nến ngay 💨"** hoặc chạm trực tiếp vào cây nến: Ngọn lửa tắt, khói bốc lên, pháo hoa & hoa giấy confetti nổ tung rực rỡ kèm lời chúc ước nguyện thành hiện thực!
5. **Slide 4 - Hộp thư bí mật (Secret Love Letter) 💌**:
   - Bìa phong thư phong cách sáp niêm phong đỏ.
   - Bấm mở thư: Nắp phong bì mở ra, bức tâm thư tình cảm xuất hiện trang trọng với phông chữ lãng mạn.
6. **Slide 5 - Gửi tim & Nụ hôn 💋**:
   - Nút *"Thả ngàn trái tim 💕"* và *"Gửi nụ hôn ngọt ngào 💋"* bắn hiệu ứng bay rợp trời và rung phản hồi trên điện thoại.
   - Nút *"Xem lại từ đầu 🔄"*.

---

## ✏️ 2 Cách tùy biến thông tin thiệp

### Cách 1: Chỉnh sửa trực tiếp trên giao diện (Cực nhanh)
- Khi mở thiệp, ở góc trên bên phải có nút **✏️ (Cây bút)**.
- Bấm vào đó, một bảng chỉnh sửa hiện ra cho phép bạn đổi:
  - Tên / Biệt danh (ví dụ: *Bé Heo, Em Yêu, Mai Phương...*)
  - Họ và tên người yêu
  - Lời chúc mở đầu
  - Nội dung bức tâm thư
  - Ký tên người gửi
- Bấm **"Lưu thay đổi ✨"** là thiệp sẽ cập nhật ngay lập tức!

### Cách 2: Chỉnh sửa trong file cấu hình [config.js](file:///d:/happy-bd/config.js)
- Mở file [config.js](file:///d:/happy-bd/config.js) bằng trình soạn thảo bất kỳ để thay đổi mọi câu chữ, ngày sinh, lời chúc theo ý thích.

---

## 📸 Cách thay đổi ảnh thật của bạn & người yêu

1. **Ảnh đại diện của anh người yêu (Top)**:
   - Chuẩn bị 1 ảnh vuông thật đẹp hoặc ngầu của anh ấy, đặt tên là `avatar.jpg` và chép đè vào thư mục `assets/` (hoặc sửa đường dẫn trong [config.js](file:///d:/happy-bd/config.js)).
2. **Ảnh chụp chung kỷ niệm 6 năm**:
   - Chuẩn bị 1 bức ảnh chụp chung đôi của hai bạn, đặt tên là `memory.jpg` và chép đè vào thư mục `assets/`.

---

## 🎵 Thêm nhạc MP3 yêu thích (Tùy chọn)

- Mặc định thiệp đã tích hợp sẵn giai điệu **Happy Birthday Piano / Music Box du dương ngọt ngào** được tạo tự động bằng Web Audio API mà không cần tải file ngoài.
- Nếu bạn muốn dùng 1 bài hát cụ thể (ví dụ bài hát kỷ niệm của 2 bạn):
  - Chép file nhạc vào thư mục `assets/` và đổi tên thành `music.mp3`. Thiệp sẽ tự động ưu tiên phát file này!

---

## 📱 Cách gửi link thiệp qua điện thoại cho người yêu

- Bạn có thể đưa thư mục này lên các dịch vụ hosting miễn phí chỉ trong 1 phút như:
  - **Vercel** hoặc **Netlify Drop** (kéo thả toàn bộ thư mục `happy-bd` vào trang [netlify.com/drop](https://app.netlify.com/drop) là có ngay đường link web xịn sò).
  - Hoặc **GitHub Pages**.
- Sau đó gửi đường link qua Zalo / Messenger cho bạn gái, khi mở trên điện thoại sẽ có trải nghiệm trọn vẹn nhất!
