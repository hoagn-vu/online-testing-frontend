import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SubjectPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, Pagination, TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

const SubjectPage = () => {
  const [listSubject, setListSubject] = useState([]);

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
      const response = await ApiService.get("/subjects", {
        params: { keyword, page, pageSize },
      });
      setListSubject(response.data.subjects);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  const createSubject = async (subject) => {
    setIsLoading(true);
    try {
      await ApiService.post("/subjects/add-subject", subject);
      fetchData();
    } catch (error) {
      console.error("Failed to create subject: ", error);
    }
    setIsLoading(false);
  };

  const updateSubject = async (subject) => {
    setIsLoading(true);
    try {
      await ApiService.put(`/subjects/update/${subject.id}`, subject);
      fetchData();
    }
    catch (error) {
      console.error("Failed to update subject: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page, pageSize]);

  const preAddNew = () => {
    setEditingSubject(null);
    setFormData({ subjectName: "" });
    setShowForm(true);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showForm]);

  const [formData, setFormData] = useState({
      subjectName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubject) {
      updateSubject({ ...editingSubject, ...formData });
    } else {
      // Thêm mới dữ liệu
      createSubject(formData);
    }
    setShowForm(false);
  };

  const preEdit = (subject) => {
    setFormData({ subjectName: subject.subjectName });
    setEditingSubject(subject);
    setShowForm(true);
  };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Bạn có chắc chắn xóa?",
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                setRows(rows.filter((row) => row.id !== id));
                Swal.fire("Đã xóa!", "Phân môn đã bị xóa.", "success");
            }
        });
    };

  // useEffect(() => {
  //     if (showForm && inputRef.current) {
  //         inputRef.current.focus();
  //     }
  // }, [showForm]);


  return (
    <div className="subject-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current"> Ngân hàng câu hỏi</span>
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
            <button className="btn btn-primary" style={{fontSize: "14px"}} onClick={preAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
            <thead>
              <tr className="align-middle">
                <th scope="col" className="text-center title-row" style={{ width: "50px"}}>STT</th>
                <th scope="col" className="title-row">Phân môn</th>
                <th className="text-center">Số lượng bộ câu hỏi</th>
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
              ) : listSubject.map((item, index) => (  
                <tr key={item.id} className="align-middle">
                  <td className="text-center">{index + 1}</td>
                  <td
                    onClick={() => navigate(`/staff/question/${item.id}`, {
                    })}
                    style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                    className="text-hover-primary"
                  >
                    {item.subjectName}
                  </td>
                  <td
                    onClick={() => navigate(`/staff/question/${item.id}`, {
                    })}
                    style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                    className="text-center"
                  >
                    {item.totalQuestionBanks}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-primary btn-sm" onClick={() => preEdit(item)}>
                      <i className="fas fa-edit text-white"></i>
                    </button>
                    <button className="btn btn-danger btn-sm ms-2">
                      <i className="fas fa-trash-alt"></i>
                    </button>
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
            <Box
                component="form"
                sx={{
                    minWidth: "500px",
                    minHeight: "200px",
                    backgroundColor: "white",
                    p: 2,
                    borderRadius: "8px",
                    boxShadow: 3,
                    mx: "auto",
                }}
                onSubmit={handleSubmit}
            >
                {/* Add your form content here */}
                <p className="text-align fw-bold">
                    {editingSubject ? "Chỉnh sửa phân môn" : "Thêm phân môn"}
                </p>

                <Grid container>
                    <TextField
                        fullWidth
                        label="Tên phân môn"
                        required
                        value={formData.subjectName}
                        onChange={(e) =>
                            setFormData({ ...formData, subjectName: e.target.value })
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

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Button type="submit" variant="contained" color="primary" fullWidth >
                            {editingSubject ? "Cập nhật" : "Lưu"}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="outlined" color="secondary" fullWidth onClick={() => setShowForm(false)}>
                            Hủy
                        </Button>
                    </Grid>
                </Grid>
            </Box>
          </React.Fragment>
        </div>
      )}
        </div>
    );
};

export default SubjectPage;
