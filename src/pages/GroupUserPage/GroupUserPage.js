import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./GroupUserPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, Pagination, TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";

const GroupUserPage = () => {
  const [listGroup, setListGroup] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [listUserText, setListUserText] = useState("");

  const navigate = useNavigate();
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/groupUser", {
        params: { keyword, page, pageSize },
      });
      setListGroup(response.data.groups);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  const createGroup = async (group) => {
    setIsLoading(true);
    try {
      await ApiService.post("/groupUser/create-group-users", group);
      fetchData();
    } catch (error) {
      console.error("Failed to create subject: ", error);
    }
    setIsLoading(false);
  };

  const updateGroup = async (groupId, groupName) => {
    setIsLoading(true);
    try {
      const response = await ApiService.put(`/groupUser/update/${groupId}`, groupName, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status >= 200 && response.status < 300) {
        await fetchData(); // Chỉ gọi khi thành công
        return true; // Trả về true để biểu thị thành công
      }
      throw new Error('Cập nhật thất bại');
    } catch (error) {
      console.error('Failed to update group:', error);
      throw new Error('Lỗi không cập nhật được');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page, pageSize]);

  const preAddNew = () => {
    setEditingSubject(null);
    setFormData({ groupName: "", listUser: [] });
    setShowForm(true);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showForm]);

  useEffect(() => {
    if (showFormEdit && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showFormEdit]);

  const [formData, setFormData] = useState({
    groupName: "",
    listUser: [],
    listUserText: ""
  });

  const [formDataEdit, setFormDataEdit] = useState({
    groupName: "",
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

    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.groupName && !editingSubject) {
      showToast("warning", "Tên nhóm không được để trống", () => {
        inputRef.current?.focus();
      });
      return;
    }

    if (editingSubject && !formDataEdit.groupName) {
      showToast("warning", "Tên nhóm không được để trống", () => {
        inputRef.current?.focus();
      });
      return;
    }

    if (!formData.listUserText || formData.listUserText.trim() === "") {
      showToast("warning", "Vui lòng thêm ít nhất một mã sinh viên", () => {
        inputRef.current?.focus();
      });
      return;
    }

    // Tách listUserText thành mảng
    const lines = formData.listUserText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line); // Loại bỏ dòng rỗng

    // Payload gửi lên server
    const payloadCreate = {
      ...formData,
      listUser: lines
    };

    const payloadEdit = {
      groupName: formDataEdit.groupName,
    };

    try {
      if (editingSubject) {
        await updateGroup(editingSubject.id, formDataEdit.groupName);
        showToast("success", "Cập nhật nhóm thành công!");
      } else {
        await createGroup(payloadCreate);
        showToast("success", "Tạo nhóm thành công!");
      }
      setShowForm(false);
      setShowFormEdit(false);
    }catch (error) {
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: error?.message || "Không thể xử lý yêu cầu",
      });;
    }
  };

  const preEdit = (group) => {
    setFormDataEdit({ groupName: group.groupName });
    setEditingSubject(group);
    setShowFormEdit(true);
  };

  const handleDelete = async (groupId) => {
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
        try {
          await ApiService.delete(`/groupUser/delete/${groupId}`);
          fetchData();
          showToast("success", "Nhóm người dùng đã bị xóa!");
        }
        catch (error) {
        console.error("Failed to delete group: ", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Không thể xóa nhóm",
        });
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
        <span className="breadcrumb-current">Nhóm người dùng</span>
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
                <th scope="col" className="title-row">Nhóm</th>
                <th className="text-center">Số lượng thí sinh</th>
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
              ) : listGroup.map((item, index) => (  
                <tr key={item.id} className="align-middle">
                  <td className="text-center">{index + 1}</td>
                  <td
                    onClick={() => navigate(`/staff/groupuser/${item.id}`, {
                    })}
                    style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                    className="text-hover-primary"
                  >
                    {item.groupName}
                  </td>
                  <td
                    onClick={() => navigate(`/staff/groupuser/${item.id}`, {
                    })}
                    style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                    className="text-center"
                  >
                    {item.listUser?.length || 0}
                  </td>
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

      {showForm && (
        <div className="form-overlay">
          <React.Fragment>
            <form
              className="shadow form-fade bg-white bd-radius-8"
              style={{ width: "750px", boxShadow: 3,}}
              onSubmit={handleSubmit}
            >
            <div className="d-flex justify-content-between"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >
              {/* Add your form content here */}
              <p className="fw-bold p-4 pb-0">
                Thêm nhóm người đùng mới
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
              <Grid container spacing={2} sx={{p: 3, pt: 1}}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên nhóm"
                    required
                    value={formData.groupName}
                    inputRef={inputRef}
                    onChange={(e) =>
                      setFormData({ ...formData, groupName: e.target.value })
                    }
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        paddingBottom: "11px",
                      },
                      "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Nhập mã sinh viên"
                    placeholder="Nhập mã sinh viên"
                    value={formData.listUserText}
                    multiline
                    maxRows={12}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        listUserText: e.target.value
                      });
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": {
                        minHeight: "150px", 
                        alignItems: "flex-start", 
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                      },
                      "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1}}>
                <Grid item xs={3}>
                  <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>Hủy</CancelButton>
                </Grid>
                <Grid item xs={3}>
                  <AddButton style={{width: "100%"}} onClick={handleSubmit}>
                    {editingSubject ? "Cập nhật" : "Lưu"}
                  </AddButton>
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        </div>
      )}

      {showFormEdit && (
        <div className="form-overlay">
          <React.Fragment>
            <form
              className="shadow form-fade bg-white bd-radius-8"
              style={{ width: "750px", boxShadow: 3,}}
              onSubmit={handleSubmit}
            >
            <div className="d-flex justify-content-between"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >
              {/* Add your form content here */}
              <p className="fw-bold p-4 pb-0">
                Chỉnh sửa nhóm người dùng
              </p>
              <button
                className="p-4"
                type="button"
                onClick={() => setShowFormEdit(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              ><i className="fa-solid fa-xmark"></i></button>
              </div>
              <Grid container spacing={2} sx={{p: 3, pt: 1}}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên nhóm"
                    required
                    value={formDataEdit.groupName}
                    inputRef={inputRef}
                    onChange={(e) =>
                      setFormDataEdit({ ...formDataEdit, groupName: e.target.value })
                    }
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        paddingBottom: "11px",
                      },
                      "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                    }}
                  />
                </Grid>                
              </Grid>

              <Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1}}>
                <Grid item xs={3}>
                  <CancelButton style={{width: "100%"}} onClick={() => setShowFormEdit(false)}>Hủy</CancelButton>
                </Grid>
                <Grid item xs={3}>
                  <AddButton style={{width: "100%"}} onClick={handleSubmit}>
                    Cập nhật
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

export default GroupUserPage;
