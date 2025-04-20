# 🧠 English Learning AI

Hệ thống học tiếng Anh thông minh từ video/audio 🎧  
Tự động tách transcript, dịch, phân tích ngữ pháp, tạo flashcard và quiz — tất cả trong một!

## 🚀 Tính năng

- 🎧 Upload audio/video → Tự động tách transcript bằng [Whisper](https://github.com/openai/whisper)
- 📘 Dịch từng câu tiếng Anh sang tiếng Việt
- 🧠 Tạo Flashcard từ từ vựng trong transcript
- 🎯 Quiz học từ: chọn nghĩa đúng, điền chỗ trống, dịch câu
- 🔁 Lưu trạng thái học, không mất dữ liệu khi reload
- 📦 Docker + Docker Compose hỗ trợ chạy toàn hệ thống chỉ với 1 dòng lệnh

---

## 🧱 Kiến trúc hệ thống

| Service          | Mô tả                                   |
|------------------|-------------------------------------------|
| `client`         | Frontend React (Giao diện học tập)        |
| `server`         | Server Node.js nhận file và gửi về API    |
| `transformer`    | Dịch vụ xử lý Whisper + HuggingFace       |

---

## 🐳 Cách chạy bằng Docker

### ⚙️ 1. Clone repo

```bash
git https://github.com/congdev9x/english-learning-ai.git
cd english-learning-ai
```

### 🛠 2. Build & Run

```bash
docker-compose up --build
```

Dự án sẽ chạy 3 service:

- client tại: http://localhost:3000

- server-api: backend xử lý upload (http://localhost:5000)

- transformer-api: xử lý Whisper + dịch (http://localhost:8000)
