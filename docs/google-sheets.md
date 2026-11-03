# Nối trang cưới với Google Sheet

Một file Google Sheet chứa ba tab, trang cưới đọc ghi qua một Google Apps Script:

| Tab          | Ai ghi                    | Dùng để                                                          |
| ------------ | ------------------------- | ---------------------------------------------------------------- |
| **Khách mời** | Bạn tự nhập               | Trang dựng link mời riêng `/m/<mã>` cho từng dòng                 |
| **Hồi âm**    | Khách bấm "Gửi hồi âm"    | Có đến không, đến lễ nào; mỗi khách một dòng, sửa thì cập nhật    |
| **Lời chúc**  | Khách bấm "Gửi lời chúc"  | Mỗi lần gửi một dòng; chỉ lưu ở đây, không hiện lên trang         |

Các tab (cùng tab **Hướng dẫn** giải thích từng cột) tự được tạo ở lần đầu trang cưới gọi tới script, bạn không cần tạo tay.

## 1. Tạo sheet và dán script

1. Vào https://sheets.new tạo một Google Sheet mới, đặt tên tuỳ ý (vd "Đám cưới Trinh & Vinh").
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code mẫu trong `Code.gs`, dán toàn bộ nội dung file
   [`scripts/google-apps-script.gs`](../scripts/google-apps-script.gs), bấm **Lưu**.

## 2. Đặt khoá bí mật

Khoá này để chỉ trang cưới của bạn đọc ghi được sheet.

1. Tạo một chuỗi ngẫu nhiên dài, ví dụ chạy trong terminal:
   `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`
2. Trong Apps Script: **Project Settings** (bánh răng) → **Script properties** →
   **Add script property**: tên `SHEET_SECRET`, giá trị là chuỗi vừa tạo → **Save**.

## 3. Deploy thành Web app

1. **Deploy → New deployment** → bấm bánh răng chọn loại **Web app**.
2. **Execute as**: _Me_ (chính bạn). **Who has access**: _Anyone_.
   (Ai cũng gọi được địa chỉ này, nhưng không có khoá thì script từ chối.)
3. **Deploy**, cấp quyền khi Google hỏi (chọn tài khoản → Advanced → Go to … → Allow).
4. Chép **Web app URL** (dạng `https://script.google.com/macros/s/…/exec`).

Sửa script sau này thì phải **Deploy → Manage deployments → Edit → Version: New version**
thì bản mới mới chạy (URL giữ nguyên).

## 4. Đặt biến môi trường

Ở máy (`.env.local`) và trên Vercel (Settings → Environment Variables, chọn cả
Production và Preview), rồi Redeploy:

```
SHEET_SCRIPT_URL=https://script.google.com/macros/s/…/exec
SHEET_SECRET=<chuỗi ở bước 2>
# Không bắt buộc: hiện nút "Mở Google Sheet" trong /quan-ly
SHEET_URL=https://docs.google.com/spreadsheets/d/…/edit
```

Chạy trang ở máy (`npm run dev`) hoặc deploy một lần là tab **Khách mời** xuất hiện,
có sẵn tiêu đề cột và ô chọn.

Lưu ý: khi đã nối sheet, trang chỉ dùng khách trong sheet. Danh sách mẫu trong
`src/data/guests.ts` chỉ dùng khi chưa nối.

## Nhập khách mời

Mỗi khách (hoặc mỗi gia đình nhận chung một thiệp) một dòng. Giải thích từng cột có sẵn
ngay trong sheet: rê chuột (trên điện thoại là chạm) vào ô tiêu đề để xem ghi chú, hoặc
mở tab **Hướng dẫn**.

| Cột             | Ví dụ                      | Ghi chú                                                                   |
| --------------- | -------------------------- | ------------------------------------------------------------------------- |
| **Mã**          | _(tự điền)_                | Gõ tên xong là script tự điền mã ngẫu nhiên. Cột này khoá, không sửa tay. |
| **Tên gọi**     | Anh Tuấn                   | Kèm danh xưng, đúng như muốn hiện trên thiệp. Bắt buộc.                    |
| **Tự xưng**     | tụi em                     | Cô dâu chú rể xưng với khách: tụi em, tụi con, tụi cháu, tụi mình.         |
| **Trang trọng** | ☑                          | Tick cho người lớn: "trân trọng kính mời". Bỏ trống là thân mật.           |
| **Phía**        | Nhà trai                   | Nhà trai, Nhà gái hoặc Bạn bè.                                            |
| **Lễ**          | Lễ Tân Hôn                 | Chọn một lễ, hoặc "Cả hai" (bỏ trống cũng là cả hai).                     |
| **Đi cùng**     | người thương               | Ghép sau tên: "Anh Tuấn và người thương". Bỏ trống nếu mời một mình.       |
| **Lời nhắn**    | Nhớ dẫn chị Hằng theo nha! | Lời nhắn riêng hiện trong thiệp. Không bắt buộc.                          |

Cột **Mã** nằm trong link mời riêng của khách, nên đổi mã là link đã gửi không mở được
nữa. Vì vậy cột này tô xám, định sửa thì Sheets hỏi lại, và nếu vẫn sửa thì script trả lại
mã cũ. Xoá cả dòng khách thì Sheets cũng hỏi lại (link của khách đó sẽ thành 404).

- Trang tự đọc lại sheet sau khoảng 1 phút. Muốn thấy ngay (vd vừa thêm khách, sắp gửi
  link) thì vào `/quan-ly` bấm **Cập nhật danh sách**.
- Dòng nào nhập sai (thiếu tự xưng, phía lạ, trùng mã…), `/quan-ly` hiện cảnh báo
  "Dòng 5 (Anh Tuấn): …" để bạn sửa.
- Dán nhiều dòng một lúc mà chưa thấy mã thì bấm menu **Trang cưới → Tạo mã cho khách mới**
  (menu hiện sau khi tải lại sheet).
- Tab Khách mời: được chèn thêm cột hay đổi chỗ cột (script tìm cột theo tên tiêu đề ở
  dòng 1, không phân biệt dấu hay hoa thường), nhưng đừng đổi tên tiêu đề. Thiếu cột nào
  script tự thêm vào cuối; cột trùng tên mà trống thì script tự xoá.
- Ô chọn nằm sai cột, mất ghi chú hay mất khoá cột Mã thì bấm menu
  **Trang cưới → Cài lại tab Khách mời**. Lệnh này xoá mọi ô chọn trong tab rồi đặt lại cho
  Trang trọng, Phía, Lễ, gắn lại ghi chú và khoá cột Mã, viết lại tab Hướng dẫn.
- Tab Hồi âm và Lời chúc do trang cưới ghi: đừng đổi thứ tự cột (script đọc theo vị trí).

## Tuỳ chỉnh khác

- Hạn hồi âm: `rsvpBy` trong `src/config/wedding.ts`.
- Tên các lễ trong ô chọn cột "Lễ" lấy theo `events` trong `src/config/wedding.ts`.
