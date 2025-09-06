import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Grid, TextField, Button, Typography, IconButton, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import "./FormDivideStudent.css"
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";

const FormDivideStudent = ({ onClose }) => {
	const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [listGroupName, setListGroupName] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [listRoom, setListRoom] = useState([]);
  const [rawListRoom, setRawListRoom] = useState([]);
  const [selectedRole, setSelectedRole] = useState("supervisor");
  const [listSupervisor, setListSupervisor] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  const { organizeId, sessionId } = useParams();
  const [students, setStudents] = useState([]);
  const [previewInfo, setPreviewInfo] = useState({});
  const [previewList, setPreviewList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchGroupData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get('/groupUser', {
        params: { page, pageSize, keyword },
      });
      setListGroupName(
        response.data.groups.map(g => ({
          label: `${g.groupName} - ${g.listUser.length} thí sinh`,
          value: g.id,
          count: g.listUser.length,
        }))
      );
      setListUser(response.data.groups.flatMap(g => g.listUser));
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const fetchRoomData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get('/rooms/options', {
        params: {
          organizeExamId: organizeId,
          sessionId: sessionId,
        }
      });
      setRawListRoom(response.data);
      setListRoom(
        response.data.map(g => ({
          label: `${g.roomName} - ${g.roomCapacity} chỗ trống`,
          value: g.roomId,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const fetchSupvData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/users", {
        params: { page, pageSize, keyword, role: selectedRole },
      });

      setListSupervisor(
        response.data.users.map(g => ({
          label: `${g.fullName} - ${g.userCode}`,
          value: g.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const divideStudent = async (payload) => {
    setIsLoading(true);
    try {
      const response = await ApiService.post(
        `/organize-exams/${organizeId}/sessions/${sessionId}/rooms`,
        payload
      );
      return response.data; // trả dữ liệu về cho handleSubmit
    } catch (error) {
      //Bắt lỗi từ server (409, 400,...)
      if (error.response && error.response.data) {
        return error.response.data; //trả nguyên data lỗi cho handleSubmit
      }
      throw error; // các lỗi khác (mạng, 500,...)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
    fetchRoomData();
    fetchSupvData();
  }, []);

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  const [formData, setFormData] = useState({
    candidateList: "",
  });

  const preAddNew = () => {
    setFormData({
      candidateList: "",
    });
    setShowForm(true);
  };

  // State cho thông tin kỳ thi
  const [divideData, setDivideData] = useState({
    groupUserIds: [],
    roomIds: [
      {
        roomId: "",
        supervisorIds: [],
        quantity: "",
      }
    ],
  });
  
  // State cho các phòng thi (mặc định 2 phòng)
  const [rooms, setRooms] = useState([
    { roomIds: '', supervisorIds: [], quantity: '' },
    { roomIds: '', supervisorIds: [], quantity: '' },
  ]);
  
  const [selectedType, setSelectedType] = useState(null);
  const inputRef = useRef(null);

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Xử lý thêm ca thi mới
  const addRoom = () => {
    setRooms([...rooms, { roomIds: '', supervisorIds: [], quantity: '' }]);
  };
  
  // Xử lý xóa ca thi
  const removeRoom = (index) => {
    if (rooms.length > 1) {
      const newRoom = [...rooms];
      newRoom.splice(index, 1);
      setRooms(newRoom);
    }
  };
  
  // Xử lý thay đổi thông tin ca thi
  const handleSessionChange = (index, field, value) => {
    const newRoom = [...rooms];
    newRoom[index][field] = value;
    setRooms(newRoom);
  };
  
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

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra chọn nhóm
    if (!divideData.groupUserIds || divideData.groupUserIds.length === 0) {
      showToast("warning", "Vui lòng chọn nhóm thí sinh!", () => {
        document.getElementById(`groupUserSelect`)?.focus();
      });
      return;
    }

    // 2. Check phòng, giám thị, số lượng theo thứ tự trong từng phòng
    for (let i = 0; i < rooms.length; i++) {
      if (!selectedRooms[i]) {
        return showToast("warning", `Phòng ${i + 1} chưa chọn phòng thi!`, () => {
          document.getElementById(`roomSelect-${i}-input`)?.focus();
        });
      }

      if (!selectedSupervisors[i]) {
        return showToast("warning", `Phòng ${i + 1} chưa có giám thị!`, () => {
          document.getElementById(`supervisorSelect-${i}-input`)?.focus();
        });
      }

      if (!rooms[i].quantity || Number(rooms[i].quantity) <= 0) {
        return showToast("warning", `Phòng ${i + 1} chưa nhập số lượng thí sinh!`, () => {
          document.querySelectorAll("input[type=number]")[i]?.focus();
        });
      }
    }

    const payload = {
      groupUserIds: divideData.groupUserIds,
      roomIds: rooms.filter(room => room.roomIds && room.quantity).map(room => ({
        roomId: room.roomIds,
        supervisorIds: Array.isArray(room.supervisorIds) 
          ? room.supervisorIds 
          : [room.supervisorIds],
        quantity: room.quantity,
      })),
    };
    console.log("Submitting:", payload);
    // Gọi API ở đây
    try {
      const result = await divideStudent(payload);
      console.log("API result:", result);
      if (result.status && result.status.toLowerCase() === "success") {
        // ✅ Thành công
        showToast("success", "Chia phòng thi thành công!");
        navigate(`/staff/organize/${organizeId}/${sessionId}`, {
          state: { refresh: true },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: result.message || "Có lỗi xảy ra, vui lòng thử lại!",
        });
      }
    } catch (error) {
      console.error("Lỗi khi chia phòng thi:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };

  const handleSelectItem = (e, id) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(students.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const handleCreateGroup = () => {
    const currentPath = location.pathname;
    navigate(`/staff/groupuser`);
  };

  const handleRoomChange = (index, newValue) => {
    const newSessions = [...rooms];
    newSessions[index].roomIds = newValue?.value || ''; // gán phòng cho ca thi
    setRooms(newSessions);

    setSelectedRooms(prev => ({
      ...prev,
      [index]: newValue?.value || null, // lưu id phòng theo index
    }));
  };

  const handleSupervisorChange = (index, newValue) => {
    const newSessions = [...rooms];
    newSessions[index].supervisorIds = [newValue?.value || ''];
    setRooms(newSessions);

    setSelectedSupervisors(prev => ({
      ...prev,
      [index]: newValue?.value || null, // lưu id giám thị theo index
    }));
  };

  const convertDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const convertGender = (gender) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  const fetchUsersFromGroups = async (groupIds) => {
    try {
      const response = await ApiService.post('/groupUser/get-users-from-groups', { groupUserIds: groupIds });
      if (response.status === 200) {
        setStudents(response.data);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePreview = (index) => {
    if (!rooms[index]) return;

    // chuyển quantity sang số nguyên
    const quantity = parseInt(rooms[index].quantity, 10);

    // tính tổng quantity trước index
    const start = rooms
      .slice(0, index)
      .reduce((acc, r) => acc + parseInt(r.quantity || 0, 10), 0);

    // vị trí kết thúc
    const end = start + quantity;

    // cắt từ students
    const selected = students.slice(start, end);

    // set preview list
    setPreviewList(selected);
  };

  const handlePreviewInfo = (roomId) => {
    // tìm room tương ứng trong rawListRoom
    const room = rawListRoom.find(r => r.roomId === roomId);
    if (room) {
      setPreviewInfo({
        id: room.roomId,
        name: room.roomName,
        location: room.roomLocation,
        capacity: room.roomCapacity,
      });
    } else {
      setPreviewInfo({});
    }
  };

  const handleClickPreview = (session, index) => {
    if (session.roomIds !== "" && session.quantity !== "" && Number(session.quantity) > 0) {
      handlePreview(index);
      handlePreviewInfo(session.roomIds);

      const modalElement = document.getElementById(`roomDetailModal-${index}`);
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      showToast("warning", "Vui lòng nhập đầy đủ thông tin để xem trước");
      setPreviewInfo({});
      setPreviewList([]);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', marginTop: '20px'  }}>
        Chia phòng thi: Ca thi 1
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        {/* Phần thông tin kỳ thi */}
        <Box className="box-shadow-custom" sx={{ mb: 2, p: 2, pt: 1, border: '1px solid #eee', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              marginTop: '5px',
              '&:before': {
                content: '""',
                display: 'inline-block',
                width: '4px',
                height: '20px',
                backgroundColor: '#1976d2',
                marginRight: '10px',
                borderRadius: '2px',
              }
            }}>Danh sách phòng thi</Typography>
          	<Grid container spacing={2}>                  
              <Grid item xs={6}>
                <Autocomplete
                  multiple
                  required
                  id="groupUserSelect"
                  options={listGroupName}
                  onChange={(e, newValue) => {
                    const selectedIds = newValue.map(v => v.value);
                    const total = newValue.reduce((sum, g) => sum + (g.count || 0), 0);

                    setDivideData(prev => ({
                      ...prev,
                      groupUserIds: selectedIds,
                      totalStudents: total,  // ✅ lưu tổng số thí sinh
                    }));

                    fetchUsersFromGroups(selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn nhóm"
                      size=""
                      inputProps={{
                        ...params.inputProps,
                        id: `groupUserSelect`, // ✅ focus chính xác input
                      }}
                      sx={{
                        backgroundColor: '#ffff',
                        "& .MuiInputBase-root": {
                          
                        },
                        "& label": {
                          fontSize: "14px",
                        },
                        "& input": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: {
                        fontSize: "14px", // ✅ Cỡ chữ dropdown
                      },
                    },
                  }}
                />
              </Grid>
              <AddButton
                className='ms-1'
                onClick={handleCreateGroup}
                style={{
                  background: "#1976d2",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  width: "45px",
                  height: "45px",
                  cursor: "pointer",
                  marginTop: "20px"
                }}
                title="Tạo nhóm mới"
              >
                <i className="fas fa-plus"></i>              
              </AddButton>
            </Grid>
            <div className="form-check mt-3 mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="shuffleQuestion"
              />
              <label className="form-check-label" htmlFor="shuffleQuestion">
                Xếp ngẫu nhiên
              </label>
            </div>
            {rooms.map((session, index) => (
						<Box 
							key={index} 
							sx={{ 
								mb: 2, 
								p: 2, 
								pt: 1,
                mt: 3,
								border: '1px solid #eee', 
								borderRadius: '8px',
								position: 'relative',
                backgroundColor:'#F4F4F4',
							}}
						>
              <div className='mb-2' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography className='fw-bold' variant="subtitle1" sx={{ fontSize: "16px" }}>
                  Phòng thi {index + 1}
                </Typography>
                <p 
                  className='link-hover' 
                  style={{ margin: 0, color:'#0000FF' }}
                  // data-bs-toggle="modal"
                  // data-bs-target={`#roomDetailModal-${index}`}
                  onClick={() => handleClickPreview(session, index)}
                >
                  Xem trước
                </p>
              </div>
              {/* Modal Bootstrap */}

              <div className="modal fade " id={`roomDetailModal-${index}`} tabIndex="-1" aria-labelledby="roomDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                  <div className="modal-content p-3">
                    <div className="modal-header">
                      <h5 className="modal-title" id="roomDetailModalLabel">
                        Phòng {previewInfo.name || ''} - {previewInfo.location || ''} - {previewInfo.capacity || ''} chỗ ngồi
                      </h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="sample-card-header d-flex justify-content-between align-items-center mt-3 ms-3">
                      <div className='left-header d-flex align-items-center'>
                        <div className="search-box rounded d-flex align-items-center">
                          <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
                          <input
                            type="text"
                            className="search-input w-100"
                            placeholder="Tìm kiếm..."
                          />
                        </div>
                      </div>
                      <div className='right-header d-flex me-3'>
                        <AddButton onClick={preAddNew}>
                          <i className="fas fa-plus me-2"></i> Thêm mới
                        </AddButton>
                        <AddButton className='ms-2' style={{ backgroundColor: "#dc3545", color: "#ffff", }}>
                          <i className="fas fa-plus me-2"></i> Xóa
                        </AddButton>
                      </div>
                    </div>

                    <div className="modal-body">
                      {/* Table danh sách thí sinh */}
                      <div className="table-responsive table-wrapper" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table sample-table table-hover tbl-organize-hover">
                          <thead className="table-light">
                            <tr className="align-middle">
                              <th scope="col" className="text-center title-row" style={{ width: "50px"}}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  onChange={handleSelectAll}
                                  checked={students.length > 0 && students.every((item) => selectedItems.includes(item.id))}
                               />
                              </th>
                              <th scope="col">STT</th>
                              <th scope="col">MSSV</th>
                              <th scope="col">Họ và tên đệm</th>
                              <th scope="col">Tên</th>
                              <th scope="col">Ngày sinh</th>
                              <th scope="col">Giới tính</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewList.map((student, index) => (
                              <tr key={index}>
                                <td className=" text-center align-middle" style={{ width: "50px" }}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={(e) => handleSelectItem(e, student.id)}
                                    checked={selectedItems.includes(student.id)}
                                  />
                                </td>
                                <td className="align-middle">{index + 1}</td>
                                <td className="align-middle">{student.userCode}</td>
                                <td className="align-middle">{student.lastName}</td>
                                <td className="align-middle">{student.firstName}</td>
                                <td className="align-middle">{convertDate(student.dateOfBirth)}</td>
                                <td className="align-middle">{convertGender(student.gender)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              </div>

							<Grid container spacing={2} alignItems="center">
								<Grid item xs={4}>
                  <Autocomplete
                    id="roomSelect"
                    options={
                      listRoom.filter(
                        (room) =>
                          // chỉ hiển thị phòng chưa chọn hoặc là phòng đang chọn của ca hiện tại
                          !Object.values(selectedRooms).includes(room.value) ||
                          selectedRooms[index] === room.value
                      )
                    }
                    value={listRoom.find((room) => room.value === selectedRooms[index]) || null}
                    onChange={(e, newValue) => handleRoomChange(index, newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn phòng thi"
                        size="small"
                        inputProps={{
                          ...params.inputProps,
                          id: `roomSelect-${index}-input`, // ✅ focus chính xác input
                        }}
                        sx={{
                          backgroundColor: '#ffff',
                          "& .MuiInputBase-root": {
                            height: "40px",
                          },
                          "& label": {
                            fontSize: "14px",
                          },
                          "& input": {
                            fontSize: "14px",
                          },
                        }}
                      />
                    )}
                    slotProps={{
                      paper: {
                        sx: {
                          fontSize: "14px", // ✅ Cỡ chữ dropdown
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
									<Autocomplete
                    id={`supervisorSelect-${index}`}
                    options={
                      listSupervisor.filter(
                        (sup) =>
                          // chỉ hiển thị giám thị chưa chọn hoặc là giám thị đang chọn của ca hiện tại
                          !Object.values(selectedSupervisors).includes(sup.value) ||
                          selectedSupervisors[index] === sup.value
                      )
                    }
                    value={listSupervisor.find((sup) => sup.value === selectedSupervisors[index]) || null}
                    onChange={(e, newValue) => handleSupervisorChange(index, newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Giám thị"
                        size="small"
                        inputProps={{
                          ...params.inputProps,
                          id: `supervisorSelect-${index}-input`, // ✅ focus chính xác input
                        }}
                        sx={{
                          backgroundColor: '#ffff',
                          "& .MuiInputBase-root": {
                            height: "40px",
                          },
                          "& label": {
                            fontSize: "14px",
                          },
                          "& input": {
                            fontSize: "14px",
                          },
                        }}
                      />
                    )}
                    slotProps={{
                      paper: {
                        sx: {
                          fontSize: "14px", // ✅ Cỡ chữ dropdown
                        },
                      },
                    }}
                  />
								</Grid>
								
								<Grid item xs={3.5}>
									<TextField
										fullWidth
                    disabled={divideData.totalStudents === 0}
										label= "Số lượng thí sinh"
                    type='number'
										value={session.quantity}
										onChange={(e) => {
                      const value = Number(e.target.value);

                      // check vượt quá
                      if (value > (divideData.totalStudents || 0)) {
                        showToast("warning", `Số lượng không được vượt quá ${divideData.totalStudents} thí sinh`);
                        return; // ❌ không update state khi nhập sai
                      }

                      handleSessionChange(index, "quantity", value);
                    }}
										sx={{
											"& .MuiInputBase-input": { 
												fontSize: "14px", 
												padding: "8px 12px",
                        backgroundColor: '#ffff',
											},
											"& .MuiInputLabel-root": {
												fontSize: "14px",
												width: "100%",
												left: "0",
												top: "-5px",
												"&.Mui-focused": {
													transform: "translate(13px, -3px) scale(0.75)",
												},
											},
											"& .MuiInputBase-root": {
												height: "40px",
												fontSize: "14px",
											},
										}}                   
									/>
								</Grid>
								
								<Grid item xs={0.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
									{rooms.length > 1 && (
										<IconButton
											onClick={() => removeRoom(index)}
											sx={{ 
												color: 'error.main',
												padding: '0px',
                        width: 38,
                        height: 38,
												'&:hover': {
													backgroundColor: 'rgba(244, 67, 54, 0.08)'
												},
											}}
										>
											{/* <button className="btn btn-danger btn-sm " style={{ width: "38px", height: "38px" }}> */}
												<i className="fas fa-trash-alt"></i>
											{/* </button> */}
											{/* <DeleteIcon fontSize="small" /> */}
										</IconButton>
									)}
								</Grid>
							</Grid>
						</Box>
					))}
          <CancelButton type="button" style={{padding: "10px"}} onClick={addRoom}>
            <i className="fas fa-plus me-2"></i>
            Thêm phòng thi
          </CancelButton>
          {/* Đường phân cách */}
          <Box sx={{ 
            borderBottom: '1px solid #e0e0e0', 
            mb: 2,
            mt: 2,
            width: '100%'
          }} />
          {/* Nút submit */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <CancelButton onClick={onClose} type="button">
              Hủy
            </CancelButton>
            <AddButton >
              <i className="fas fa-plus me-2"></i> Chia phòng thi
            </AddButton>
          </Box>
        </Box>	
      </Box>
      {/* Form thêm tài khoản */}
      {showForm && (
        <div 
          className="form-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)", // mờ nền modal
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000, 
          }}
        >
          <Box
            component="form"
            sx={{
              width: "500px",
              backgroundColor: "white",
              p: 3,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
              zIndex: "99999",
            }}
            onSubmit={handleSubmit}
          >
            <p className="fw-bold mb-4">Thêm thí sinh vào phòng thi</p>
            <Grid container>	
              <Grid item xs={12}>									
                <TextField
                  id="outlined-multiline-flexible"
                  label="Nhập mã sinh viên"
                  placeholder="Nhập mã sinh viên"
                  multiline
                  inputRef={inputRef}
                  maxRows={10}
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>	
            </Grid>		
            {/* Buttons */}
            <Grid container spacing={2} sx={{ mt: 1, justifyContent: "flex-end" }}>
              <Grid item xs={3}>
                <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>
                  Hủy
                </CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>
                  Lưu
                </AddButton>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}
    </div>
  );
};

FormDivideStudent.propTypes = {
	onClose: PropTypes.func.isRequired,
};

export default FormDivideStudent;