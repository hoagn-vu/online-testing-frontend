import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SubjectPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { InputLabel , OutlinedInput , Grid, Pagination, TextField, ListItemText, FormControl, Select, MenuItem, Checkbox  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Api } from "@mui/icons-material";
import hasPermission from "../../permissions";
import {useSelector} from "react-redux"

const SubjectPage = () => {
  const [listSubject, setListSubject] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const userRole = useSelector((state) => state.auth.user?.role);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const navigate = useNavigate();
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const [personName, setPersonName] = React.useState([]);
  const [listUser, setListUser] = React.useState([]);
  const [listAssignee, setListAssignee] = useState([]);
  const handleChange = (event) => {
    const {target: { value },} = event;
    const selected = typeof value === "string" ? value.split(",") : value;
    setPersonName(selected);
    setFormData((prev) => ({
      ...prev,
      assignee: selected,
    }));
  };

  const fetchUserOptions = async () => {
		try {
			const response = await ApiService.get(`/users/get-by-role`, {
				params: { role: "lecturer" },
			});
			
			setListUser(response.data.map((user) => ({
				value: user.userId,
				label: user.fullName,
			})));
		} catch (error) {
			console.error("Failed to fetch matrix options", error);
			return [];
		}
	};

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/subjects", {
        params: { keyword, page, pageSize },
      });
      setListSubject(response.data.subjects);
      setTotalCount(response.data.totalCount);
      setListAssignee(response.data.subjects.assignee);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  const createSubject = async (subject) => {
    setIsLoading(true);
    try {
      await ApiService.post("/subjects", subject);
      fetchData();
    } catch (error) {
      console.error("Failed to create subject: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page, pageSize]);

  const preAddNew = () => {
    setEditingSubject(null);
    setFormData({ subjectName: "", assignee: [] });
    setPersonName([]);
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
    assignee: [],
  });

  function showToast(type, message, onClose) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    return Toast.fire({
      icon: type,
      title: message,
      didClose: onClose
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        const response = await ApiService.put(`/subjects/${editingSubject.id}`, formData);
        if (response.data.status == "success") {
          showToast("success", "Cập nhật phân môn thành công!");
        } else {
          Swal.fire({
            icon: "error",
            title: "Có lỗi xảy ra",
            text: response.data.message || "Không thể xử lý yêu cầu",
          });
        }

        await fetchData();
        setShowForm(false);
      } else {
        // Thêm mới dữ liệu
        console.log(formData)
        await createSubject(formData);
        showToast("success", "Tạo phân môn thành công!");
        setShowForm(false);
      }
    }catch (error) {
      showToast("error", error?.message || "Không thể xử lý yêu cầu");
    }
  };

  const preEdit = (subject) => {
    setFormData({
      subjectName: subject.subjectName,
      assignee: subject.assignee?.map(a => a.userId) || [],  // chỉ lấy userId
    });
    setPersonName(subject.assignee?.map(a => a.userId) || []); // Select hiểu đúng value
    setEditingSubject(subject);
    setShowForm(true);
  };


  const handleDelete = async (subjectId) => {
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
          await ApiService.delete(`/subjects/delete-subject?subjectId=${subjectId}`);
          fetchData();
          showToast("success", "Phân môn bị xóa thành công!");
        }
        catch (error) {
          console.error("Failed to delete subject: ", error);
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
        <Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Ngân hàng câu hỏi</span>
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
            {hasPermission(userRole, "add_subject") && (
              <AddButton onClick={preAddNew}>
                <i className="fas fa-plus me-2"></i>
                Thêm mới
              </AddButton>
            )}
          </div>
        </div>

        <div className="table-responsive" style={{minHeight: "230px"}}>
          <table className="table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
            <thead>
              <tr className="align-middle">
                <th scope="col" className="text-center title-row" style={{ width: "50px"}}>STT</th>
                <th scope="col" className="title-row">Phân môn</th>
                <th className="text-center">Số lượng bộ câu hỏi</th>
                <th>Người được phân công</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : listSubject.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center fw-semibold text-muted"
                    style={{ height: "100px", verticalAlign: "middle" }}>
                    Không có dữ liệu
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
                  <td>
                    {item.assignee && item.assignee.length > 0 ? (
                      item.assignee.map((user) => (
                        <div key={user.userId} className="d-flex align-items-center text-muted mb-2" style={{ fontSize: "14px" }}>
                          <i className="fas fa-user-circle me-2" style={{ fontSize: "18px", color: "#5188d4ff" }}></i>
                          <span style={{color: "black"}}>{user.fullName}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted fst-italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="text-center align-middle">
                    <div className="dropdown d-inline-block">
                      <button
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        className="dropdown-toggle-icon"
                        >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
                          style={{
                            right: "50%",
                            transform: 'translate3d(-10px, 10px, 0px)',
                          }}
                          >
                          {hasPermission(userRole, "edit_del_subject") ? (
                            <>
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
                            </>
                            ) : (
                            <li className="tbl-action">
                              <span className="p-3" style={{ color: "gray", cursor: "not-allowed" }}>
                                Không có quyền
                              </span>
                            </li>
                          )}
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
                  {editingSubject ? "Chỉnh sửa phân môn" : "Thêm phân môn"}
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
                  label="Tên phân môn"
                  required
                  value={formData.subjectName}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectName: e.target.value })
                  }
                  inputRef={inputRef}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "50px",
                    },
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
                        textAlign: "center",     
                        marginTop: "16px",
                        marginLeft: "0px"
                    },
                    "& .MuiTablePagination-selectLabel": {
                        marginTop: "13px",
                        marginLeft: "0px"
                    },
                    "& .MuiTablePagination-select": {
                        marginLeft: "0px",
                    },
                  }}
                />
                <Grid item xs={12} sx={{mt: 2}}>
                  <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-multiple-checkbox-label">Phân công</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={personName}
                      onChange={handleChange}
                      input={<OutlinedInput label="Phân công" />}
                      renderValue={(selected) => 
                        listUser
                          .filter((u) => selected.includes(u.value))
                          .map((u) => u.label)
                          .join(", ")
                      }
                      MenuProps={MenuProps}
                      sx={{
                        "& .MuiSelect-select": {
                          height: "50px", 
                          display: "flex",
                          alignItems: "center",  
                          paddingY: "0px",       
                        },
                        ".css-w76bbz-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": {
                          height: "50px"
                        },
                        ".css-mp9f0v.MuiSelect-select": {
                          height: "50px",
                        }
                      }}
                    >
                      {listUser.map((user) => (
                        <MenuItem key={user.value} value={user.value}>
                          <Checkbox checked={personName.includes(user.value)} />
                          <ListItemText primary={user.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
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

export default SubjectPage;
