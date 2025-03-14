import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./RoomManagementPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel,} from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

const RoomManagementPage = () => {
  const [dummyRooms, setDummyRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/rooms");
        console.log("Dữ liệu phòng thi: ", response.data.rooms);

        setDummyRooms(response.data.rooms);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setRows(dummyRooms);
  }, [dummyRooms]);

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  // const [rows, setRows] = useState(Object.values(dummyRooms).flat());
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "#", width: 10, align: "center",headerAlign: "center", },
    { field: "roomName", headerName: "Tên phòng", width: 440 },
    { field: "roomLocation", headerName: "Địa điểm", width: 300 },
    { field: "roomCapacity", headerName: "Số lượng", width: 150, align: "center",headerAlign: "center", },
    {
      field: "roomStatus",align: "center", headerAlign: "center",
      headerName: "Trạng thái",
      width: 180,
      renderCell: (params) => (
        <Select
          value={params.row.roomStatus}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            fontSize: "15px", 
            padding: "0px", 
          }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác", align: "center",headerAlign: "center",
      width: 160,
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
  const inputRef = useRef(null);

  useEffect(() => {
  if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  const handleStatusChange = (id, newStatus) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, roomStatus: newStatus } : row))
    );
  };

  const [formData, setFormData] = useState({
    roomName: "",
    roomLocation: "",
    roomCapacity: "",
    roomStatus: "active",
  });

  const handleAddNew = () => {
    setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
    setFormData({
      roomName: "",
      roomLocation: "",
      roomCapacity: "",
      roomStatus: "active",
    });
    setTimeout(() => setShowForm(true), 0); // Đợi React cập nhật state rồi mới hiển thị form
  };

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

  const handleEdit = (account) => {
    setFormData({
      roomName: account.roomName,
      roomLocation: account.roomLocation,
      roomCapacity: account.roomCapacity,
      roomStatus: account.roomStatus,
    });
    setEditingAccount(account);
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

        Swal.fire({
          title: "Đã xóa!",
          text: "Tài khoản đã bị xóa.",
          icon: "success",
        });
        setRows(rows.filter((row) => row.id !== id));
      }
    });
  };

  return (
    <div className="room-page">
      <nav className="breadcrumb-container">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span> / </span>
        <span className="breadcrumb-current">Quản lý phòng thi</span>
      </nav>

      <div className="room-actions">
        <div className="search-container">
          <SearchBox></SearchBox>
        </div>
        <div className="role-selector">
          <button className="add-btn" onClick={handleAddNew}>
            Thêm mới
          </button>
        </div>
      </div>

      <div className="room-table-container ">
        <Paper sx={{width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            disableColumnResize
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tên phòng"
                  required
                  value={formData.roomName}
                  inputRef={inputRef}
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
                  label="Địa điểm"
                  required
                  value={formData.roomLocation}
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

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số lượng"
                  value={formData.roomCapacity}
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
                  label="Trạng thái"
                  required
                  value={formData.roomStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, roomStatus: e.target.value })
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
            </Grid>


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
    </div>
  );
};

export default RoomManagementPage;
