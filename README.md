# online-testing-frontend

## Giới thiệu
Hệ thống thi trắc nghiệm trực tuyến là một nền tảng giúp tổ chức các kỳ thi trực tuyến một cách dễ dàng, hiệu quả và bảo mật. Hệ thống hỗ trợ nhiều vai trò người dùng như thí sinh, giám thị, quản trị viên, và cán bộ phụ trách ca thi. Các tính năng chính bao gồm:
- Tạo và quản lý ngân hàng câu hỏi.
- Xây dựng và tổ chức kỳ thi với nhiều cấp độ khó khác nhau.
- Hỗ trợ nộp bài tự động và lưu bài thi theo từng câu để tránh mất dữ liệu.
- Chống gian lận bằng các biện pháp giám sát.
- Báo cáo kết quả và phân tích dữ liệu điểm thi

## Liên kết
- Frontend: [https://github.com/hoagn-vu/frontend_online_testing](https://github.com/hoagn-vu/frontend_online_testing)
- Backend: [https://github.com/hoagn-vu/backend_online_testing](https://github.com/hoagn-vu/backend_online_testing)
- Jira: https://hoangvu.atlassian.net/jira/software/projects/OT/boards/2
- SRS: [https://drive.google.com/file/d/18MgZO05q5spFkm1nl5XTzG44cIXQuw5z/view?usp=sharing](https://drive.google.com/file/d/18MgZO05q5spFkm1nl5XTzG44cIXQuw5z/view?usp=sharing)
- SDD: [https://drive.google.com/file/d/1b6FI4Wu5JBZITMxKBzFLI8gMC1p7lrrw/view?usp=sharing](https://drive.google.com/file/d/1b6FI4Wu5JBZITMxKBzFLI8gMC1p7lrrw/view?usp=sharing)

## Công nghệ sử dụng
- Backend:
  - Ngôn ngữ: C#
  - Framework: ASP.NET Core
  - Cơ sở dữ liệu: MongoDB
  - API giao tiếp: RESTful API với JSON
- Frontend:
  - Ngôn ngữ: JavaScript
  - Thư viện/UI Framework: React.js

## Cách cài đặt và chạy dự án
### 1. Clone repository
```sh
git clone https://github.com/hoagn-vu/online-testing-frontend/
cd online-testing-frontend
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

### 4. Kiểm thử và format code
```sh
npm run lint
npm run format
```

## Cấu trúc thư mục
```
📂 src
 ┣ 📂 assets
 ┣ 📂 components
 ┣ 📂 layouts
 ┣ 📂 pages
 ┣ 📜 App.js
 ┗ 📜 index.js
```

## Demo
https://drive.google.com/file/d/1WNnouc1jQmxVHd19lOZ6Xc050Nn423zP/view?usp=drive_link
