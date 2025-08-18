import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, MenuItem, Pagination, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel,} from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Add } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./RoomTest.css";

const RoomTest = () => {
  const [listRoom, setListRoom] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const inputRef = useRef(null);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/rooms", {
        params: { keyword, page, pageSize },
      });
      setListRoom(response.data.rooms);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  const createRoom = async (room) => {
    setIsLoading(true);
    try {
      await ApiService.post("/rooms", room);
      fetchData();
    } catch (error) {
      console.error("Failed to create room: ", error);
    }
    setIsLoading(false);
  };

  const updateRoom = async (room) => {
    setIsLoading(true);
    try {
      const response = await ApiService.put(`/rooms/${room.id}`, room);
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
    roomStatus: "available",
  });

  const handleAddNew = () => {
    setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
    setFormData({
      roomName: "",
      roomLocation: "",
      roomCapacity: "",
      roomStatus: "available",
    });
    setTimeout(() => setShowForm(true), 0); // Đợi React cập nhật state rồi mới hiển thị form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await updateRoom({ ...editingAccount, ...formData });
        Swal.fire({
          icon: "success",
          title: "Cập nhật phòng thành công",
          draggable: true
        });
        setShowForm(false);
      } else {
        // Thêm mới dữ liệu
        await createRoom(formData);
        Swal.fire({
          icon: "success",
          title: "Tạo phòng thành công",
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

  const handleEdit = (id) => {
    setFormData({
      roomName: id.roomName,
      roomLocation: id.roomLocation,
      roomCapacity: id.roomCapacity,
      roomStatus: id.roomStatus,
    });
    setEditingAccount(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
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
          await ApiService.delete(`/rooms/delete-room/${id}`);
          fetchData();
          Swal.fire({
            title: "Đã xóa!",
            text: "Phòng đã bị xóa thành công",
            icon: "success",
          });
        }
        catch (error) {
          console.error("Failed to delete room: ", error);
        }
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    Swal.fire({
      title: "Bạn có chắc muốn thay đổi trạng thái?",
      text: "Trạng thái sẽ được cập nhật ngay sau khi xác nhận!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newStatus = currentStatus.toLowerCase() === "available" ? "unavailable" : "available";
        const statusLabel = newStatus === "available" ? "Hoạt động" : "Đã đóng";

        try {
          const response = await ApiService.put(`/rooms/${id}`, { roomStatus: newStatus });
  
          Swal.fire({
            title: "Cập nhật thành công!",
            text: `Trạng thái đã chuyển sang "${statusLabel}".`,
            icon: "success",
          });

          fetchData();
        } catch (error) {
          console.error("Failed to update room status:", error);

          Swal.fire({
            title: "Lỗi",
            text: "Không thể cập nhật trạng thái phòng. Vui lòng thử lại.",
            icon: "error",
          });
        }
      }
    });
  };

  const convertStatus = (status) => {
    switch (status) {
      case "available":
        return { label: "Hoạt động", className: "bg-primary" };
      case "unavailable":
        return { label: "Đã đóng", className: "bg-secondary" };
    }
  };

  const [date, setDate] = useState(new Date());

  const events = [
    {
      title: "Kết thúc học phần - Giải tích - VPC2-204",
      start: "2025-07-21T09:45:00",
      end: "2025-07-21T12:25:00",
    },
    {
      title: "Kết thúc học phần - Giải tích - VPC2-204",
      start: "2025-07-26T09:45:00",
      end: "2025-07-26T11:00:00",
    },
  ];
  return (
    <div className="p-4">
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý phòng thi</span>
      </nav>

      <div className="container">
        <div className="row">
          <div className="tbl-shadow p-3 col-5">
            <div className="sample-card-header d-flex justify-content-between align-items-center mb-3">
              <div className='left-header d-flex align-items-center'>
                <div className="search-box me-2 rounded d-flex align-items-center">
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
                <AddButton onClick={handleAddNew}>
                  <i className="fas fa-plus me-2"></i>
                  Thêm mới
                </AddButton>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table sample-table table-hover tbl-organize-hover">
                <thead>
                  <tr className="align-middle">
                    <th className="text-center" style={{ width: "40px"}}>STT</th>
                    <th>Phòng</th>
                    {/* <th>Địa chỉ</th> */}
                    <th className="text-center">Sức chứa</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center" style={{ width: "75px"}}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                {listRoom.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center fw-semibold text-muted"
                          style={{ height: "100px", verticalAlign: "middle" }}>
                      Không có dữ liệu
                  </td>
                </tr>
                ) : (
                  listRoom.map((item, index) => (
                    <tr key={item.id} className="align-middle">
                      <td className=" text-center" style={{ width: "50px" }}>{index + 1}</td>
                      <td>{item.roomName}</td>
                      {/* <td>{item.roomLocation}</td> */}
                      <td className="text-center">{item.roomCapacity}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <span className={`badge ms-2 mt-1 ${convertStatus(item.roomStatus).className}`}>
                            {convertStatus(item.roomStatus).label}
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
                          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
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
                            <li className="tbl-action" onClick={() => handleToggleStatus(item.id, item.roomStatus)}>
                              <button
                                className="dropdown-item tbl-action"
                                onClick={() =>
                                  handleToggleStatus(item.id, item.roomStatus)
                                }
                              >
                                {item.roomStatus.toLowerCase() === "available"
                                  ? "Đóng"
                                  : "Kích hoạt"}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>

            <div className="sample-pagination d-flex justify-content-end align-items-center">
                {/* <Pagination count={10} color="primary" shape="rounded"/>         */}
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
          <div className="col-7 pe-0">
            <div className="tbl-shadow">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                slotMinTime="06:00:00"
                slotMaxTime="20:00:00"
                events={events.map(e => ({
                  ...e,
                  extendedProps: { fullTitle: e.title } // lưu full title
                }))}
                eventDidMount={(info) => {
                  // Thêm tooltip native
                  info.el.setAttribute("title", info.event.extendedProps.fullTitle);
                }}
                allDaySlot={false}
                height="auto"
                headerToolbar={{
                  left: "prev",
                  center: "title",
                  right: "next"
                }}
                titleFormat={{ year: 'numeric', month: 'short' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form thêm tài khoản */}
      {showForm && (
        <div className="form-overlay">
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
              <p className="fw-bold p-4 pb-0" style={{fontSize: "18px"}}>
                {editingAccount ? "Chỉnh sửa thông tin phòng thi" : "Thêm phòng thi"}
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
                  label="Tên phòng"
                  required
                  value={formData.roomName}
                  inputRef={inputRef}
                  onChange={(e) =>
                    setFormData({ ...formData, roomName: e.target.value })
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
                  fullWidth
                  label="Địa điểm"
                  required
                  value={formData.roomLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, roomLocation: e.target.value })
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
                  fullWidth
                  label="Số lượng chỗ ngồi"
                  type="number"
                  value={formData.roomCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, roomCapacity: e.target.value })
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

            {/* Buttons */}
            <Grid container spacing={2} sx={{justifyContent:"flex-end", p: 3, pt: 1  }}>
              <Grid item xs={3}>
                <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>Hủy</CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </AddButton>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomTest;
