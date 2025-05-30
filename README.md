# WebRTC Media Stream Negotiation

![WebRTC Media Negotiation Overview](./image.png)

WebRTC (Web Real-Time Communication) là một công nghệ mạnh mẽ cho phép truyền thông trực tiếp giữa các trình duyệt mà không cần máy chủ trung gian. Dưới đây là các bước chính trong quá trình thiết lập kết nối truyền thông hai chiều bằng WebRTC.

---

## 1. Media Stream Negotiation

WebRTC bắt đầu bằng việc đàm phán các luồng media giữa hai thiết bị. Phương thức `addTrack()` được sử dụng để thêm các track âm thanh và video từ stream cục bộ vào kết nối ngang hàng (`RTCPeerConnection`). Những track này sẽ được đàm phán trong quá trình trao đổi offer/answer nhằm xác định định dạng media chung giữa hai bên.

---

## 2. Establishing Bi-Directional Communication

Bằng việc thêm các track cục bộ vào kết nối, bạn kích hoạt khả năng giao tiếp hai chiều:

* **Gửi:** Track âm thanh và video của bạn được gửi đến peer từ xa.
* **Nhận:** Các track của peer từ xa sẽ được nhận và phát lại trên thiết bị của bạn.

---

## 3. Codec Negotiation

Việc thêm track sẽ kích hoạt quá trình đàm phán codec giữa hai peer. WebRTC chọn codec tối ưu dựa trên khả năng thiết bị và điều kiện mạng nhằm đảm bảo chất lượng âm thanh và hình ảnh tốt nhất.

---

## 4. ICE Candidate Exchange

Khi thêm track vào kết nối, WebRTC bắt đầu thu thập và trao đổi các ICE (Interactive Connectivity Establishment) candidates:

* **Mục đích:** Hỗ trợ xuyên NAT/firewall.
* **Lợi ích:** Thiết lập kết nối peer-to-peer trực tiếp, ngay cả khi các thiết bị nằm sau NAT.

---

## 5. Signaling

Sau khi các track được thêm vào, mô tả kết nối cục bộ (`localDescription`) sẽ được cập nhật bao gồm thông tin về media stream và ICE candidates. Thông tin này được gửi tới peer từ xa thông qua **kênh signaling**, phục vụ cho quá trình đàm phán.

---

## 🚀 Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu

* [Node.js](https://nodejs.org/) (phiên bản 14 trở lên)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Cài đặt

```bash
git clone https://github.com/Trunks-Pham/WebRTC_Media-Stream-Negotiation.git
cd WebRTC_Media-Stream-Negotiation
yarn install
```

### Chạy ứng dụng

```bash
yarn start
```

Mở trình duyệt và truy cập `http://localhost:3000` để sử dụng ứng dụng.

---

## 📁 Cấu trúc thư mục

* `app/`: Mã nguồn phía client.
* `public/`: Tệp tĩnh như HTML, CSS, hình ảnh.
* `server.js`: Tệp khởi động server Node.js.
* `WebRTC.jpg`: Hình ảnh minh họa quy trình WebRTC.

---

## 🌐 Cấu hình proxy và HTTPS (nếu cần)

### Cấu hình proxy cho Node.js

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

### Cấu hình proxy cho Yarn

```bash
yarn config set proxy http://proxy.example.com:8080
yarn config set https-proxy http://proxy.example.com:8080
```

### Chạy ứng dụng với HTTPS

Nếu bạn cần chạy ứng dụng trên HTTPS, hãy tạo chứng chỉ SSL và cấu hình server để sử dụng HTTPS. Bạn có thể sử dụng [Let's Encrypt](https://letsencrypt.org/) để tạo chứng chỉ miễn phí.

---