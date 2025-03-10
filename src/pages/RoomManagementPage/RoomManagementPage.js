import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RoomManagementPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel,} from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";

const dummyAccounts = [
    {id: 1, studentId: "BIT220079",
        roomName: "Nguyễn Thu",
        location: "An",
        capacity: "01/01/2000",
        status: "active",},
    {id: 2, studentId: "BIT220079",
        roomName: "Nguyễn Thu",
        location: "An",
        capacity: "01/01/2000",
        status: "active",},
    {id: 3, studentId: "BIT220079",
        roomName: "Nguyễn Thu",
        location: "An",
        capacity: "01/01/2000",
        status: "active",},
    {id: 4, studentId: "BIT220079",
        roomName: "Nguyễn Thu",
        location: "An",
        capacity: "01/01/2000",
        status: "active",},
];

const RoomManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [rows, setRows] = useState(Object.values(dummyAccounts).flat());

  const columns = [
    { field: "id", headerName: "#", width: 10 },
    { field: "roomName", headerName: "Tên phòng", width: 440 },
    { field: "location", headerName: "Địa điểm", width: 300 },
    { field: "capacity", headerName: "Số lượng", width: 150 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 160,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          size="small" // ✅ Làm nhỏ dropdown
          sx={{
            minWidth: 120, // ✅ Giới hạn chiều rộng
            fontSize: "15px", // ✅ Chữ nhỏ hơn
            padding: "0px", // ✅ Giảm padding
          }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const permissionOptions = [
    "Quản lý kỳ thi",
    "Quản lý ngân hàng câu hỏi",
    "Quản lý đề thi",
    "Quản lý ma trận đề thi",
    "Quản lý phòng thi",
  ];
  useEffect(() => {
    // Chuyển đổi object thành mảng
    const mergedRows = Object.values(dummyAccounts).flat();
    setRows(mergedRows);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    dob: "",
    gender: "Nam",
    username: "",
    password: "",
    status: "active",
    permissions: [],
  });

  const handleAddNew = () => {
    setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
    setFormData({
      studentId: "",
      name: "",
      dob: "",
      gender: "Nam",
      username: "",
      password: "",
      status: "active",
      permissions: [],
    });
    setTimeout(() => setShowForm(true), 0); // Đợi React cập nhật state rồi mới hiển thị form
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
      studentId: account.studentId,
      name: account.name,
      dob: account.dob,
      gender: account.gender,
      username: account.username,
      password: "", // Không hiển thị mật khẩu
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
    // Thêm logic xóa tài khoản tại đây (gọi API hoặc cập nhật state)
    setShowDeleteModal(false); // Đóng modal sau khi xóa
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
        // Xóa tài khoản ở đây (ví dụ: gọi API hoặc cập nhật state)
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

  return (
    <div className="account-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span> / </span>
        <span className="breadcrumb-current">Quản lý phòng thi</span>
      </nav>

      {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
      <div className="account-actions">
        <div className="search-container">
          <SearchBox></SearchBox>
        </div>
        <div className="role-selector">
          <button className="add-btn" onClick={handleAddNew}>
            Thêm mới
          </button>
          <button
            className="change-password-btn"
            onClick={() => setShowPasswordForm(true)}
          >
            Đổi mật khẩu
          </button>
          <button className="upload-btn" onClick={handleUploadClick}>
            Upload File
          </button>
        </div>
      </div>

      <div className="account-table-container mt-3">
        <Paper sx={{width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
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

      {/* Form thêm tài khoản */}
      {showForm && (
        <div className="form-overlay">
          <Box
            component="form"
            sx={{
              width: "600px",
              backgroundColor: "white",
              p: 2,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <p className="text-align fw-bold">
              {editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </p>

            <Grid container spacing={2}>
              {/* Mã và Họ Tên */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã"
                  required
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
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
            <Grid container spacing={2} sx={{ mt: 2 }}>
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
          <div className="form-container">
            <h3>Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit}>
              <label>Chọn vai trò:</label>
              <select
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
                type="password"
                required
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setShowPasswordForm(false)}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagementPage;
