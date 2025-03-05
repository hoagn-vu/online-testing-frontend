# Online Testing - Frontend

## Giới thiệu
Hệ thống thi trắc nghiệm trực tuyến là một nền tảng giúp tổ chức các kỳ thi trực tuyến một cách dễ dàng, hiệu quả và bảo mật. Hệ thống hỗ trợ nhiều vai trò người dùng như thí sinh, giám thị, quản trị viên, và cán bộ phụ trách ca thi. Các tính năng chính bao gồm:
- Tạo và quản lý ngân hàng câu hỏi.
- Xây dựng và tổ chức kỳ thi với nhiều cấp độ khó khác nhau.
- Hỗ trợ nộp bài tự động và lưu bài thi theo từng câu để tránh mất dữ liệu.
- Chống gian lận bằng các biện pháp giám sát.
- Báo cáo kết quả và phân tích dữ liệu điểm thi

## Đường dẫn
- Frontend: [https://github.com/hoagn-vu/frontend_online_testing](https://github.com/hoagn-vu/frontend_online_testing)
- Backend: [https://github.com/hoagn-vu/backend_online_testing](https://github.com/hoagn-vu/backend_online_testing)

## Công nghệ sử dụng
- Backend:
  - Ngôn ngữ: C#
  - Framework: ASP.NET Core
  - Cơ sở dữ liệu: MongoDB
  - API giao tiếp: RESTful API với JSON
- Frontend:
  - Ngôn ngữ: JavaScript, TypeScript
  - Thư viện/UI Framework: React.js

## Cách cài đặt và chạy dự án
### 1. Clone repository
```sh
git clone https://github.com/hoagn-vu/frontend_online_testing
cd online-quiz-frontend
```

### 2. Cài đặt dependencies
```sh
npm install
```

### 3. Chạy ứng dụng
```sh
npm start
```
Ứng dụng sẽ chạy tại `http://localhost:3000/`.

## Cấu trúc thư mục
```
📂 src
 ┣ 📂 components       # Các component dùng chung
 ┣ 📂 pages            # Các trang chính của ứng dụng
 ┣ 📂 redux            # Quản lý state với Redux Toolkit
 ┣ 📂 services         # Các service gọi API
 ┣ 📜 App.js           # Thành phần chính của ứng dụng
 ┗ 📜 index.js         # Điểm vào chính
```

## Đóng góp

## Liên hệ

