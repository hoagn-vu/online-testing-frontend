import React, { useState, useEffect, useRef } from "react";
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

// Dữ liệu mẫu cho dropdown
const colourOptions = [
    { value: 'red', label: 'Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư ' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
  ];

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
	// const [personName, setPersonName] = React.useState([]);
	const [personName, setPersonName] = useState([]);

	const [levelDif, setLevelDif] = useState([
		{
			chapter : "Chương 3",
			level : "",
			totalQuestionTag: 10,
			questionCount: 0,
		},
		{
				chapter : "Chương 2",
				level : "Nhận biết",
				totalQuestionTag: 5,
				questionCount: 0,
		},
		{
				chapter : "Chương 2",
				level : "Thông hiểu",
				totalQuestionTag: 5,
				questionCount: 0,
		},
		{
				chapter : "Chương 2",
				level : "Vận dụng cao",
				totalQuestionTag: 8,
				questionCount: 0,
		},
		{
				chapter : "Chương 1",
				level : "Nhận biết",
				totalQuestionTag: 5,
				questionCount: 0,
		}
	]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

	const groupedData = levelDif.reduce((acc, item) => {
    const existing = acc.find((entry) => entry.chapter === item.chapter);
    if (existing) {
      existing.levels.push({ level: item.level || "Không xác định", totalQuestionTag: item.totalQuestionTag });
    } else {
      acc.push({ chapter: item.chapter, levels: [{ level: item.level || "Không xác định", totalQuestionTag: item.totalQuestionTag }] });
    }
    return acc;
  }, []);

  const [data, setData] = useState(
    groupedData.map((item) => ({
      ...item,
      levels: item.levels.map((level) => ({ ...level, selectedCount: 0, pointPerQuestion: 0 }))
    }))
  );

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
		(sum, item) => sum + item.levels.reduce((subSum, level) => subSum + level.selectedCount, 0),
		0
	);

	const aggregateDifficultyData = () => {
		const difficultyMap = {};
	
		levelDif.forEach((item) => {
			const level = item.level.trim() === "" ? "Không xác định" : item.level;
	
			if (!difficultyMap[level]) {
				difficultyMap[level] = 0;
			}
			difficultyMap[level] += item.selectedCount; // Dùng selectedCount thay vì totalQuestionTag
		});
	
		return Object.entries(difficultyMap).map(([level, count]) => ({
			level,
			count,
		}));
	};
		
	// const difficultyData = aggregateDifficultyData();

	const [difficultyData, setDifficultyData] = useState([]);

	useEffect(() => {
		// Tính toán lại số lượng câu hỏi theo mức độ
		const newDifficultyData = [];

		data.forEach((item) => {
			item.levels.forEach((level) => {
				const existing = newDifficultyData.find((d) => d.level === level.level);
				if (existing) {
					existing.count += level.selectedCount; // Cập nhật số lượng
				} else {
					newDifficultyData.push({ level: level.level, count: level.selectedCount });
				}
			});
		});

		setDifficultyData(newDifficultyData);
	}, [data]); // Chạy lại mỗi khi `data` thay đổi

	// Matrix Chapter
	const [chapterSummary, setChapterSummary] = useState([]);

	const handleInputChangeChapter = (index, field, value) => {
		setChapterSummary((prevSummary) =>
			prevSummary.map((item, i) =>
				i === index ? { ...item, [field]: value } : item
			)
		);
	};

	const calculateSelectedQuestionsChapter = (data) => {
		return data.reduce((total, chapter) => {
			return total + (chapter.questions?.filter(q => q.selected).length || 0);
		}, 0);
	};
	
	const GroupDataChapter = (data) => {
		return data.reduce((acc, item) => {
			const existing = acc.find((entry) => entry.chapter === item.chapter);
			if (existing) {
				existing.totalQuestionTag += item.totalQuestionTag;
			} else {
				acc.push({ chapter: item.chapter, totalQuestionTag: item.totalQuestionTag, levels: [] });
			}
			return acc;
		}, []);
	};
	
	const [dataChapter, setDataChapter] = useState(
		GroupDataChapter(data).map((item) => ({
			...item,
			levels: item.levels.map((level) => ({
				...level,
				selectedCount: 0,
				pointPerQuestion: 0
			}))
		}))
	);
	
	// const totalSelectedQuestionsChapter = data.reduce((sum, item) => {
	// 	return sum + item.levels.reduce((subSum, level) => subSum + level.selectedCount, 0);
	// }, 0);
	
	// Tính tổng số câu hỏi đã chọn trong tất cả chương
  const totalSelectedQuestionsChapter = levelDif.reduce(
    (sum, item) => sum + item.questionCount,
    0
  );

	const totalSelectedQuestionsLevel = levelDif.reduce(
		(sum, item) => sum + item.questionCount,
		0
	);
	
	return (
		<div className="detail-matrix-page">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
					<Link to="/staff/matrix-exam" className="breadcrumb-between">Quản lý ma trận đề</Link></span>
					<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current"> Thêm mới</span>
			</nav>

			<div className="d-flex mt-4">
				<div className="d-flex">          
					<TextField
						required
						id="outlined-size-small"
						defaultValue=""
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
						placeholder="Chọn ngân hàng câu hỏi"
						name="color"
						options={colourOptions}
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
					<button className="add-btn" >
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
					data={levelDif}
					personName={personName}
					totalSelectedQuestions={totalSelectedQuestionsChapter}
				/>
			) : personName.includes("Mức độ") ? (
				<MatrixLevel
					data={levelDif}
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
