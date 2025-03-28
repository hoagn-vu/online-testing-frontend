import React, { useState, useEffect, useRef, use } from "react";
import { Link } from "react-router-dom";
import SelectRe from 'react-select';
import './DetailExamMatrixPage.css'
import {Select, Box, Button, Grid, IconButton, Input, TextField, MenuItem, Typography } from "@mui/material";
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
				levels: item.levels.map((level) => ({ ...level, questionCount: 0, scorePerQuestion: 0 }))
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
		if (!matrixName || !subjectChosen || !bankChosen || !data.length) {
			alert("Vui lòng chọn môn học, ngân hàng câu hỏi và nhập dữ liệu.");
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
					scorePerQuestion: level.scorePerQuestion
				}))
			),
		};
	
		try {
			const response = await ApiService.post("/exam-matrices", examMatrixData);
			console.log("Lưu thành công: ", response.data);
			alert("Lưu thành công!");
		} catch (error) {
			console.error("Lỗi khi lưu ma trận đề: ", error);
			alert("Lưu thất bại!");
		}
	};
		
	return (
		<div className="detail-matrix-page">
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
						label="Tên ma trận đề thi"
						sx={{
							"& .MuiOutlinedInput-root": {
								minHeight: "40px",
								minWidth: "250px",
							},
							"& .MuiInputLabel-root": {
								fontSize: "14px",
							},
						}}
					/>
					<SelectRe
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
					/>
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
					/>
					<FormControl sx={{ ml: 1, width: 250 }} size="small">
						<InputLabel id="demo-multiple-checkbox-label">Phân loại</InputLabel>
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={personName}
							onChange={handleChange}
							input={<OutlinedInput label="Phân theo" />}
							renderValue={(selected) => selected.join(', ')}
							MenuProps={MenuProps}
						>
							{names.map((name) => (
								<MenuItem key={name} value={name}>
									<Checkbox checked={personName.includes(name)} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="d-flex ms-auto">
					<button className="add-btn" onClick={handleSaveMatrix}>
						Lưu
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
