# 🧪 Test Frontend HyPlanner Admin - Weddings

## 🚀 Cách chạy test

### 1. Khởi động Backend
```bash
cd HyPlannerAdminBE
npm start
# Server sẽ chạy trên http://localhost:5000
```

### 2. Khởi động Frontend
```bash
cd hyplanner-admin
npm run dev
# Frontend sẽ chạy trên http://localhost:5173
```

### 3. Truy cập Weddings page
- Mở browser: `http://localhost:5173`
- Login với admin account
- Navigate to Weddings page

## ✅ Features đã implement

### 📊 **Stats Cards (Real-time từ API)**
- **Tổng sự kiện**: Hiển thị từ `/api/weddings/stats`
- **Sự kiện tháng này**: Tự động tính theo tháng hiện tại
- **Đã hoàn thành**: Số lượng weddings có status = 'completed'
- **Tổng ngân sách**: Format theo VND currency

### 🔍 **Filters (Working)**
- **Status filter**: 
  - Tất cả trạng thái
  - Đang lên kế hoạch (planning)
  - Sắp diễn ra (upcoming)  
  - Đã hoàn thành (completed)
- **Month filter**:
  - Tất cả tháng
  - Tháng này / Tháng tới
  - Tháng 1-12 cụ thể
- **Search**: Tìm kiếm theo tên cặp đôi, địa điểm

### 📋 **Data Table**
- **Cặp đôi**: Tên chú rể & cô dâu + ngày cưới
- **Địa điểm**: Venue name
- **Ngân sách**: Format VND currency
- **Trạng thái**: Badge với màu sắc
- **Ngày tạo**: Format dd/mm/yyyy
- **Actions**: View, Edit, Delete

### 🗑️ **Delete Functionality**
- Confirm dialog trước khi xóa
- API call đến `/api/weddings/:id`
- Auto refresh data sau khi xóa
- Error handling

### 📄 **Pagination**
- Working với Redux state
- Sync với API calls
- Responsive navigation

### ⚡ **Redux State Management**
- **weddingsSlice**: Complete state management
- **Async thunks**: API calls với error handling
- **Selectors**: Clean data access
- **Loading states**: UI feedback

## 🔧 API Endpoints được sử dụng

```javascript
// Stats
GET /api/weddings/stats

// List với filters
GET /api/weddings?page=1&limit=10&status=planning&month=12&search=Nguyễn

// Delete
DELETE /api/weddings/:id
```

## 🎯 Test Cases

### ✅ **Load Data**
1. Page load → Stats cards hiển thị
2. Wedding list hiển thị với pagination
3. Loading states hoạt động

### ✅ **Filters**
1. Chọn status → API call với filter
2. Chọn month → API call với filter  
3. Type search → API call với search term
4. Multiple filters → Combined API call

### ✅ **Pagination**
1. Click page number → API call với page param
2. Page state sync với Redux

### ✅ **Delete**
1. Click delete → Confirm dialog
2. Confirm → API call + refresh data
3. Cancel → No action

### ✅ **Error Handling**
1. API error → Error message hiển thị
2. Retry button → Re-fetch data
3. Network error → User-friendly message

## 🎨 UI/UX Features

- **Loading indicators**: Skeleton/spinner states
- **Error messages**: User-friendly với retry option
- **Responsive design**: Mobile-friendly
- **Badge colors**: Status-based styling
- **Currency formatting**: VND format
- **Date formatting**: Vietnamese locale
- **Confirm dialogs**: Safe delete operations

## 🔄 Real-time Updates

- Stats refresh on page load
- Data refresh after delete
- Filter changes trigger immediate API calls
- Pagination maintains filter state

---

**🎉 Frontend đã hoàn toàn tích hợp với HyPlannerAdminBE API!**
