import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
  const [selectedRole, setSelectedRole] = useState("supervisor");
  const [listSupervisor, setListSupervisor] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [selectedSupervisors, setSelectedSupervisors] = useState({});

  const students = [
    {
      id: "123456789",
      mssv: "BIT220172",
      ho: "Phạm Thị Phương",
      ten: "Linh",
      ngaySinh: "08/01/2004",
      gioiTinh: "Nữ",
      dieuKien: "Đủ"
    },
    {
      id: "1234567890",
      mssv: "BIT220173",
      ho: "Hoàng Nguyên",
      ten: "Vũ",
      ngaySinh: "10/05/2004",
      gioiTinh: "Nữ",
      dieuKien: "Đủ"
    },
    {
      id: "1234567891",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    },
    {
      id: "1234567892",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    },
    {
      id: "1234567893",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    },
    {
      id: "1234567894",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    },
    {
      id: "1234567895",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    },
    {
      id: "1234567896",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    },
    {
      id: "1234567897",
      mssv: "BIT220174",
      ho: "Ngô Đức",
      ten: "Thuận",
      ngaySinh: "12/12/2003",
      gioiTinh: "Nam",
      dieuKien: "Không"
    }
  ];
  
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
      const response = await ApiService.get('/rooms/get-options', {
      });
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
  const [examData, setExamData] = useState({
    organizeExamName: '',
    duration: '',
    maxScore: '',
    subjectId: null,
    examType: null,
    questionBankId: null,
    totalQuestions: '',
  });
  
  // State cho các ca thi (mặc định 2 ca)
  const [sessions, setSessions] = useState([
    { sessionName: '', activeAt: '' },
    { sessionName: '', activeAt: '' }
  ]);
  
  const [selectedType, setSelectedType] = useState(null);
  const inputRef = useRef(null);

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Xử lý thêm ca thi mới
  const addSession = () => {
    setSessions([...sessions, { sessionName: '', activeAt: '' }]);
  };
  
  // Xử lý xóa ca thi
  const removeSession = (index) => {
    if (sessions.length > 1) {
      const newSessions = [...sessions];
      newSessions.splice(index, 1);
      setSessions(newSessions);
    }
  };
  
  // Xử lý thay đổi thông tin ca thi
  const handleSessionChange = (index, field, value) => {
    const newSessions = [...sessions];
    newSessions[index][field] = value;
    setSessions(newSessions);
  };
  
  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...examData,
      sessions: sessions.filter(session => session.sessionName && session.activeAt)
    };
    console.log('Submitting:', payload);
    // Gọi API ở đây
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
    const newSessions = [...sessions];
    newSessions[index].room = newValue; // gán phòng cho ca thi
    setSessions(newSessions);

    setSelectedRooms(prev => ({
      ...prev,
      [index]: newValue?.value || null, // lưu id phòng theo index
    }));
  };

  const handleSupervisorChange = (index, newValue) => {
    const newSessions = [...sessions];
    newSessions[index].supervisor = newValue; // gán giám thị cho ca thi
    setSessions(newSessions);

    setSelectedSupervisors(prev => ({
      ...prev,
      [index]: newValue?.value || null, // lưu id giám thị theo index
    }));
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
                  id="tags-outlined"
                  options={listGroupName || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn nhóm"
                      size=""
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
            {sessions.map((session, index) => (
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
                  data-bs-toggle="modal"
                  data-bs-target="#roomDetailModal"
                >
                  Chi tiết
                </p>
              </div>
              {/* Modal Bootstrap */}  
              <div className="modal fade " id="roomDetailModal" tabIndex="-1" aria-labelledby="roomDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                  <div className="modal-content p-3">
                    <div className="modal-header">
                      <h5 className="modal-title" id="roomDetailModalLabel">
                        Phòng 101 - CS01 - 30 thí sinh
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
                              <th scope="col">Điều kiện</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, index) => (
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
                                <td className="align-middle">{student.mssv}</td>
                                <td className="align-middle">{student.ho}</td>
                                <td className="align-middle">{student.ten}</td>
                                <td className="align-middle">{student.ngaySinh}</td>
                                <td className="align-middle">{student.gioiTinh}</td>
                                <td className="align-middle">{student.dieuKien}</td>
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
										label= "Số lượng thí sinh"
										required
                    type='number'
										value={session.sessionName}
										onChange={(e) => handleSessionChange(index, 'sessionName', e.target.value)}
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
									{sessions.length > 1 && (
										<IconButton
											onClick={() => removeSession(index)}
											sx={{ 
												color: 'error.main',
												padding: '0px',
												'&:hover': {
													backgroundColor: 'rgba(244, 67, 54, 0.08)'
												}
											}}
										>
											<button className="btn btn-danger btn-sm " style={{ width: "38px", height: "38px" }}>
												<i className="fas fa-trash-alt"></i>
											</button>
											{/* <DeleteIcon fontSize="small" /> */}
										</IconButton>
									)}
								</Grid>
							</Grid>
						</Box>
					))}
          <CancelButton style={{padding: "10px"}} onClick={addSession}>
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