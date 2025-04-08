import React, { useState, useRef } from 'react';
import { Box, Grid, TextField, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ReactSelect from 'react-select';

const ExamCreationPage = () => {
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
  
  // Options cho các select
  const subjectOptions = [/*...*/];
  const typeOptions = [/*...*/];
  const questionBankOptions = [/*...*/];
  
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
    <Box sx={{}}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2',  }}>
			Tạo kỳ thi mới
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        {/* Phần thông tin kỳ thi */}
        <Box sx={{ mb: 2, p: 2, pt: 1, border: '1px solid #eee', borderRadius: '8px' }}>
				<Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            '&:before': {
              content: '""',
              display: 'inline-block',
              width: '4px',
              height: '20px',
              backgroundColor: '#1976d2',
              marginRight: '10px',
              borderRadius: '2px'
            }
          }}>            Thông tin kỳ thi
          </Typography>
          
          <Grid container spacing={2}>
					<Grid item xs={12}>
					<TextField
						fullWidth
						label="Tên kỳ thi"
						required
						value={examData.organizeExamName}
						inputRef={inputRef}
						onChange={(e) => setExamData({...examData, organizeExamName: e.target.value})}
						sx={{
							"& .MuiInputBase-input": { 
								fontSize: "14px", 
								padding: "8px 12px", // Thêm padding để text không dính sát viền
							},
							"& .MuiInputLabel-root": {
								fontSize: "14px",
								width: "100%",
								left: "0",
								top: "2px", // Đã điều chỉnh từ 0px lên 10px
								"&.Mui-focused": {
									transform: "translate(13px, -3px) scale(0.75)", // Điều chỉnh khi focus
								},
							},
							"& .MuiInputBase-root": {
								height: "40px",
								fontSize: "14px",
								marginTop: "8px", // Thêm margin top để tạo khoảng cách
							},
						}}
					/>
				</Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thời lượng (phút)"
                type="number"
                required
                value={examData.duration}
                onChange={(e) => setExamData({...examData, duration: e.target.value})}
                sx={{
									"& .MuiInputBase-input": { 
										fontSize: "14px", 
										padding: "8px 12px", // Thêm padding để text không dính sát viền
									},
									"& .MuiInputLabel-root": {
										fontSize: "14px",
										width: "100%",
										left: "0",
										top: "-5px", // Đã điều chỉnh từ 0px lên 10px
										"&.Mui-focused": {
											transform: "translate(13px, -3px) scale(0.75)", // Điều chỉnh khi focus
										},
									},
									"& .MuiInputBase-root": {
										height: "40px",
										fontSize: "14px",
									},
								}}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Điểm tối đa"
                type="number"
                required
                value={examData.maxScore}
                onChange={(e) => setExamData({...examData, maxScore: e.target.value})}
                sx={{
									"& .MuiInputBase-input": { 
										fontSize: "14px", 
										padding: "8px 12px", // Thêm padding để text không dính sát viền
									},
									"& .MuiInputLabel-root": {
										fontSize: "14px",
										width: "100%",
										left: "0",
										top: "-5px", // Đã điều chỉnh từ 0px lên 10px
										"&.Mui-focused": {
											transform: "translate(13px, -3px) scale(0.75)", // Điều chỉnh khi focus
										},
									},
									"& .MuiInputBase-root": {
										height: "40px",
										fontSize: "14px",
									},
								}}
              />
            </Grid>
            
            <Grid item xs={6}>
              <ReactSelect
                className="basic-single"
                classNamePrefix="select"
                placeholder="Chọn phân môn"
                options={subjectOptions}
                onChange={(selectedOption) => 
                  setExamData({...examData, subjectId: selectedOption?.value})
                }
                styles={{
									control: (base) => ({
										...base,
										height: "40px",        // Chiều cao tổng thể
										fontSize: "14px",
									}),
									valueContainer: (base) => ({
										...base,
										height: "40px",
										padding: "0 8px",       // Tuỳ chỉnh padding nếu cần
										display: "flex",
										alignItems: "center",   // Căn giữa nội dung theo chiều dọc
									}),
									indicatorsContainer: (base) => ({
										...base,
										height: "40px",
									}),
									menu: (base) => ({
										...base,
										zIndex: 9999,
									}),
								}}								
              />
            </Grid>
            
            <Grid item xs={6}>
              <ReactSelect
                className="basic-single"
                classNamePrefix="select"
                placeholder="Chọn loại"
                options={typeOptions}
                value={typeOptions.find(option => option.value === selectedType)}
                onChange={(selected) => {
                  setSelectedType(selected?.value || null);
                  setExamData({...examData, examType: selected?.value || null});
                }}
                styles={{
									control: (base) => ({
										...base,
										height: "40px",        // Chiều cao tổng thể
										fontSize: "14px",
									}),
									valueContainer: (base) => ({
										...base,
										height: "40px",
										padding: "0 8px",       // Tuỳ chỉnh padding nếu cần
										display: "flex",
										alignItems: "center",   // Căn giữa nội dung theo chiều dọc
									}),
									indicatorsContainer: (base) => ({
										...base,
										height: "40px",
									}),
									menu: (base) => ({
										...base,
										zIndex: 9999,
									}),
								}}
              />
            </Grid>
            
            {selectedType === "auto" && (
              <>
                <Grid item xs={6}>
                  <ReactSelect
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Bộ câu hỏi"
                    options={questionBankOptions}
                    onChange={(selectedOption) => 
                      setExamData({...examData, questionBankId: selectedOption?.value})
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: "48px",
                        fontSize: "14px",
                      }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Số lượng câu hỏi"
                    type="number"
                    required
                    value={examData.totalQuestions}
                    onChange={(e) => 
                      setExamData({...examData, totalQuestions: e.target.value})
                    }
                    sx={{
                      "& .MuiInputBase-input": { fontSize: "14px", paddingBottom: "11px" },
                      "& .MuiInputLabel-root": { fontSize: "14px" },
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        
        {/* Phần thông tin các ca thi */}
        <Box sx={{ mb: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '""',
                display: 'inline-block',
                width: '4px',
                height: '20px',
                backgroundColor: '#1976d2',
                marginRight: '10px',
                borderRadius: '2px'
              }
            }}>
              Danh sách ca thi
            </Typography>
            
          </Box>
          
          {sessions.map((session, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 2, 
                p: 2, 
                pt: 1,
                border: '1px solid #eee', 
                borderRadius: '8px',
                position: 'relative'
              }}
            >
              {sessions.length > 1 && (
                <IconButton
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                    color: 'error.main'
                  }}
                  onClick={() => removeSession(index)}
                >
									<button className="btn btn-danger btn-sm ms-2" style={{ width: "30px", height: "30px" }}>
													<i className="fas fa-trash-alt"></i>
												</button>
                  {/* <DeleteIcon fontSize="small" /> */}
                </IconButton>
              )}
              
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Ca thi {index + 1}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={`Tên ca thi ${index + 1}`}
                    required
                    value={session.sessionName}
                    onChange={(e) => 
                      handleSessionChange(index, 'sessionName', e.target.value)
                    }
										sx={{
											"& .MuiInputBase-input": { 
												fontSize: "14px", 
												padding: "8px 12px", // Thêm padding để text không dính sát viền
											},
											"& .MuiInputLabel-root": {
												fontSize: "14px",
												width: "100%",
												left: "0",
												top: "-5px", // Đã điều chỉnh từ 0px lên 10px
												"&.Mui-focused": {
													transform: "translate(13px, -3px) scale(0.75)", // Điều chỉnh khi focus
												},
											},
											"& .MuiInputBase-root": {
												height: "40px",
												fontSize: "14px",
											},
										}}                   
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label={`Thời gian bắt đầu ca ${index + 1}`}
                      value={session.activeAt ? dayjs(session.activeAt) : null}
                      onChange={(newValue) => 
                        handleSessionChange(index, 'activeAt', newValue ? newValue.toISOString() : '')
                      }
                      sx={{ width: '100%' }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            "& .MuiInputBase-input": { 
												fontSize: "14px", 
												padding: "8px 12px", // Thêm padding để text không dính sát viền
											},
											"& .MuiInputLabel-root": {
												fontSize: "14px",
												width: "100%",
												left: "0",
												top: "-5px", // Đã điều chỉnh từ 0px lên 10px
												"&.Mui-focused": {
													transform: "translate(13px, -3px) scale(0.75)", // Điều chỉnh khi focus
												},
											},
											"& .MuiInputBase-root": {
												height: "40px",
												fontSize: "14px",
											},
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
				<button className="btn btn-primary" style={{fontSize: "14px"}} onClick={addSession}>
					<i className="fas fa-plus me-2"></i>
					Thêm ca thi
				</button>
        {/* Nút submit */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="secondary">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Tạo kỳ thi
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ExamCreationPage;