import "./LogPage.css";
import { Chip, Pagination } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "../../services/apiService";

const getTagColor = (action) => {
  switch (action) {
    case "Login":
      return {
        background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
        color: "#1E40AF",
        icon: "fas fa-sign-in-alt"
      };
    case "create":
    case "Thêm mới":
      return {
        background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
        color: "#065F46",
        icon: "fas fa-plus-circle"
      };
    case "update":
    case "Sửa":
      return {
        background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
        color: "#92400E",
        icon: "fas fa-edit"
      };
    case "delete":
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
  const [madeBy, setMadeBy] = useState("");
  const [logAction, setLogAction] = useState("");
  const [logAt, setLogAt] = useState("");
  const [logDetails, setLogDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filterAction, setFilterAction] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/logs", {
        params: { type: filterAction || "post, put, delete", page, page_size, start: filterDate || undefined },
      });
      setLogs(response.data.data);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, page_size]);

  // mapping log action -> icon, color, text
  const getTagConfig = (action) => {
    if (!action) return {};

    const lower = action.toLowerCase();

    if (lower.includes("delete")) {
      return {
        text: "Xóa",
        icon: "fas fa-trash-alt",
        color: "#e53935",
        background: "#fdecea"
      };
    }
    if (lower.includes("post")) {
      return {
        text: "Thêm mới",
        icon: "fas fa-plus-circle",
        color: "#2e7d32",
        background: "#e8f5e9"
      };
    }
    if (lower.includes("put")) {
      return {
        text: "Cập nhật",
        icon: "fas fa-edit",
        color: "#1976d2",
        background: "#e3f2fd"
      };
    }

    // fallback mặc định
    return {
      text: action,
      icon: "fas fa-info-circle",
      color: "#616161",
      background: "#f5f5f5"
    };
  };

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Nhật ký sử dụng</span>
      </nav>

      <div className="tbl-shadow p-3">
                {/* Thanh tìm kiếm + Nút lọc */}
        <div className="log-actions">
          <div className="action-selector" >
            <select style={{minWidth: "200px"}}
              className="form-select" 
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="">Tất cả hành động</option>
              <option value="post">Thêm mới</option>
              <option value="put">Cập nhật</option>
              <option value="delete">Xóa</option>
            </select>

            <input 
              type="date" 
              className="date-log"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button className="add-btn d-flex filter-btn align-items-center"
              onClick={() => {
                setPage(1); // reset về trang 1 khi lọc
                fetchData();
              }}
            >
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
                  <th scope="col" className="title-row" style={{ width: "250px" }}>Người thực hiện</th>
                  <th scope="col" className="title-row">Mô tả</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "14px" }}>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center fw-semibold text-muted"
                        style={{ height: "100px", verticalAlign: "middle" }}>
                      {isLoading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={log.id} className="align-middle">
                      <td className="text-center">{index + 1}</td>
                      <td>{new Date(log.logAt).toLocaleString()}</td>
                      <td className="text-center">
                        {(() => {
                          const cfg = getTagConfig(log.logAction);
                          return (
                            <Chip
                              label={
                                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <i
                                    className={cfg.icon}
                                    style={{
                                      fontSize: "1rem",
                                      color: cfg.color,
                                      filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
                                    }}
                                  />
                                  <span style={{ fontWeight: 600 }}>{cfg.text}</span>
                                </span>
                              }
                              sx={{
                                background: cfg.background,
                                color: cfg.color,
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
                          );
                        })()}
                      </td>
                      <td>{log.fullName} - {log.userCode}</td>
                      <td>{log.logDetails}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end">
            { totalCount > 0 && (
              <Pagination
                count={Math.ceil(totalCount / page_size)}
                shape="rounded"
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            )}       
          </div>
        </div>
      </div>

    </div>
  );
};

export default LogPage;
