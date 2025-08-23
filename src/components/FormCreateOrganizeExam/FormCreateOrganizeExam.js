import React, { useState, useRef, useEffect,  } from 'react';
import { Box, Grid, TextField, Button, Typography, IconButton, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import "./FormCreateOrganizeExam.css"
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Popper from '@mui/material/Popper';

const FormCreateOrganizeExam = ({ onClose, typeOptions}) => {
	const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [questionBankOptions, setQuestionBankOptions] = useState([]);
	const [matrixOptions, setMatrixOptions] = useState([]);
	const [examOptions, setExamOptions] = useState([]);
	const navigate = useNavigate();

  // State cho thông tin kỳ thi
  const [examData, setExamData] = useState({
    organizeExamName: '',
    duration: 60,
    maxScore: 10,
    subjectId: null,
    examType: null,
		examIds: [],
    questionBankId: null,
    totalQuestions: null,
		sessions: [
			{ sessionName: '', startAt: '', finishAt: null },
		],
  });

	useEffect(() => {
		const fetchSubjectOptions = async () => {
			try {
				const response = await ApiService.get("/subjects/options");
				setSubjectOptions(response.data.map((subject) => ({
					value: subject.id,
					label: subject.subjectName,
				})));
			} catch (error) {
				console.error("Failed to fetch subjects", error);
			}
		};
		fetchSubjectOptions();
	}, []);

	const fetchQuestionBankOptions = async (subjectId) => {
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

  // Xử lý thêm ca thi mới
  const addSession = () => {
		setExamData((prev) => ({
			...prev,
			sessions: [...prev.sessions, { sessionName: '', startAt: '', finishAt: null }]
		}));
    // setSessions([...sessions, { sessionName: '', activeAt: '' }]);
  };
  
  // Xử lý xóa ca thi
  const removeSession = (index) => {
		setExamData((prev) => {
			const newSessions = [...prev.sessions];
			newSessions.splice(index, 1);
			return { ...prev, sessions: newSessions };
		});
    /*if (sessions.length > 1) {
      const newSessions = [...sessions];
      newSessions.splice(index, 1);
      setSessions(newSessions);
    }*/
  };
  
  // Xử lý thay đổi thông tin ca thi
  const handleSessionChange = (index, field, value) => {
		setExamData((prev) => {
			const newSessions = [...prev.sessions];
			newSessions[index][field] = value;
			return { ...prev, sessions: newSessions };
		});
    //const newSessions = [...sessions];
    //newSessions[index][field] = value;
    //setSessions(newSessions);
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
		switch (selectedType) {
			case "auto":
				payload = {
					organizeExamName: examData.organizeExamName,
					duration: examData.duration,
					totalQuestions: examData.totalQuestions,
					maxScore: examData.maxScore,
					subjectId: examData.subjectId,
					questionBankId: examData.questionBankId,
					examType: examData.examType,
					sessions: examData.sessions,
				};
				break;
			case "matrix":
				payload = {
					organizeExamName: examData.organizeExamName,
					duration: examData.duration,
					maxScore: examData.maxScore,
					subjectId: examData.subjectId,
					matrixId: examData.matrixId,
					questionBankId: examData.questionBankId,
					examType: examData.examType,
					sessions: examData.sessions,
				};
				break;
			case "exams":
				payload = {
					organizeExamName: examData.organizeExamName,
					duration: examData.duration,
					maxScore: examData.maxScore,
					subjectId: examData.subjectId,
					questionBankId: examData.questionBankId,
					exams: examData.examIds || [],
					examType: examData.examType,
					sessions: examData.sessions,
				};
				break;
			default:
				console.error("Invalid exam type selected");
				return;
		}

    console.log('Submitting:', payload);
    // Gọi API ở đây
		try {
			const response = await ApiService.post("/organize-exams", payload);
			Swal.fire({
				text: "Kỳ thi đã được tạo thành công",
				icon: "success",
				draggable: true
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("/staff/organize", { state: { reload: true } });
					onClose(); // ✅ Chỉ đóng sau khi người dùng bấm OK
				}
			});
			console.log("Kỳ thi đã được tạo thành công:", response.data);
		} catch (error) {
			console.error("Lỗi khi tạo kỳ thi:", error);
		}
  };

	const fetchExamOptions = async (subjectId, questionBankId) => {
		try {
			const response = await ApiService.get("/exams/options", {
				params: { subjectId: subjectId, questionBankId: questionBankId },
			});
			const options = response.data.data.map((exam) => ({
				value: exam.id,
				label: `${exam.examName} - ${exam.examCode}`,
			}));
			setExamOptions(options);
		}
		catch (error) {
			console.error("Failed to fetch exam options", error);
		}
	};

	function CustomPopper(props) {
		return <Popper {...props} placement="bottom-start" />;
	}

  return (
    <Box sx={{}}>

      <Box component="form" onSubmit={handleSubmit}>
        <div className='d-flex'>
					{/* Phần thông tin kỳ thi */}
					<div className='col-6 me-2'
						style={{
							position: "sticky",
							top: "80px",      // khoảng cách từ đỉnh trang
							alignSelf: "flex-start",
							height: "fit-content", // đảm bảo không kéo dài hết chiều cao
							zIndex: 10  
						}}
					>
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
						<Box className="box-shadow-custom"
							sx={{ mb: 2, p: 2, pt: 1, border: '1px solid #eee', borderRadius: '8px', backgroundColor: "white" }}>
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
								
								<Grid item xs={12}>
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
								
								<Grid item xs={12}>
									<Autocomplete
										options={subjectOptions}
										getOptionLabel={(option) => option.label}
										onChange={(event, selectedOption) => {
											const newSubjectId = selectedOption?.value || null;
											setExamData((prev) => ({ ...prev, subjectId: newSubjectId }));

											// Nếu đã chọn loại auto rồi => fetch luôn
											if (newSubjectId) {
												fetchQuestionBankOptions(newSubjectId);

												if (selectedType === "matrix") {
													fetchMatrixOptions(newSubjectId);
												}

												if (selectedType === "exams") {
													fetchExamOptions(newSubjectId, examData.questionBankId);
												}
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
								<Grid item xs={12}>
									<Autocomplete
										options={questionBankOptions} 
										getOptionLabel={(option) => option.label || ""}
										value={questionBankOptions.find((opt) => opt.value === examData.questionBankId) || null}
										onChange={(e, newValue) => {
											setExamData({ ...examData, questionBankId: newValue?.value || null });

											const questionBankId = newValue?.value || null;
											if (examData.subjectId && questionBankId) {
												if (selectedType === "exams") {
													fetchExamOptions(examData.subjectId, questionBankId);
												}

												if (selectedType === "matrix") {
													fetchMatrixOptions(examData.subjectId);
												}
											}
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
								<Grid item xs={12}>
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
											}));

											// 👉 Chỉ fetch ma trận khi loại là matrix + subjectId đã chọ
											if (selectedValue === "matrix" && examData.subjectId) {
												fetchMatrixOptions(examData.subjectId);
											}

											if (selectedValue === "exams") {
												fetchExamOptions(examData.subjectId);
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
											multiple
                  		limitTags={2}
  										id="multiple-limit-tags"
											options={examOptions}
											getOptionLabel={(option) => option.label || ""}
											value={
												examOptions.filter((opt) => examData.examIds?.includes(opt.value)) || []
											}
											onChange={(e, newValue) => {
												setExamData({
													...examData,
													examIds: newValue.map((val) => val.value),
												});
											}}
											disabled={editingOrganizeExam}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Chọn đề thi"
													sx={{
														backgroundColor: "white",
														"& .MuiInputBase-root": {
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
														overflowY: "auto",
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
											PopperComponent={CustomPopper}
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
														maxHeight: "220px",
														overflowY: "auto",
													},
												},
											}}
										/>

									</Grid>
								)}
								{selectedType === "auto" && (
									<>									
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
					</div>

					{/* Phần thông tin các ca thi */}
					<div className='col-6'>
						<Box sx={{ mb: 0 }}>
							<Typography variant="h6" sx={{ 
								fontWeight: 'bold', 
								color: '#333',
								display: 'flex',
								alignItems: 'center',        
								top: 70,
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
								
							{examData.sessions.map((session, index) => (
								<Box 
									className="box-shadow-custom"
									key={index} 
									sx={{ 
										mt: 1,
										mb: 1, 
										p: 2, 
										pt: 1,
										border: '1px solid #eee', 
										borderRadius: '8px',
										position: 'relative'
									}}
								>
									<Grid item xs={0.5} sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", }}>
										<Typography className='fw-bold mb-3' variant="subtitle1" sx={{fontSize: "16px" }}>
											Ca thi {index + 1}
										</Typography>
										{examData.sessions.length > 1 && (
											<IconButton
												onClick={() => removeSession(index)}
												sx={{ 
													color: 'error.main',
													padding: '0px',
													'&:hover': {
														backgroundColor: 'rgba(244, 67, 54, 0.08)',
													}
												}}
											>
												<button className="btn btn-sm " style={{ width: "38px", height: "36px" }}>
													<i className="fas fa-trash-alt"></i>
												</button>
												{/* <DeleteIcon fontSize="small" /> */}
											</IconButton>
										)}
									</Grid>
									<Grid container spacing={2} alignItems="center">
										<Grid item xs={12}>
											<TextField
												fullWidth
												label={`Tên ca thi ${index + 1}`}
												required
												value={session.sessionName}
												onChange={(e) => handleSessionChange(index, 'sessionName', e.target.value)}
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
										</Grid>
										
										<Grid item xs={12}>
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DateTimePicker
													label={`Thời gian bắt đầu ca ${index + 1}`}
													value={session.startAt ? dayjs(session.startAt) : null}
													onChange={(newValue) => 
														handleSessionChange(index, 'startAt', newValue ? newValue.toISOString() : '')
													}
													sx={{ width: '100%' }}
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
										</Grid>

										{/* <Grid item xs={6}>
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DateTimePicker
													label={`Thời gian kết thúc ca ${index + 1}`}
													value={session.finishAt ? dayjs(session.finishAt) : null}
													onChange={(newValue) => 
														handleSessionChange(index, 'finishAt', newValue ? newValue.toISOString() : '')
													}
													sx={{ width: '100%' }}
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
										</Grid> */}
										
										
									</Grid>
								</Box>
							))}
						</Box>
						<CancelButton style={{padding: "10px"}} onClick={addSession}>
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
					</div>
				</div>
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

FormCreateOrganizeExam.propTypes = {
	onClose: PropTypes.func.isRequired,
	typeOptions: PropTypes.array.isRequired,
	questionBankOptions: PropTypes.func.isRequired,
	subjectOptions: PropTypes.func.isRequired,
};

export default FormCreateOrganizeExam;