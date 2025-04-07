import React, { useState, useEffect } from "react";
import { Link, useLocation  } from "react-router-dom";
import "./AccountPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Pagination, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";

const AccountPage = () => {
  const [listAccount, setListAccount] = useState({
    "Thí sinh": [],
    "Giám thị": [],
    "Quản trị viên": [],
    "Cán bộ phụ trách kỳ thi": [],
  });

  const [listDisplay, setListDisplay] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Thí sinh");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/users");

        const newAccounts = {
          "Thí sinh": [],
          "Giám thị": [],
          "Quản trị viên": [],
          "Cán bộ phụ trách kỳ thi": [],
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
        console.error("Lỗi lấy dữ liệu tài khoản:", error);
      }
    };

    fetchData();
  }, []);

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
      setSelectedItems(listAccount.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [rows, setRows] = useState(Object.values(listAccount).flat());  

  const permissionOptions = [
    "Quản lý kỳ thi",
    "Quản lý ngân hàng câu hỏi",
    "Quản lý đề thi",
    "Quản lý ma trận đề thi",
    "Quản lý phòng thi",
  ];

  const handleStatusChange = (id, newStatus) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  const [formData, setFormData] = useState({
    userCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Nam",
    userName: "",
    password: "",
    role: selectedRole,
    status: "active",
    permissions: [],
  });

  const handleAddNew = () => {
    setEditingAccount(null);
    setFormData({
      userCode: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Nam",
      userName: "",
      password: "",
      role: selectedRole,
      status: "active",
      permissions: [],
    });
    setTimeout(() => setShowForm(true), 0);
  };

  const [passwordData, setPasswordData] = useState({
    role: "Thí sinh",
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
    setFormData({
      userCode: account.userCode,
      fullName: account.fullName,
      dateOfBirth: account.dateOfBirth,
      gender: account.gender,
      userName: account.userName,
      password: "", 
      role: selectedRole,
      status: account.status,
      permissions: account.permissions || [],
    });
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log(`Đã xóa tài khoản có ID: ${accountToDelete.id}`);
    setShowDeleteModal(false); 
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
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Tải lên thành công",
          icon: "success",
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

        // Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, accountStatus: newStatus } : row
          )
        );
        console.log("userId được đổi status:", id)
        Swal.fire({
          title: "Cập nhật thành công!",
          text: `Trạng thái đã chuyển sang "${newStatus}".`,
          icon: "success",
        });
      }
    });
  };
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <div className="sample-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý tài khoản</span>
      </nav>
      <div className="tbl-shadow p-3 pt-1">
        {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
        <div className="account-actions">
          <div className="search-container">
            <SearchBox></SearchBox>
          </div>
          <div className="role-selector">

            <button className="btn btn-primary me-0" style={{fontSize: "14px"}} onClick={handleAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </button>
            <button
              className="change-password-btn btn-size align-items-center d-flex"
              onClick={() => setShowPasswordForm(true)}
            >
              Đổi mật khẩu
            </button>
            <button className="upload-btn btn-size align-items-center d-flex" onClick={handleUploadClick}>
              Upload File
            </button>
            <button className="btn btn-primary btn-size align-items-center d-flex" onClick={() => setShowGroupForm(true)}>
              Thêm nhóm
            </button>
            <button className="btn btn-primary btn-size align-items-center d-flex" >
              Xóa nhóm
            </button>
          </div>
        </div>

        {/* Tabs để chọn loại tài khoản */}
        <ul className="nav nav-tabs">
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
                    checked={selectedItems.length === listAccount.length && listAccount.length > 0}
                  />
                </th>
                <th scope="col" className="title-row">Mã</th>
                <th scope="col" className="title-row">Tài khoản</th>
                <th scope="col" className="title-row">Họ tên</th>
                <th className="text-center">Ngày sinh</th>
                <th className="text-center">Giới tính</th>
                <th className="text-center">Nhóm</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listDisplay.map((item, index) => (
                <tr key={item.id} className="align-middle">
                  <td className=" text-center" style={{ width: "50px" }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={(e) => handleSelectItem(e, item.questionBankId)}
                      checked={selectedItems.includes(item.questionBankId)}
                    />
                  </td>
                  <td>{item.userCode}</td>
                  <td>{item.username}</td>
                  <td>{item.fullName}</td>
                  <td className="text-center">{item.dateOfBirth}</td>
                  <td className="text-center">{item.gender}</td>
                  <td className="text-center">{item.groupName}</td>
                  <td>
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={item.accountStatus.toLowerCase() === "active"}
                        onChange={() =>
                          handleToggleStatus(item.id, item.accountStatus)
                        }
                      />
                    </div>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}>
                      <i className="fas fa-edit text-white " onClick={handleEdit}></i>
                    </button>
                    <button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sample-pagination d-flex justify-content-end align-items-center mb-2">
          <Pagination count={10} color="primary" shape="rounded" />
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
              p: 4,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <p className="fw-bold">
              {editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </p>

            <Grid container spacing={2}>
              {/* Mã và Họ Tên */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã"
                  required
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
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </TextField>
              </Grid>

              {/* Username và Password */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
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
                  label="Password"
                  type="password"
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
              </Grid>

              {/* Trạng thái và Vai trò */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
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
              </Grid>

              <Grid item xs={6}>
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
                  <MenuItem value="Thí sinh">Thí sinh</MenuItem>
                  <MenuItem value="Giám thị">Giám thị</MenuItem>
                  <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                  <MenuItem value="Cán bộ phụ trách kỳ thi">
                    Cán bộ phụ trách kỳ thi
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Phân quyền nếu là Cán bộ phụ trách kỳ thi */}
            {formData.role === "Cán bộ phụ trách kỳ thi" && (
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
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}

      {/* Form Đổi mật khẩu */}
      {showPasswordForm && (
        <div className="form-overlay">
          <div className="form-container" style={{width: "40%"}}>
            <h6 className="fw-bold align-items-left">Đổi mật khẩu</h6>
            <form onSubmit={handlePasswordSubmit}>
              <label>Chọn vai trò:</label>
              <select
                className="input-height"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, role: e.target.value })
                }
              >
                <option value="Thí sinh">Thí sinh</option>
                <option value="Giám thị">Giám thị</option>
                <option value="Cán bộ phụ trách kỳ thi">
                  Cán bộ phụ trách kỳ thi
                </option>
                <option value="Quản trị viên">Quản trị viên</option>
              </select>

              <label>Mật khẩu mới:</label>
              <input
                className="input-height"
                type="password"
                required
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />

              <label>Xác nhận mật khẩu:</label>
              <input
                className="input-height"
                type="password"
                required
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div className="d-flex mt-2">
                <button type="submit" style={{width: "100%"}}>Lưu</button>
                <button type="button" style={{width: "100%"}} onClick={() => setShowPasswordForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
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
