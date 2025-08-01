import "./LogPage.css";
import { Chip, Pagination } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const dummyLogs = [
  {
    userId: "abcdefg123",
    fullName: "Hoàng Nguyên Vũ",
    userLogs: [
      {
        logId: 1,
        logAction: "Login",
        affectedObject: "Hệ thống",
        affectedName: "Trang chủ",
        logAt: "2025-04-10T08:00:00Z",
        logDetail: "Đã đăng nhập vào hệ thống",
      },
      {
        logId: 2,
        logAction: "Thêm mới",
        affectedObject: "Câu hỏi",
        affectedName: "Ngân hàng câu hỏi",
        logAt: "2025-04-10T08:30:00Z",
        logDetail: "Thêm câu hỏi trắc nghiệm mới",
      },
      {
        logId: 3,
        logAction: "Sửa",
        affectedObject: "Đề thi",
        affectedName: "Danh sách đề thi",
        logAt: "2025-04-10T09:00:00Z",
        logDetail: "Chỉnh sửa đề thi cuối kỳ",
      },
      {
        logId: 4,
        logAction: "Xóa",
        affectedObject: "Lịch thi",
        affectedName: "Kỳ thi giữa kỳ",
        logAt: "2025-04-10T10:00:00Z",
        logDetail: "Xóa lịch thi không hợp lệ",
      },
    ],
  },
];

const getTagColor = (action) => {
  switch (action) {
    case "Login":
      return {
        background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
        color: "#1E40AF",
        icon: "fas fa-sign-in-alt"
      };
    case "Thêm mới":
      return {
        background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
        color: "#065F46",
        icon: "fas fa-plus-circle"
      };
    case "Sửa":
      return {
        background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
        color: "#92400E",
        icon: "fas fa-edit"
      };
    case "Xóa":
      return {
        background: "linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)",
        color: "#991B1B",
        icon: "fas fa-trash-alt"
      };
    default:
      return {
        background: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)",
        color: "#374151",
        icon: "fas fa-info-circle"
      };
  }
};

const LogPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Gộp tất cả các userLogs lại thành một mảng duy nhất
    const mergedLogs = dummyLogs.flatMap(user =>
      user.userLogs.map(log => ({
        ...log,
        fullName: user.fullName, // Thêm thông tin người thực hiện vào từng log
      }))
    );
    setLogs(mergedLogs);
  }, []);

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Nhật ký sử dụng</span>
      </nav>

      <div className="tbl-shadow p-3">
                {/* Thanh tìm kiếm + Nút lọc */}
        <div className="log-actions">
          <div className="action-selector">
          <select className="form-select" defaultValue="">
            <option value="" disabled>Hành động</option>
            <option value="Login">Login</option>
            <option value="Thêm mới">Thêm mới</option>
            <option value="Sửa">Sửa</option>
            <option value="Xóa">Xóa</option>
          </select>

            <input type="date" className="date-log" />
            <button className="add-btn d-flex filter-btn align-items-center">
              <i className="fas fa-filter me-2 mt-1 "></i>
              Lọc
            </button>
          </div>
        </div>

        {/* Bảng hiển thị nhật ký */}
        <div className="session-table-container mt-2">
          <div className="table-responsive tbl-log">
            <table className="table sample-table tbl-organize  ">
              <thead style={{ fontSize: "14px" }}>
                <tr className="align-middle fw-medium">
                  <th scope="col" className="title-row text-center">STT</th>
                  <th scope="col" className="title-row" style={{ width: "200px" }}>Thời điểm</th>
                  <th scope="col" className="title-row text-center" style={{ width: "200px" }}>Hành động</th>
                  <th scope="col" className="title-row">Người thực hiện</th>
                  <th scope="col" className="title-row">Mô tả</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "14px" }}>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center fw-semibold text-muted"
                        style={{ height: "100px", verticalAlign: "middle" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                logs.map((log, index) => (
                  <tr key={log.logId} className="align-middle" >
                    <td className="text-center">{index + 1}</td>
                    <td>{new Date(log.logAt).toLocaleString()}</td>
                    <td className="text-center">
                      <Chip
                        label={
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <i
                              className={getTagColor(log.logAction).icon}
                              style={{
                                fontSize: "1rem",
                                color: getTagColor(log.logAction).color,
                                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
                              }}
                            />
                            <span style={{ fontWeight: 600 }}>{log.logAction}</span>
                          </span>
                        }
                        sx={{
                          background: getTagColor(log.logAction).background,
                          color: getTagColor(log.logAction).color,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: "16px",
                          padding: "6px 14px",
                          minWidth: "110px",
                          textAlign: "center",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.03)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            cursor: "pointer"
                          },
                          "& .MuiChip-label": {
                            padding: 0,
                          },
                        }}
                      />
                    </td>

                    <td>{log.fullName}</td>
                    <td>{log.logDetail}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end">
            <Pagination count={10} color="primary" shape="rounded"/>        
          </div>
        </div>
      </div>

    </div>
  );
};

export default LogPage;
