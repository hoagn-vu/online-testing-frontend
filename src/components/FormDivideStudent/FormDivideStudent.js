import React, { useState, useRef, useEffect } from 'react';
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

const FormDivideStudent = ({ onClose }) => {
	const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
	const monList = [
    { label: "Toán" },
    { label: "Văn" },
    { label: "Anh" },
  ];

  const nhomList = [
    { label: "22IT1 - 100 thí sinh" },
    { label: "22AI2 - 45 thí sinh" },
    { label: "23IT1 - 50 thí sinh" },
  ];
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
  
  return (
    <Box>
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
                  options={nhomList || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn nhóm"
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
                <p className='link-hover' style={{ margin: 0, color:'#0000FF' }}>Chi tiết</p>
              </div>

							
							
							<Grid container spacing={2} alignItems="center">
								<Grid item xs={4}>
                  <Autocomplete
                    options={monList || []}
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
                    options={monList || []}
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
    </Box>
  );
};

FormDivideStudent.propTypes = {
	onClose: PropTypes.func.isRequired,
	typeOptions: PropTypes.array.isRequired,
	questionBankOptions: PropTypes.func.isRequired,
	subjectOptions: PropTypes.func.isRequired,
};

export default FormDivideStudent;