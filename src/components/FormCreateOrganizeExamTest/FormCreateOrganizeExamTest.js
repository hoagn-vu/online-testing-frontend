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
import "./FormCreateOrganizeExamTest.css"
import AddButton from "../AddButton/AddButton";
import CancelButton from "../CancelButton/CancelButton";
import ApiService from "../../services/apiService";

const FormCreateOrganizeExamTest = ({ onClose, typeOptions}) => {
	const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [questionBankOptions, setQuestionBankOptions] = useState([]);
	const [matrixOptions, setMatrixOptions] = useState([]);
  // const [sessions, setSessions] = useState([]);
  // State cho thông tin kỳ thi
  const [examData, setExamData] = useState({
    organizeExamName: '',
    duration: '',
    maxScore: '',
    subjectId: null,
    examType: null,
    questionBankId: null,
    totalQuestions: null,
		sessions: []
  });

	useEffect(() => {
		const fetchSubjectOptions = async () => {
			try {
				const response = await ApiService.get("/subjects");
				setSubjectOptions(response.data.subjects.map((subject) => ({
					value: subject.id,
					label: subject.subjectName,
				})));
			} catch (error) {
				console.error("Failed to fetch subjects", error);
			}
		};
		fetchSubjectOptions();
	}, []);

	const fetchQuestionBankOptions = async (type, subjectId) => {
		if (type !== "auto") {
			setQuestionBankOptions([]);
			return;
		}
		try {
			const response = await ApiService.get("/subjects/question-bank-options", {
				params: { subjectId: subjectId },
			});

			setQuestionBankOptions(response.data.map((questionBank) => ({
				value: questionBank.questionBankId,
				label: questionBank.questionBankName,
			})));
		} catch (error) {
			console.error("Failed to fetch question banks", error);
		}
	};

	const fetchMatrixOptions = async (subjectId) => {
		try {
			const response = await ApiService.get("/exam-matrices/options", {
				params: { subjectId: subjectId },
			});
			
			setMatrixOptions(response.data.map((matrix) => ({
				value: matrix.id,
				label: matrix.matrixName,
			})));
		} catch (error) {
			console.error("Failed to fetch matrix options", error);
			return [];
		}
	};
  
  const [selectedType, setSelectedType] = useState(null);
  const inputRef = useRef(null);

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addSession = () => {
		setExamData((prev) => ({
			...prev,
			sessions: [...prev.sessions, { sessionName: '', startAt: '', finishAt: '' }]
		}));
  };
  
	const removeSession = (index) => {
		setExamData((prev) => {
			const newSessions = [...prev.sessions];
			newSessions.splice(index, 1);
			return { ...prev, sessions: newSessions };
		});
	};
  
	const handleSessionChange = (index, field, value) => {
		setExamData((prev) => {
			const newSessions = [...prev.sessions];
			newSessions[index][field] = value;
			return { ...prev, sessions: newSessions };
		});
	};

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...examData
    };
    console.log('Submitting:', payload);
    // Gọi API ở đây

		try {
			const response = await ApiService.post("/organize-exams", payload);
			console.log("Kỳ thi đã được tạo thành công:", response.data);
			onClose(); // Đóng form sau khi tạo thành công
		} catch (error) {
			console.error("Lỗi khi tạo kỳ thi:", error);
		}
	};



  
  return (
    <Box sx={{}}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2',  }}>
            Tạo kỳ thi mới
      </Typography>
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
      <Box component="form" onSubmit={handleSubmit}>
        {/* Phần thông tin kỳ thi */}
        <Box className="box-shadow-custom"
					sx={{ mb: 2, p: 2, pt: 1, border: '1px solid #eee', borderRadius: '8px' }}>
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
							<Autocomplete
								options={subjectOptions}
								getOptionLabel={(option) => option.label}
								onChange={(event, selectedOption) => {
									const newSubjectId = selectedOption?.value || null;
									setExamData((prev) => ({ ...prev, subjectId: newSubjectId }));

									// Nếu đã chọn loại auto rồi => fetch luôn
									if (selectedType === "auto" && newSubjectId) {
										fetchQuestionBankOptions("auto", newSubjectId);
									}
								}}							
								renderInput={(params) => (
									<TextField
										{...params}
										label="Chọn phân môn"
										size="small"
										sx={{
											backgroundColor: "white",
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
            
            <Grid item xs={6}>
							<Autocomplete
								options={typeOptions}
								getOptionLabel={(option) => option.label || ""}
    						value={typeOptions.find((opt) => opt.value === examData.examType) || null}
								onChange={(event, selected) => {
									const selectedValue = selected?.value || null;

									setSelectedType(selectedValue);
									setExamData((prev) => ({
										...prev,
										examType: selectedValue,
										questionBankId: null
									}));

									// 👉 Chỉ fetch khi loại là auto + subjectId đã chọn
									if (selectedValue === "auto" && examData.subjectId) {
										fetchQuestionBankOptions("auto", examData.subjectId);
									}
									// 👉 Chỉ fetch ma trận khi loại là matrix + subjectId đã chọ
									if (selectedValue === "matrix" && examData.subjectId) {
										fetchMatrixOptions(examData.subjectId);
									}
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Chọn loại"
										size="small"
										placeholder="Chọn loại"
										sx={{
											backgroundColor: "white",
											"& .MuiInputBase-root": {
												height: "40px",
												fontSize: "14px",
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
											zIndex: 9999, // ✅ Giữ dropdown nổi
										},
									},
								}}
							/>

            </Grid>
            {selectedType === "exams" && (
							<Grid item xs={12}>
								<Autocomplete
									fullWidth
									options={subjectOptions}
									getOptionLabel={(option) => option.label || ""}
									value={subjectOptions.find((opt) => opt.value === examData.examId) || null}
									onChange={(e, newValue) => {
										setExamData({ ...examData, examId: newValue?.value || null });
									}}
									disabled={editingOrganizeExam}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Chọn đề thi"
											placeholder="Chọn đề thi"
											size="small"
											sx={{
												backgroundColor: "white",
												"& .MuiInputBase-root": {
													height: "40px",
													fontSize: "14px",
												},
												"& input": {
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												},
												"& label": {
													fontSize: "14px",
												},
											}}
										/>
									)}
									slotProps={{
										paper: {
											sx: {
												fontSize: "14px",
												zIndex: 9999,
											},
										},
									}}
								/>
							</Grid>
						)}

						{selectedType === "matrix" && (
							<Grid item xs={12}>
								<Autocomplete
									fullWidth
									options={matrixOptions} 
									getOptionLabel={(option) => option.label || ""}
									value={matrixOptions.find((opt) => opt.value === examData.matrixId) || null}
									onChange={(e, newValue) => {
										setExamData({ ...examData, matrixId: newValue?.value || null });
									}}
									disabled={editingOrganizeExam}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Chọn ma trận"
											placeholder="Chọn ma trận"
											size="small"
											sx={{
												backgroundColor: "white",
												"& .MuiInputBase-root": {
													height: "40px",
													fontSize: "14px",
												},
												"& input": {
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												},
												"& label": {
													fontSize: "14px",
												},
											}}
										/>
									)}
									slotProps={{
										paper: {
											sx: {
												fontSize: "14px",
												zIndex: 9999,
												width: "100%", // giữ dropdown khớp chiều rộng
											},
										},
									}}
								/>

							</Grid>
						)}
            {selectedType === "auto" && (
              <>
                <Grid item xs={6}>
                  <Autocomplete
										options={questionBankOptions} 
										getOptionLabel={(option) => option.label || ""}
										value={questionBankOptions.find((opt) => opt.value === examData.questionBankId) || null}
										onChange={(e, newValue) => {
											setExamData({ ...examData, questionBankId: newValue?.value || null });
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Bộ câu hỏi"
												placeholder="Bộ câu hỏi"
												size="small"
												sx={{
													backgroundColor: "white",
													"& .MuiInputBase-root": {
														height: "40px",
														fontSize: "14px",
													},
													"& label": {
														fontSize: "14px",
													},
												}}
											/>
										)}
										slotProps={{
											paper: {
												sx: {
													fontSize: "14px",
													zIndex: 9999,
												},
											},
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
          
          <Grid container spacing={2}>
						{examData.sessions.map((session, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Box
									sx={{
										p: 3,
										border: "1px solid #e0e0e0",
										borderRadius: "10px",
										backgroundColor: "#fff",
										boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
										height: "100%",
									}}
								>
									{/* Tiêu đề + nút xóa */}
									<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
										<Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px", display: "flex", alignItems: "center" }}>
											📝 Ca thi {index + 1}
										</Typography>
										{examData.sessions.length > 1 && (
											<IconButton
												onClick={() => removeSession(index)}
												sx={{
													color: "error.main",
													"&:hover": { backgroundColor: "rgba(244, 67, 54, 0.08)" },
												}}
											>
												<i className="fas fa-trash-alt" style={{fontSize: "20px"}}></i>
											</IconButton>
										)}
									</Box>

									{/* Input dọc trong card */}
									<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
										<TextField
											fullWidth
											label={`Tên ca thi ${index + 1}`}
											required
											value={session.sessionName}
											onChange={(e) =>
												handleSessionChange(index, "sessionName", e.target.value)
											}
											sx={{
												"& .MuiInputBase-input": { 
													fontSize: "14px", 
													padding: "8px 12px",
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

										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DateTimePicker
												label="Thời gian bắt đầu"
												value={session.startAt ? dayjs(session.startAt) : null}
												onChange={(newValue) =>
													handleSessionChange(
														index,
														"startAt",
														newValue ? newValue.toISOString() : ""
													)
												}
												sx={{ width: "100%" }}
												slotProps={{
													textField: {
														fullWidth: true,
														sx: {
															"& .MuiInputBase-input": { 
																fontSize: "14px", 
																padding: "8px 0px 8px 12px",
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
														},
													},
												}}
											/>
										</LocalizationProvider>

										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DateTimePicker
												label="Thời gian kết thúc"
												value={session.finishAt ? dayjs(session.finishAt) : null}
												onChange={(newValue) =>
													handleSessionChange(
														index,
														"finishAt",
														newValue ? newValue.toISOString() : ""
													)
												}
												sx={{ width: "100%" }}
												slotProps={{
													textField: {
														fullWidth: true,
														sx: {
															"& .MuiInputBase-input": { 
																fontSize: "14px", 
																padding: "8px 0px 8px 12px",
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
														},
													},
												}}
											/>
										</LocalizationProvider>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>


        </Box>
				<CancelButton style={{padding: "10px", marginTop: "15px"}} onClick={addSession}>
					<i className="fas fa-plus me-2"></i>
					Thêm ca thi
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
						<i className="fas fa-plus me-2"></i> Tạo kỳ thi
					</AddButton>
        </Box>
      </Box>
    </Box>
  );
};

FormCreateOrganizeExamTest.propTypes = {
	onClose: PropTypes.func.isRequired,
	typeOptions: PropTypes.array.isRequired,
	questionBankOptions: PropTypes.func.isRequired,
	subjectOptions: PropTypes.func.isRequired,
};

export default FormCreateOrganizeExamTest;