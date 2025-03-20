import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./RoomManagementPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, MenuItem, Pagination, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel,} from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

const RoomManagementPage = () => {
  const [listRoom, setListRoom] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/rooms");
        setListRoom(response.data.rooms);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu: ", error);
      }
    };
    fetchData();
  }, []);

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
      setSelectedItems(listRoom.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
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

      <div className="sample-card-header d-flex justify-content-between align-items-center mt-3 mb-3">
        <div className='left-header d-flex align-items-center'>
          <div className="search-box me-2 rounded d-flex align-items-center">
            <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
            <input
              type="text"
              className="search-input w-100"
              placeholder="Tìm kiếm..."
              // value={searchTerm}
              // onChange={handleChangeSearch}
            />
          </div>
        </div>

        <div className='right-header'>
          <button className="btn btn-primary me-2" onClick={handleAddNew}>
            <i className="fas fa-plus me-2"></i>
            Thêm mới
          </button>
        </div>
      </div>

<<<<<<< Updated upstream
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
            localeText={{
              noRowsLabel: "Không có dữ liệu", // ✅ Đổi text mặc định của DataGrid
            }}
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
        </Paper>
=======
      <div className="table-responsive">
        <table className="table sample-table table-hover">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="text-center title-row" style={{ width: "50px"}}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === listRoom.length && listRoom.length > 0}
                />
              </th>
              <th scope="col" className="title-row">Tên phòng</th>
              <th scope="col" className="title-row">Địa chỉ</th>
              <th scope="col" className="title-row">Số lượng chỗ ngồi</th>
              <th scope="col" className="title-row">Trạng thái</th>
              <th scope="col" className="title-row" style={{ width: "120px"}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listRoom.map((item, index) => (
              <tr key={item.id} className="align-middle">
                <td className=" text-center" style={{ width: "50px" }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => handleSelectItem(e, item.questionBankId)}
                    checked={selectedItems.includes(item.questionBankId)}
                  />
                </td>
                <td className="fw-semibold text-hover-primary">
                  {item.roomName}
                </td>
                <td className="fw-semibold text-hover-primary">{item.roomLocation	}</td>
                <td>{item.roomCapacity}</td>
                <td>{item.roomStatus}</td>
                <td>
                  <button className="btn btn-primary btn-sm">
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

      <div className="sample-pagination d-flex justify-content-end align-items-center">
        <Pagination count={10} variant="outlined" shape="rounded" />
>>>>>>> Stashed changes
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
