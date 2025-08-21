import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LevelManagement.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, Pagination, TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";

const LevelManagement = () => {
  const [listLevel, setListLevel] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const navigate = useNavigate();
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/level", {
        params: { keyword, page, pageSize },
      });
      setListLevel(response.data.levels);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  const createLevel = async (level) => {
    setIsLoading(true);
    try {
      await ApiService.post("/level", level);
      fetchData();
    } catch (error) {
      console.error("Failed to create level: ", error);
    }
    setIsLoading(false);
  };

  const updateLevel = async (level) => {
    setIsLoading(true);
    try {
      const response = await ApiService.put(`/level/${level.id}`, level);
      if (response.status >= 200 && response.status < 300) {
        await fetchData();
        return true; // thành công
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Failed to update level:", error);
      throw error; // ném lỗi ra ngoài để handleSubmit bắt được
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page, pageSize]);

  const preAddNew = () => {
    setEditingSubject(null);
    setFormData({ levelName: "" });
    setShowForm(true);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showForm]);

  const [formData, setFormData] = useState({
    levelName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await updateLevel({ ...editingSubject, ...formData });
        Swal.fire({
          icon: "success",
          text: "Cập nhật mức độ thành công",
          draggable: true
        });
        setShowForm(false);
      } else {
        // Thêm mới dữ liệu
        await createLevel(formData);
        Swal.fire({
          icon: "success",
          text: "Tạo mức độ thành công",
          draggable: true
        });
        setShowForm(false);
      }
    }catch (error) {
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: error?.message || "Không thể xử lý yêu cầu",
      });;
    }
  };

  const preEdit = (subject) => {
    setFormData({ levelName: subject.levelName });
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDelete = async (levelId) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async(result) => {
      if (result.isConfirmed) {
        // Xóa phân môn khỏi danh sách
        //setListSubject(prev => prev.filter(subject => subject.id !== subjectId));
        try {
          await ApiService.delete(`/level/${levelId}`);
          fetchData();
          Swal.fire({
            title: "Đã xóa!",
            text: "Mức độ đã bị xóa thành công",
            icon: "success",
          });
        }
        catch (error) {
          console.error("Failed to update level: ", error);
        }
      }
    });
  };

  // useEffect(() => {
  //     if (showForm && inputRef.current) {
  //         inputRef.current.focus();
  //     }
  // }, [showForm]);


  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý mức độ</span>
      </nav>

      <div className="tbl-shadow p-3">
        <div className="sample-card-header d-flex justify-content-between align-items-center mb-2">
          <div className='left-header d-flex align-items-center'>
            <div className="search-box rounded d-flex align-items-center">
              <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
              <input
                type="text"
                className="search-input w-100"
                placeholder="Tìm kiếm..."
                value={keyword}
                onChange={handleKeywordChange}
              />
            </div>
          </div>

          <div className='right-header'>
            <AddButton onClick={preAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </AddButton>
          </div>
        </div>

        <div className="table-responsive" style={{minHeight: "230px"}}>
          <table className="table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
            <thead>
              <tr className="align-middle">
                <th scope="col" className="text-center title-row" style={{ width: "50px"}}>STT</th>
                <th scope="col" className="title-row">Mức độ</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : listLevel.map((item, index) => (  
                <tr key={item.id} className="align-middle">
                  <td className="text-center">{index + 1}</td>
                  <td >{item.levelName}</td>
                  <td className="text-center align-middle">
                    <div className="dropdown d-inline-block">
                      <button
                        className="dropdown-toggle-icon"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
                        style={{
                          right: "50%",
                          transform: 'translate3d(-10px, 10px, 0px)',
                        }}
                      >
                        <li className="tbl-action" onClick={() => preEdit(item)}> 
                          <button className="dropdown-item tbl-action" onClick={() => preEdit(item)}>
                             Chỉnh sửa
                          </button>
                        </li>
                        <li className="tbl-action" onClick={() => handleDelete(item.id)}>
                          <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
                             Xoá
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="sample-pagination d-flex justify-content-end align-items-center ">
          { totalCount > 0 && (
            <Pagination
              count={Math.ceil(totalCount / pageSize)}
              shape="rounded"
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          )}
        </div>
      </div>

      {/* Form thêm/sửa phân môn */}
      {showForm && (
        <div className="form-overlay">
          <React.Fragment>
            <form
              className="shadow form-fade bg-white bd-radius-8"
              style={{ width: "750px", boxShadow: 3}}
              onSubmit={handleSubmit}
            >
              <div className="d-flex justify-content-between"
                style={{
                  borderBottom: "1px solid #ccc",
                  marginBottom: "20px",
                }}
              >
                <p className="fw-bold p-4 pb-0">
                  {editingSubject ? "Chỉnh sửa mức độ" : "Thêm mức độ"}
                </p>
                <button
                  className="p-4"
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                ><i className="fa-solid fa-xmark"></i></button>     
              </div>
              <Grid container sx={{p: 3, pt: 1}}>
                <TextField
                  fullWidth
                  label="Tên mức độ"
                  required
                  value={formData.levelName}
                  onChange={(e) =>
                    setFormData({ ...formData, levelName: e.target.value })
                  }
                  inputRef={inputRef}
                  sx={{
                    "& .MuiDataGrid-cell": {
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        lineHeight: "1.2",
                        padding: "8px",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "2px solid #ccc",
                    },
                    "& .MuiDataGrid-cell": {
                        borderRight: "1px solid #ddd",
                    },
                    "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiTablePagination-displayedRows": {
                        textAlign: "center",        // Căn giữa chữ "1-1 of 1"
                        marginTop: "16px",
                        marginLeft: "0px"
                    },
                    "& .MuiTablePagination-selectLabel": {
                        marginTop: "13px",
                        marginLeft: "0px"
                    },
                    "& .MuiTablePagination-select": {
                        marginLeft: "0px",
                    } 
                  }}
                />
              </Grid>

              <Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1 }}>
                <Grid item xs={3}>
                  <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>Hủy</CancelButton>
                </Grid>
                <Grid item xs={3}>
                  <AddButton style={{width: "100%"}}>
                    {editingSubject ? "Cập nhật" : "Lưu"}
                  </AddButton>
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        </div>
      )}
    </div>
  );
};

export default LevelManagement;
