# MBK Pharmacy Management System

Hệ thống quản lý nhà thuốc toàn diện với Frontend (React + TypeScript) và Backend (FastAPI + MySQL).

## 📋 Tính Năng

### Frontend

- ✅ Quản lý Sản phẩm (Products & Categories)
- ✅ Quản lý Đối tác (Khách hàng, Nhà cung cấp, Nhân viên)
- ✅ Quản lý Kho hàng (Warehouse & Stock Locations)
- ✅ Quản lý Đơn vị đo lường (UoM & Categories)
- ✅ Lịch sử giao dịch nhập/xuất
- ✅ Dashboard với thống kê
- ✅ Authentication & Authorization

### Backend API

- Users & Authentication (JWT)
- Products Management
- Partners Management
- Warehouse & Storage
- UoM Management
- Stock Picking & Inventory

## 🚀 Cài Đặt & Chạy

### Prerequisites

- Node.js (v16+)
- Python 3.8+
- XAMPP (MySQL)

### Backend Setup

1. **Cài XAMPP và import database:**

```bash
# Cài XAMPP 7.3.34
# Khởi động MySQL trong XAMPP Control Panel
# Import file: tourguide-booking-be/project/storage.sql vào phpMyAdmin
```

2. **Tạo môi trường ảo Python:**

```bash
cd tourguide-booking-be/project
python -m venv venv
```

3. **Kích hoạt môi trường:**

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Cài đặt dependencies:**

```bash
python -m pip install -r requirements.txt
```

5. **Cấu hình database (tùy chọn):**
   Tạo file `.env` trong thư mục `project`:

```env
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=storage
APP_DEBUG=True
```

6. **Chạy Backend:**

```bash
python -m uvicorn main:app --reload
```

Backend sẽ chạy tại: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Di chuyển vào thư mục frontend:**

```bash
cd mbk-pharmacy-management
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Cài thêm package còn thiếu:**

```bash
npm install @radix-ui/react-toast
```

4. **Chạy Frontend:**

```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:8080`

## 📁 Cấu Trúc Dự Án

### Frontend Structure

```
mbk-pharmacy-management/
├── src/
│   ├── components/
│   │   ├── atoms/          # UI components cơ bản
│   │   ├── molecules/      # Components phức tạp hơn
│   │   ├── organisms/      # Components lớn
│   │   └── templates/      # Layout templates
│   ├── pages/              # Các trang chính
│   │   ├── HomePage/
│   │   ├── LoginPage/
│   │   ├── ProductsPage/
│   │   ├── PartnersPage/
│   │   ├── WarehousePage/
│   │   └── InventoryManagementPage/
│   ├── services/           # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── partnerService.ts
│   │   ├── uomService.ts
│   │   └── storageService.ts
│   ├── types/              # TypeScript types
│   ├── redux/              # Redux store
│   ├── hooks/              # Custom hooks
│   └── Router.tsx
```

### Backend Structure

```
tourguide-booking-be/project/
├── controller/     # Business logic
├── crud/          # CRUD operations
├── db/            # Database models & connection
├── router/        # API routes
├── schemas/       # Pydantic schemas
├── setting/       # Configuration
└── main.py        # Entry point
```

## 🔑 API Endpoints

### Authentication

- `POST /users/login` - Đăng nhập
- `GET /users` - Danh sách users
- `POST /users/create` - Tạo user mới

### Products

- `GET /product/` - Danh sách sản phẩm
- `POST /product/` - Tạo sản phẩm
- `PUT /product/` - Cập nhật sản phẩm
- `DELETE /product/` - Xóa sản phẩm
- `GET /product/category` - Danh mục sản phẩm

### Partners

- `GET /partner` - Danh sách đối tác
- `POST /partner/` - Tạo đối tác
- `PUT /partner/` - Cập nhật đối tác
- `DELETE /partner/` - Xóa đối tác

### Storage

- `GET /storage/warehouse` - Danh sách kho
- `GET /storage/location` - Vị trí kho
- `GET /storage/picking` - Phiếu xuất/nhập

### UoM

- `GET /uom` - Đơn vị đo
- `GET /uom/category` - Danh mục đơn vị

## 🎨 Tech Stack

### Frontend

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - UI Components
- **Axios** - HTTP Client
- **Webpack** - Bundler

### Backend

- **FastAPI** - Web Framework
- **SQLAlchemy** - ORM
- **MySQL** - Database
- **Pydantic** - Data Validation
- **JWT** - Authentication
- **Bcrypt** - Password Hashing

## 🔐 Authentication

Hệ thống sử dụng JWT tokens để xác thực. Token được lưu trong localStorage và tự động gửi kèm mọi request.

```typescript
// Auto-attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📝 Các Trang Đã Hoàn Thành

1. **Login Page** - Đăng nhập với username/password
2. **Dashboard** - Tổng quan thống kê
3. **Products Page** - CRUD sản phẩm và danh mục
4. **Partners Page** - Quản lý khách hàng, nhà cung cấp, nhân viên
5. **Inventory Page** - Lịch sử giao dịch nhập/xuất

## 🛠️ Development

### Thêm Page Mới

1. Tạo folder trong `src/pages/NewPage/`
2. Tạo component `NewPage.tsx`
3. Tạo custom hook `useNewPage.ts`
4. Thêm route vào `Router.tsx`
5. Thêm menu item vào `MainLayout.tsx`

### Thêm API Service

1. Tạo service file trong `src/services/`
2. Import types từ `@/types`
3. Sử dụng instance `api` từ `api.ts`

## 🐛 Troubleshooting

### Backend không kết nối được database

```bash
# Kiểm tra MySQL đã chạy chưa
# Kiểm tra file .env hoặc setting/config.py
# Import lại file storage.sql
```

### Frontend không gọi được API

```bash
# Kiểm tra backend đã chạy chưa (port 8000)
# Kiểm tra CORS settings trong backend
# Xem console browser để debug
```

### Lỗi TypeScript

```bash
# Cài đặt types còn thiếu
npm install @types/node @types/react @types/react-dom
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Development Team - MBK Pharmacy

---

**Note:** Đây là phiên bản đầu tiên của hệ thống. Các tính năng nâng cao như Purchase Order, Sale Order, Stock Inventory sẽ được phát triển trong các phiên bản tiếp theo.
