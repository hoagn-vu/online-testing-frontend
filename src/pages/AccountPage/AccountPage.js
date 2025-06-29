import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation  } from "react-router-dom";
import "./AccountPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {InputAdornment , Box, Button, Grid, MenuItem, Pagination, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AccountPage = () => {
  const [listAccountUser, setListAccountUser] = useState([]);
  const inputRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const [listAccount, setListAccount] = useState({
    "Thí sinh": [],
    "Giám thị": [],
    "Quản trị viên": [],
    "Cán bộ phụ trách kỳ thi": [],
    "Giảng viên": [],
  });

  const [listDisplay, setListDisplay] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Thí sinh");
  
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword]); // phụ thuộc để tự động gọi lại khi có thay đổi  

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/users", {
        params: { page, pageSize, keyword },
      });
  
      // Cập nhật danh sách hiển thị theo phân trang
      setListAccountUser(response.data.users);
      setTotalCount(response.data.total);
  
      // Tạo object phân loại tài khoản
      const newAccounts = {
        "Thí sinh": [],
        "Giám thị": [],
        "Quản trị viên": [],
        "Cán bộ phụ trách kỳ thi": [],
        "Giảng viên": [],
      };
  
      response.data.users.forEach((user) => {
        if (user.role === "candidate") {
          newAccounts["Thí sinh"].push(user);
        }
        if (user.role === "supervisor") {
          newAccounts["Giám thị"].push(user);
        }
        if (user.role === "admin") {
          newAccounts["Quản trị viên"].push(user);
        }
        if (user.role === "staff") {
          newAccounts["Cán bộ phụ trách kỳ thi"].push(user);
        }
      });
  
      setListAccount(newAccounts);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    setSelectedRole("Thí sinh");
    setListDisplay(listAccount["Thí sinh"]);
  }, [listAccount]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (e, id) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(listDisplay.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [rows, setRows] = useState(Object.values(listAccount).flat());  

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  const permissionOptions = [
    "Quản lý kỳ thi",
    "Quản lý ngân hàng câu hỏi",
    "Quản lý đề thi",
    "Quản lý ma trận đề thi",
    "Quản lý phòng thi",
  ];

  const [formData, setFormData] = useState({
    userCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "male",
    username: "",
    // password: "",
    role: selectedRole,
    accountStatus: "active",
    permissions: [],
  });

  const handleAddNew = () => {
    setEditingAccount(null);
    setFormData({
      userCode: "",
      fullName: "",
      dateOfBirth: "",
      gender: "male",
      username: "",
      // password: "",
      role: "candidate",
      accountStatus: "active",
      permissions: [],
    });
    setShowForm(true);
  };

  const [passwordData, setPasswordData] = useState({
    role: "candidate",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePermissionChange = (permission) => {
    setFormData((prevData) => {
      const updatedPermissions = prevData.permissions.includes(permission)
        ? prevData.permissions.filter((p) => p !== permission)
        : [...prevData.permissions, permission];

      return { ...prevData, permissions: updatedPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu thêm mới:", formData);
    setShowForm(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log("Cập nhật mật khẩu cho vai trò:", passwordData);
    setShowPasswordForm(false);
  };

  const handleEdit = (account) => {
  setEditingAccount(account);
  setFormData({
    userCode: account.userCode || "",
    fullName: account.fullName || "",
    dateOfBirth: account.dateOfBirth || "",
    gender: account.gender || "Nam",
    username: account.username || "",
    // password: "", // Để rỗng vì lý do bảo mật
    role: account.role || selectedRole, // Ưu tiên role của account
    status: account.accountStatus || "active",
    permissions: account.permissions || [],
  });
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
        console.log("Xóa tài khoản có ID:", id);
        setListDisplay(prev => prev.filter(item => item.id !== id));
        Swal.fire({
          title: "Đã xóa!",
          text: "Tài khoản đã bị xóa.",
          icon: "success",
        });
        setRows(rows.filter((row) => row.id !== id));
      }
    });
  };

  const handleUploadClick = async () => {
  const { value: file } = await Swal.fire({
    title: "Chọn file",
    input: "file",
    inputAttributes: {
      accept: "image/*",
      "aria-label": "Tải ảnh lên",
    },
    showCancelButton: true,
    confirmButtonText: "Tải lên",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    reverseButtons: true,

  });

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      Swal.fire({
        title: "Tải lên thành công",
        icon: "success",
        confirmButtonText: "Đồng ý",
      });
    };
    reader.readAsDataURL(file);
  }
};

  const handleRoleChange = (role) => {
    switch (role) {
      case "Thí sinh":
        setListDisplay(listAccount["Thí sinh"]);
        break;
      case "Giám thị":
        setListDisplay(listAccount["Giám thị"]);
        break;
      case "Quản trị viên":
        setListDisplay(listAccount["Quản trị viên"]);
        break;
      case "Cán bộ phụ trách kỳ thi":
        setListDisplay(listAccount["Cán bộ phụ trách kỳ thi"]);
        break;
      default:
        break;
    }
    setSelectedRole(role);
  };

  const colourOptions = [
    { value: "22IT1", label: "22IT1" },
    { value: "22IT2", label: "22IT2" },
    { value: "22IT3", label: "22IT3" },
  ];
  
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleToggleStatus = (id, currentStatus) => {
    Swal.fire({
      title: "Bạn có chắc muốn thay đổi trạng thái?",
      text: "Trạng thái sẽ được cập nhật ngay sau khi xác nhận!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const newStatus = currentStatus.toLowerCase() === "active" ? "disabled" : "active";
        const statusLabel = newStatus === "active" ? "Hoạt động" : "Không hoạt động";

        // Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, accountStatus: newStatus } : row
          )
        );
        console.log("userId được đổi status:", id)
        Swal.fire({
          title: "Cập nhật thành công!",
          text: `Trạng thái đã chuyển sang "${statusLabel}".`,
          icon: "success",
        });
      }
    });
  };
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  // state quản lý hiện/ẩn
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // hàm toggle
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý tài khoản</span>
      </nav>
      <div className="tbl-shadow p-3 pt-1">
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
          <div className="role-selector d-flex align-items-center gap-2">
            <AddButton onClick={handleAddNew}>
              <i className="fas fa-plus me-2"></i> Thêm mới
            </AddButton>
            {/* <button className="btn btn-primary add-btn-hover" style={{fontSize: "14px"}} onClick={handleAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </button> */}
            <button
              className="change-password-btn btn-size align-items-center d-flex"
              onClick={() => setShowPasswordForm(true)}
            >
              Đổi mật khẩu
            </button>
            <AddButton className="upload-btn-hover" style={{backgroundColor: "#28A745"}} onClick={handleUploadClick}>
              <i className="fas fa-upload me-2"></i>Upload File
            </AddButton>
          </div>
        </div>

        {/* Tabs để chọn loại tài khoản */}
        <ul className="nav nav-tabs ">
          {Object.keys(listAccount).map((role) => (
            <li className="nav-item" key={role}>
              <a
                className={`nav-link ${selectedRole === role ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleRoleChange(role);
                }}
              >
                {role}
              </a>
            </li>
          ))}
        </ul>

        <div className="table-responsive">
          <table className="table sample-table table-hover tbl-organize-hover">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="text-center title-row" style={{ width: "50px"}}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={listDisplay.length > 0 && listDisplay.every((item) => selectedItems.includes(item.id))}                  />
                </th>
                <th scope="col" className="title-row">Mã</th>
                <th scope="col" className="title-row">Tài khoản</th>
                <th scope="col" className="title-row">Họ và tên đệm</th>
                <th scope="col" className="title-row">Tên</th>
                <th className="text-center">Ngày sinh</th>
                <th className="text-center">Giới tính</th>
                <th className="text-center">Nhóm</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) :
              listDisplay.map((item, index) => (
                <tr key={item.id} className="align-middle">
                  <td className=" text-center" style={{ width: "50px" }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={(e) => handleSelectItem(e, item.id)}
                      checked={selectedItems.includes(item.id)}
                    />
                  </td>
                  <td>{item.userCode}</td>
                  <td>{item.username}</td>
                  <td>{item.fullName}</td>
                  <td>{item.fullName}</td>
                  <td className="text-center">{item.dateOfBirth}</td>
                  <td className="text-center">{item.gender}</td>
                  <td className="text-center">{item.groupName}</td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <span className={`badge ms-2 mt-1 ${item.accountStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
                        {item.accountStatus === "Active" || "available" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
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
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom"
                        style={{
                          right: "50%",
                          transform: 'translate3d(-10px, 10px, 0px)',
                        }}
                      >
                        <li className="tbl-action" onClick={() => handleEdit(item)}> 
                          <button className="dropdown-item tbl-action" onClick={() => handleEdit(item)}>
                             Chỉnh sửa
                          </button>
                        </li>
                        <li className="tbl-action" onClick={() => handleDelete(item.id)}>
                          <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
                             Xoá
                          </button>
                        </li>
                        <li className="tbl-action" onChange={() => handleToggleStatus(item.id, item.accountStatus)}>
                          <button
                            className="dropdown-item tbl-action"
                            onClick={() =>
                              handleToggleStatus(item.id, item.accountStatus)
                            }
                          >
                            {item.accountStatus.toLowerCase() === "active"
                              ? "Vô hiệu hoá"
                              : "Kích hoạt"}
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

        <div className="sample-pagination d-flex justify-content-end align-items-center mb-2">
          {/* <Pagination count={10} color="primary" shape="rounded" /> */}
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
      {/* Form thêm tài khoản */}
      {showForm && (
        <div className="form-overlay">
          <Box
            component="form"
            sx={{
              width: "800px",
              backgroundColor: "white",
              p: 3,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <p className="fw-bold mb-4">
              {editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </p>

            <Grid container spacing={2}>
              {/* Mã và Họ Tên */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã"
                  required
                  inputRef={inputRef}
                  value={formData.userCode}
                  onChange={(e) =>
                    setFormData({ ...formData, userCode: e.target.value })
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
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

              {/* Ngày sinh và Giới tính */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ngày Sinh"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </TextField>
              </Grid>

              {/* Username và Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
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
              {/* <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Password"
                  // type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid> */}

              {/* Trạng thái và Vai trò */}
              {/* <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  required
                  value={formData.accountStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, accountStatus: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </TextField>
              </Grid> */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Vai trò"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="candidate">Thí sinh</MenuItem>
                  <MenuItem value="supervisor">Giám thị</MenuItem>
                  <MenuItem value="teacher">Giảng viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="staff">
                    Cán bộ phụ trách kỳ thi
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Phân quyền nếu là Cán bộ phụ trách kỳ thi */}
            {formData.role === "staff" && (
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Phân quyền:
                </label>
                <FormGroup>
                  <Grid container spacing={2}>
                    {permissionOptions.map((permission, index) => (
                      <Grid item xs={6} key={index}>
                        <FormControlLabel
                          sx={{ mb: -3 }}
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(
                                permission
                              )}
                              onChange={(e) => {
                                const updatedPermissions = e.target.checked
                                  ? [...formData.permissions, permission]
                                  : formData.permissions.filter(
                                      (p) => p !== permission
                                    );
                                setFormData({
                                  ...formData,
                                  permissions: updatedPermissions,
                                });
                              }}
                              sx={{ "& .MuiCheckbox-root": { padding: "0px" } }} // Giảm padding checkbox
                            />
                          }
                          label={
                            <span style={{ fontSize: "14px" }}>
                              {permission}
                            </span>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
            )}

            {/* Buttons */}
            <Grid container spacing={2} sx={{ mt: 1, justifyContent:"flex-end" }}>
              <Grid item xs={3}>
                <CancelButton onClick={() => setShowForm(false)} style={{width: "100%"}}>
                  Hủy
                </CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </AddButton>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}

      {/* Form Đổi mật khẩu */}
      {showPasswordForm && (
        <div className="form-overlay">
          <Box
            component="form"
            sx={{
              width: "800px",
              backgroundColor: "white",
              p: 3,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
            }}
            onSubmit={handlePasswordSubmit}
          >
            <p className="fw-bold mb-4">
              Đổi mật khẩu
            </p>

            <Grid container spacing={2}>
              {/* Mã và Họ Tên */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Vai trò"
                  value={passwordData.role}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, role: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="candidate">Thí sinh</MenuItem>
                  <MenuItem value="supervisor">Giám thị</MenuItem>
                  <MenuItem value="teacher">Giảng viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="staff">Cán bộ phụ trách kỳ thi</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  type={showPassword ? "text" : "password"}
                  required
                  inputRef={inputRef}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  required
                  inputRef={inputRef}
                  type={showConfirmPassword  ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              </Grid>

            {/* Buttons */}
            <Grid container spacing={2} sx={{ mt: 1, justifyContent:"flex-end" }}>
              <Grid item xs={3}>
                <CancelButton onClick={() => setShowPasswordForm(false)} style={{width: "100%"}}>
                  Hủy
                </CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </AddButton>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}
      {/* Form Chọn nhóm */}
      {showGroupForm && (
        <div className="form-overlay">
          <div className="form-container p-4" style={{width: "500px"}}>
            <h3 className="fw-bold">Chọn nhóm</h3>
            <CreatableSelect
              isMulti
              options={colourOptions}
              value={selectedGroups}
              onChange={setSelectedGroups}
            />

            <div className="d-flex">
              <button type="submit" style={{width: "100%"}}>Lưu</button>
              <button type="button" style={{width: "100%"}} onClick={() => setShowGroupForm(false)}>
                Hủy
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;
