# HyPlanner Admin Dashboard

Trang quản trị viên cho hệ thống HyPlanner - ứng dụng lập kế hoạch đám cưới.

## Tính năng

### ✅ Đã hoàn thành
- **Authentication System**: Đăng nhập admin với JWT
- **Dashboard**: Tổng quan với thống kê, biểu đồ và hoạt động gần đây
- **User Management**: Quản lý người dùng với filters, search và pagination
- **Wedding Events**: Quản lý sự kiện cưới của các cặp đôi
- **Templates**: Quản lý mẫu thiệp cưới với grid/list view
- **Responsive Design**: Tương thích mobile và tablet

### 🚧 Đang phát triển
- **Payment Management**: Quản lý giao dịch thanh toán
- **Analytics**: Báo cáo và thống kê chi tiết
- **Settings**: Cài đặt hệ thống
- **API Integration**: Tích hợp với backend APIs

## Công nghệ sử dụng

- **Frontend**: React 18 + JavaScript (JSX)
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Charts**: Chart.js + React-Chartjs-2
- **HTTP Client**: Axios
- **Icons**: Font Awesome
- **Styling**: CSS3 với CSS Modules

## Cài đặt và chạy

### Prerequisites
- Node.js >= 16
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd hyplanner-admin

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

### Cấu hình
Tạo file `.env` trong thư mục root:
```env
VITE_API_BASE_URL=https://hyplanner-be.vercel.app
```

## Cấu trúc dự án

```
hyplanner-admin/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Layout/        # Layout components (Sidebar, Header)
│   │   ├── UI/            # UI components (DataTable, Charts, etc.)
│   │   └── Forms/         # Form components
│   ├── pages/             # Page components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Dashboard/     # Dashboard page
│   │   ├── Users/         # User management
│   │   ├── Weddings/      # Wedding events management
│   │   ├── Templates/     # Template management
│   │   ├── Payments/      # Payment management
│   │   ├── Analytics/     # Analytics & reports
│   │   └── Settings/      # System settings
│   ├── store/             # Redux store
│   │   ├── slices/        # Redux slices
│   │   └── store.js       # Store configuration
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS files
│   └── config/            # Configuration files
├── package.json
└── vite.config.js
```

## API Endpoints

### Authentication
- `POST /auth/admin-login` - Admin login
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Get admin profile

### Users
- `GET /users` - Get users list
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/charts` - Get chart data
- `GET /dashboard/activities` - Get recent activities

### Wedding Events
- `GET /weddingEvents` - Get wedding events
- `GET /weddingEvents/:id` - Get event details
- `PUT /weddingEvents/:id` - Update event
- `DELETE /weddingEvents/:id` - Delete event

### Templates
- `GET /templates` - Get templates
- `POST /templates` - Create template
- `PUT /templates/:id` - Update template
- `DELETE /templates/:id` - Delete template

## Tính năng chính

### 1. Dashboard
- Thống kê tổng quan (downloads, registrations, VIP users, cancellations)
- Biểu đồ người dùng mới theo tháng (Line Chart)
- Biểu đồ doanh thu theo gói (Doughnut Chart)
- Danh sách hoạt động gần đây

### 2. User Management
- Danh sách người dùng với avatar, email, gói, trạng thái
- Filters: trạng thái (Hoạt động/Tạm khóa), gói (FREE/VIP)
- Search theo tên, email
- Pagination
- Actions: Edit, Delete user

### 3. Wedding Events
- Danh sách sự kiện cưới
- Thông tin: tên cặp đôi, ngày cưới, địa điểm, ngân sách
- Trạng thái: Đang lên kế hoạch, Sắp diễn ra, Đã hoàn thành
- Stats cards với tổng quan sự kiện

### 4. Templates
- Grid/List view cho mẫu thiệp
- Template info: tên, loại (FREE/VIP), lượt sử dụng
- Hover overlay với actions (Edit, Delete, Preview)
- Filters theo loại, danh mục, trạng thái

### 5. Authentication
- Login form với email/password
- JWT token management
- Protected routes
- Auto redirect khi unauthorized

## Responsive Design

- **Desktop**: Full sidebar với tất cả features
- **Tablet**: Sidebar collapse, search ẩn
- **Mobile**: Mobile menu overlay, compact UI
- **Touch-friendly**: Buttons và interactions tối ưu cho touch

## Browser Support

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Contact

- **Developer**: HyPlanner Team
- **Email**: support@hyplanner.com
- **Website**: https://hyplanner.com
