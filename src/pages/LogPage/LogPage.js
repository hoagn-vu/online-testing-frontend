import "./LogPage.css";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const dummyLogs = {
  "Thí sinh": [
    {
      id: 1,
      studentId: "BIT220079",
      lastname: "Nguyễn Thu",
      gender: "Nữ",
      dob: "01/01/2000",
    },
    {
      id: 2,
      studentId: "SV002",
      lastname: "Trần Thị",
      dob: "15/05/2001",
      gender: "Nữ",
    },
    {
      id: 3,
      studentId: "BIT220089",
      lastname: "Phan Thị Phương",
      dob: "01/01/2000",
      gender: "Nữ",
    },
    {
      id: 4,
      studentId: "SV002",
      lastname: "Trần Thị",
      dob: "15/05/2001",
      gender: "Nữ",
    },
    {
      id: 5,
      studentId: "BIT220089",
      lastname: "Phan Thị Phương",
      dob: "01/01/2000",
      gender: "Nữ",
    },
    {
      id: 6,
      studentId: "SV002",
      lastname: "Trần Thị",
      dob: "15/05/2001",
      gender: "Nữ",
    },
    {
      id: 7,
      studentId: "BIT220089",
      lastname: "Phan Thị Phương",
      firstname: "Linh",
      dob: "01/01/2000",
      gender: "Nữ",
    },
    {
      id: 8,
      studentId: "SV002",
      lastname: "Trần Thị",
      dob: "15/05/2001",
      gender: "Nữ",
    },
    {
      id: 9,
      studentId: "BIT220089",
      lastname: "Phan Thị Phương",
      dob: "01/01/2000",
      gender: "Nữ",
    },
    {
      id: 10,
      studentId: "SV002",
      lastname: "Trần Thị",
      dob: "15/05/2001",
      gender: "Nữ",
    },
  ],
};

const LogPage = () => {
  const [rows, setRows] = useState(Object.values(dummyLogs).flat());
  // Lọc danh sách tài khoản theo vai trò được chọn
  const columns = [
    { field: "id", headerName: "#", width: 10 },
    {
      field: "studentId",
      headerName: "Thời điểm",
      type: "datetime",
      width: 260,
    },
    { field: "lastname", headerName: "Người thực hiện", minWidth: 150, flex: 0.05},
    {
      field: "gender",
      headerName: "Hành động",
      width: 150,
      align: "center", // ✅ Căn giữa tiêu đề cột
      headerAlign: "center", // ✅ Căn giữa nội dung trong cột
    },
    {
      field: "dob",
      headerName: "Mô tả",
      type: "datetime",
      width: 600, flex: 0.1,
      headerAlign: "center",
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  useEffect(() => {
    // Chuyển đổi object thành mảng
    const mergedRows = Object.values(dummyLogs).flat();
    setRows(mergedRows);
  }, []);

  return (
    <div className="log-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-log-container">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span> / </span>
        <span className="breadcrumb-current">Nhật ký sử dụng</span>
      </nav>

      {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
      <div className="log-actions">
        <div className="action-selector">
        <select class="form-select" aria-label="Default select example">
          <option disabled>Hành động</option>
          <option value="Login">Login</option>
          <option value="Thêm mới">Thêm mới</option>
          <option value="Sửa">Sửa</option>
          <option value="Xóa">Xóa</option>
        </select>
          <input type="date" placeholder="" className="search-box" />
          <button className="add-btn">Lọc</button>
        </div>
      </div>

      {/* Hiển thị bảng theo vai trò đã chọn */}
      <div className="log-table-container">
        <Paper sx={{width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            disableColumnResize // ✅ Ngăn kéo giãn cột
            disableExtendRowFullWidth
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal", // ✅ Cho phép xuống dòng khi nội dung dài
                wordWrap: "break-word", // ✅ Xuống dòng tự động
                lineHeight: "1.2", // ✅ Giảm khoảng cách giữa các dòng nếu nội dung quá dài
                padding: "8px", // ✅ Thêm padding cho đẹp hơn
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #ccc", // Đường phân cách dưới tiêu đề cột
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #ddd", // Đường phân cách giữa các cột
              },
              "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                borderBottom: "none", // Loại bỏ viền dưới cùng của hàng cuối
              },
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

export default LogPage;
