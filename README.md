# SG Home Vaseline

SG Home Vaseline là một dự án quản lý các chức năng và giao diện người dùng cho hệ thống quản lý chung cư. Dự án được xây dựng bằng **React** và **FastAPI**, mang đến trải nghiệm quản lý tiện lợi và hiệu quả cho người quản lý và nhân viên cũng như là hộ cư dân sử dụng.

## Author

* Nguyễn Tuấn Đạt - MSV 22024518
* Nguyễn Thị Thanh Lam - MSV 22024516
* Nguyễn Tuấn Hưng - MSV 22024519
* Lê Ngọc Quang - MSV 22024510

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Liên kết](#liên-kết)
- [Giấy phép](#giấy-phép)


## Giới thiệu

Dự án SG Home Vaseline cung cấp các tính năng quản lý tài khoản, nhiệm vụ và thông tin cư dân, dịch vụ trong môi trường chung cư. Các tính năng nổi bật bao gồm:
- Quản lý tài khoản nhân viên và hộ cư dân.
- Cập nhật và theo dõi các nhiệm vụ của nhân viên.
- Hệ thống giao diện người dùng thân thiện và dễ sử dụng.
- Và còn nhiều tính năng khác ...

## Yêu cầu hệ thống

- Node.js (Phiên bản 14 trở lên)
- React (Phiên bản 17 trở lên)
- Python (Phiên bản 10 trở lên)
- Postgres 16


## Cài đặt

### Cài đặt dự án từ GitHub

1. **Clone dự án về máy tính của bạn:**

   ```bash
   git clone https://github.com/datmieu204/sg-home-vaseline.git
   cd sg-home-vaseline
   ```
2. **Cài đặt các dependencies:**
- Database: Tạo database mới có tên pttk1 và import data từ foder database
- Frontend:
   ```bash
   cd frontend/apartment-management
   npm install
   ```
- Backend:
   ```bash
   cd backend
   python -m venv pttk
   pttk\Scripts\activate
   pip install -r requirements.txt
   ```
4. **Chạy ứng dụng trong môi trường phát triển:**
- Frontend:
   ```bash
   cd frontend/apartment-management
   npm start
   ```
- Backend:
    ```bash
   cd backend
   pttk\Scripts\activate
   uvicorn app.main:app --reload
   ```
- Ứng dụng sẽ chạy trên http://localhost:3000 (Giao diện frontend) và http://localhost:8000/docs (Giao diện backend).

## Cấu trúc dự án

  ```csharp
     SG-Home-Vaseline/
    │
    ├── README.md
    ├── backend/
    │   ├── .gitignore
    │   ├── README.md
    │   ├── requirements.txt
    │   └── app/
    │       ├── main.py
    │       ├── core/
    │       ├── models/
    │       ├── routers/
    │
    ├── database/
    │   ├── database_backup_0.sql
    │   ├── ...
    │   └── database_backup_9.sql
    │
    └── frontend/
        ├── package-lock.json
        └── apartment-management/
            ├── .gitignore
            ├── package.json
            ├── README.md
            ├── public/
            ├── src/
            └── ...
  ```

## Liên kết
GitHub: https://github.com/datmieu204/sg-home-vaseline

## Giấy phép
Dự án này được phát hành dưới giấy phép MIT License.

