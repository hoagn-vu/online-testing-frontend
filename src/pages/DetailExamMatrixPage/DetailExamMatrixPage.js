import React, { useState, useEffect, useRef, use } from "react";
import { Link, useNavigate  } from "react-router-dom";
import SelectRe from 'react-select';
import './DetailExamMatrixPage.css'
import {Select, Box, Button, Grid, IconButton, Input, TextField, MenuItem, Autocomplete } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import "bootstrap/dist/css/bootstrap.min.css";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import MatrixBoth from "../../components/MatrixBoth/MatrixBoth";
import MatrixChapter from "../../components/MatrixChapter/MatrixChapter";
import MatrixLevel from "../../components/MatrixLevel/MatrixLevel";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const names = ['Chuyên đề','Mức độ',];

const DetailExamMatrixPage = () => {
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [subjectChosen, setSubjectChosen] = useState(null);
	const [bankOptions, setBankOptions] = useState([]);
	const [bankChosen, setBankChosen] = useState(null);
	const [tagClassification, setTagClassification] = useState([]);
	const [data, setData] = useState([]);
	const [matrixName, setMatrixName] = useState("");
	const inputRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);
	useEffect(() => {
		const fetchSubjectOptions = async () => {
			try {
				const response = await ApiService.get("/subjects/options");
				setSubjectOptions(response.data.map((item) => ({ value: item.id, label: item.subjectName })));
			} catch (error) {
				console.error("Failed to fetch subject options: ", error);
			}
		};

		fetchSubjectOptions();
	}, []);

	useEffect(() => {
		const fetchBankOptions = async () => {
			try {
				const response = await ApiService.get("/subjects/question-bank-options", {
					params: { subjectId: subjectChosen },
				});
				setBankOptions(response.data.map((item) => ({ value: item.questionBankId, label: item.questionBankName })));
			} catch (error) {
				console.error("Failed to fetch bank options: ", error);
			}
		};

		if (subjectChosen) {
			fetchBankOptions();
		}
	}, [subjectChosen]);

	useEffect(() => {
		const fetchTagsClassification = async () => {
			try {
				const response = await ApiService.get("/subjects/questions/tags-classification", {
					params: { subjectId: subjectChosen, questionBankId: bankChosen },
				});
				setTagClassification(response.data.map((item) => ({ ...item, questionCount: 0 })));
				// console.log("Tag classification: ", response.data.map((item) => ({ ...item, questionCount: 0 })));
			} catch (error) {
				console.error("Failed to fetch tag classification: ", error);
			}
		};

		if (subjectChosen && bankChosen) {
			fetchTagsClassification();
		}
	}, [subjectChosen, bankChosen]);

	const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

	useEffect(() => {
		const groupedData = tagClassification.reduce((acc, item) => {
			const existing = acc.find((entry) => entry.chapter === item.chapter);
			if (existing) {
				existing.levels.push({ level: item.level || "Không xác định", total: item.total });
			} else {
				acc.push({ chapter: item.chapter, levels: [{ level: item.level || "Không xác định", total: item.total }] });
			}
			return acc;
		}, []);
	
		setData(
			groupedData.map((item) => ({
				...item,
				levels: item.levels.map((level) => ({ ...level, questionCount: 0, score: 0 }))
			}))
		);
	}, [tagClassification]);

	const handleInputChange = (chapterIndex, levelIndex, field, value) => {
    setData((prevData) => {
			const newData = [...prevData]; // Tạo bản sao của data
			if (!newData[chapterIndex] || !newData[chapterIndex].levels[levelIndex]) {
				console.error("Invalid index:", chapterIndex, levelIndex);
				return prevData;
			}
			newData[chapterIndex].levels[levelIndex][field] = value; // Cập nhật giá trị
			return newData;
    });
	};
	
	const totalSelectedQuestions = data.reduce(
		(sum, item) => sum + item.levels.reduce((subSum, level) => subSum + level.questionCount, 0),
		0
	);

	const [difficultyData, setDifficultyData] = useState([]);

	useEffect(() => {
		// Tính toán lại số lượng câu hỏi theo mức độ
		const newDifficultyData = [];

		data.forEach((item) => {
			item.levels.forEach((level) => {
				const existing = newDifficultyData.find((d) => d.level === level.level);
				if (existing) {
					existing.questionCount += level.questionCount;
				} else {
					newDifficultyData.push({ level: level.level, questionCount: level.questionCount });
				}
			});
		});

		setDifficultyData(newDifficultyData);
	}, [data]); // Chạy lại mỗi khi `data` thay đổi
	
	// Tính tổng số câu hỏi đã chọn trong tất cả chương
  const totalSelectedQuestionsChapter = tagClassification.reduce(
    (sum, item) => sum + item.questionCount,
    0
  );

	const totalSelectedQuestionsLevel = tagClassification.reduce(
		(sum, item) => sum + item.questionCount,
		0
	);

	const handleSaveMatrix = async () => {
		if (!matrixName) {
			Swal.fire({
				icon: "warning",
				title: "Thiếu tên ma trận!",
				text: "Vui lòng nhập tên ma trận đề thi.",
			});
			return;
		}
		
		if (!subjectChosen) {
			Swal.fire({
				icon: "warning",
				title: "Chưa chọn môn học!",
				text: "Vui lòng chọn môn học.",
			});
			return;
		}
		
		if (!bankChosen) {
			Swal.fire({
				icon: "warning",
				title: "Chưa chọn ngân hàng câu hỏi!",
				text: "Vui lòng chọn ngân hàng câu hỏi.",
			});
			return;
		}
		
		if (!data.length) {
			Swal.fire({
				icon: "warning",
				title: "Dữ liệu ma trận trống!",
				text: "Vui lòng nhập dữ liệu cho ma trận đề thi.",
			});
			return;
		}
		
	
		const examMatrixData = {
			matrixName: matrixName,
			subjectId: subjectChosen,
			questionBankId: bankChosen,
			matrixTags: data.flatMap((item) =>
				item.levels.map((level) => ({
					chapter: item.chapter,
					level: level.level,
					questionCount: level.questionCount,
					score: level.score
				}))
			),
		};
	
		try {
			const response = await ApiService.post("/exam-matrices", examMatrixData);
			console.log("Lưu thành công: ", response.data);
			Swal.fire({
				icon: "success",
				title: "Lưu thành công!",
				text: "Ma trận đề thi đã được lưu.",
			}).then(() => {
				navigate("/staff/matrix-exam"); 
			});
			
			// alert("Lưu thành công!");
		} catch (error) {
			console.error("Lỗi khi lưu ma trận đề: ", error);
			alert("Lưu thất bại!");
		}
	};
		
	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i></Link> 
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
					<Link to="/staff/matrix-exam" className="breadcrumb-between">Quản lý ma trận đề</Link></span>
					<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">Thêm mới</span>
			</nav>

			<div className="d-flex mt-4">
				<div className="d-flex">          
					<TextField
						required
						id="outlined-size-small"
						value={matrixName}
						onChange={(e) => setMatrixName(e.target.value)}
						size="small"
						inputRef={inputRef}
						label="Tên ma trận đề thi"
						sx={{
							backgroundColor: "white",
							"& .MuiOutlinedInput-root": {
								minHeight: "40px",
								minWidth: "250px",
								fontSize: "14px",
							},
							"& .MuiInputLabel-root": {
								fontSize: "14px",
							},
						}}
					/>
					
					<Autocomplete
						className="ms-2"
						options={subjectOptions} // dạng: [{ label: 'Toán 1', value: 'toan1' }, ...]
						getOptionLabel={(option) => option.label}
						onChange={(event, newValue) => setSubjectChosen(newValue?.value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Chọn phân môn"
								size="small"
								sx={{
									backgroundColor: "white",
									width: 250,
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
					{/* <SelectRe
						className="basic-single ms-2"
						classNamePrefix="select"
						placeholder="Chọn phân môn"
						name="color"
						options={subjectOptions}
						onChange={(option) => setSubjectChosen(option?.value)}
						styles={{
								control: (base) => ({
										...base,
										width: "250px", // Cố định chiều rộng
										maxWidth: "250px",
										height: "40px", // Tăng chiều cao
								}),
								menu: (base) => ({
										...base,
										width: "250px", // Cố định chiều rộng của dropdown
								}),
								valueContainer: (base) => ({
										...base,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										fontSize: "14px",
								}),
								placeholder: (base) => ({
										...base,
										fontSize: "14px", // Cỡ chữ của placeholder (label)
								}),
						}}
					/> */}

					<Autocomplete
						className="ms-2"
						options={bankOptions} 
						getOptionLabel={(option) => option.label}
						onChange={(event, newValue) => setBankChosen(newValue?.value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Chọn bộ câu hỏi"
								size="small"
								sx={{
									backgroundColor: "white",
									width: 250,
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
								},
							},
						}}
					/>
{/* 
					<SelectRe	
						className="basic-single ms-2"
						classNamePrefix="select"
						placeholder="Chọn bộ câu hỏi"
						name="color"
						options={bankOptions}
						onChange={(option) => setBankChosen(option?.value)}
						styles={{
								control: (base) => ({
										...base,
										width: "250px", // Cố định chiều rộng
										maxWidth: "250px",
										height: "40px", // Tăng chiều cao
								}),
								menu: (base) => ({
										...base,
										width: "250px", // Cố định chiều rộng của dropdown
								}),
								valueContainer: (base) => ({
										...base,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										fontSize: "14px",
								}),
								placeholder: (base) => ({
										...base,
										fontSize: "14px", // Cỡ chữ của placeholder (label)
								}),
						}}
					/> */}

					<FormControl sx={{ ml: 1, width: 250 }} size="small">
					<InputLabel
							id="demo-multiple-checkbox-label"
							sx={{ fontSize: "14px",  }}
						>
							Phân theo
						</InputLabel>						
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={personName}
							onChange={handleChange}
							input={
								<OutlinedInput
									label="Phân theo"
									sx={{
										
										"& .MuiInputBase-input": {
											fontSize: "14px", // Font trong input
										},
										"& .MuiInputLabel-root": {
											fontSize: "14px", // Label hiển thị
										},
									}}
								/>
							}
							renderValue={(selected) => selected.join(', ')}
							MenuProps={{
								PaperProps: {
									style: {
										width: 200, //Chiều rộng dropdown
									},
								},
							}}
							sx={{
								backgroundColor: "white",
								width: "205px",
								height: "40px",
								fontSize: "14px",
							}}
						>
							{names.map((name) => (
								<MenuItem key={name} value={name} sx={{ fontSize: "14px", height: "50px" }}>
									<Checkbox checked={personName.includes(name)} />
									<ListItemText
										primary={name}
										primaryTypographyProps={{ fontSize: "14px" }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="d-flex ms-auto">
					<button className="add-btn" onClick={handleSaveMatrix}
						style={{width: "130px"}}
					>
						<i className="fas fa-plus me-2"></i>
						Tạo ma trận
					</button>
				</div>
			</div>
			{personName.includes("Mức độ") && personName.includes("Chuyên đề") ? (
				<MatrixBoth
					data={data}
					personName={personName}
					handleInputChange={handleInputChange}
					totalSelectedQuestions={totalSelectedQuestions}
					difficultyData={difficultyData}
				/>
			) : personName.includes("Chuyên đề") ? (
				<MatrixChapter
					data={tagClassification}
					personName={personName}
					totalSelectedQuestions={totalSelectedQuestionsChapter}
				/>
			) : personName.includes("Mức độ") ? (
				<MatrixLevel
					data={tagClassification}
					personName={personName}
					totalSelectedQuestions={totalSelectedQuestionsLevel}
				/>
			) : (
				<MatrixBoth
					data={data}
					personName={personName}
					handleInputChange={handleInputChange}
					totalSelectedQuestions={totalSelectedQuestions}
					difficultyData={difficultyData}
				/>
			)}

		</div>
	);
};

export default DetailExamMatrixPage;
