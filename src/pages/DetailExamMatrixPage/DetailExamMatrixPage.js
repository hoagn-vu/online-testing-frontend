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

// Dữ liệu mẫu cho dropdown
const colourOptions = [
    { value: 'red', label: 'Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư ' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
  ];

const rawDatas  = 
	{ 
		id: 1, 
		matrixName: "Lịch sử 10 giữa kỳ 1",
		subjectId: "123456789",
		subjectName: "Lịch sử",
		questionBankId: "234567890",
		questionBankName: "Lịch sử 10",
		matrixTags:[
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Nhận biết"],
				totalQuestionTag: 5,
				questionCount: 5, 
				tagScore: 1
			},
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Thông hiểu"],
				totalQuestionTag: 5,
				questionCount: 5, 
				tagScore: 1
			},
			{
				tagName: ["Bối cảnh quốc tế", "Nhận biết"],
				totalQuestionTag: 5,
				questionCount: 5, 
				tagScore: 1
			},
			{
				tagName: ["Bối cảnh quốc tế", "Thông hiểu"],
				totalQuestionTag: 5,
				questionCount: 5, 
				tagScore: 1
			},
			{
				tagName: ["Bối cảnh quốc tế", "Vận dụng cao"],
				totalQuestionTag: 5,
				questionCount: 5, 
				tagScore: 1
			}
		],
		totalQuestion: 20, 	
	};



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
	const [personName, setPersonName] = React.useState([]);

	const [levelDif, setLevelDif] = useState([
		{
			chapter : "Chương 3",
			level : "",
			totalQuestionTag: 10,
			selectedQuestionTag: 0,
		},
		{
				chapter : "Chương 2",
				level : "Nhận biết",
				totalQuestionTag: 5,
				selectedQuestionTag: 0,
		},
		{
				chapter : "Chương 2",
				level : "Thông hiểu",
				totalQuestionTag: 5,
				selectedQuestionTag: 0,
		},
		{
				chapter : "Chương 2",
				level : "Vận dụng cao",
				totalQuestionTag: 8,
				selectedQuestionTag: 0,
		},
		{
				chapter : "Chương 1",
				level : "Nhận biết",
				totalQuestionTag: 5,
				selectedQuestionTag: 0,
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
					{/* <SelectRe
						className="basic-single ms-2 me-2"
						classNamePrefix="select"
						placeholder="Chọn phân môn"
						name="color"
						options={colourOptions}
						styles={{
								control: (base) => ({
										...base,
										width: "250px",
										minWidth: "250px",
										maxWidth: "250px",
										height: "40px", 
								}),
								menu: (base) => ({
										...base,
										width: "250px",
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
					<FormControl sx={{ ml: 1, width: 250,}} size="small">
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
			
			<Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">

<div className="table-responsive" style={{ flex: "1"}}>
      <table className="table w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">STT</th>
            <th className="border p-2">Chuyên đề kiến thức</th>
            <th className="border p-2">Mức độ</th>
            <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
            <th className="border p-2 text-center">Đơn vị</th>
            <th className="border p-2 text-center">Điểm/Câu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, chapterIndex) => (
            <>
              {item.levels.map((level, levelIndex) => (
                <tr key={`${chapterIndex}-${levelIndex}`} className="border">
                  {levelIndex === 0 && (
                    <td className="border p-2 text-center" rowSpan={item.levels.length}>{chapterIndex + 1}</td>
                  )}
                  {levelIndex === 0 && (
                    <td className="border p-2" rowSpan={item.levels.length} 
											style={{minWidth: "300px"}}
										>{item.chapter}</td>
                  )}
                  <td className="border p-2" style={{minWidth: "150px"}}>{level.level} </td>
                  <td className="border p-2 text-center" style={{minWidth: "100px"}}>
										<div className="d-flex align-items-center justify-content-center gap-1">
											<input
												type="number"
												value={level.selectedCount}
												min="0"
												max={level.totalQuestionTag}
												onChange={(e) =>
														handleInputChange(chapterIndex, levelIndex, "selectedCount", Number(e.target.value))
												}
												className="border p-1 text-center"
												style={{ width: "50px" }}
											/>

    									<span>/ {String(level.totalQuestionTag).padStart(2, "0")}</span>
										</div>
									</td>

                  <td className="border p-2 text-center" style={{minWidth: "70px"}}>Câu</td>
                  <td className="border p-2 text-center">
                    <input
                      type="number"
                      value={level.pointPerQuestion}
                      min="0"
                      step="0.1"
                      onChange={(e) => handleInputChange(chapterIndex, levelIndex, "pointPerQuestion", Number(e.target.value))}
                      className="border p-1 text-center"
											style={{ width: "50px" }}
                    />
                  </td>
                </tr>
              ))}
            </>
          ))}
					{/* Hàng tổng số câu hỏi */}
					<tr className="bg-gray-300 font-semibold">
						<td className="border p-2 text-center" colSpan="3">Tổng số câu hỏi</td>
						<td className="border p-2 text-center">{totalSelectedQuestions}</td>
						<td className="border p-2 text-center">Câu</td>
					</tr>

        </tbody>
      </table>
    </div>

		<Paper sx={{ padding: 2, height: "100%", width: "250px" }}>
  <h5 className="justify-content-center d-flex">Thống kê</h5>
  <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
    <thead>
      <tr>
        <th style={{ border: "1px solid #ddd", textAlign: "left", padding: "8px", minWidth: "130px" }}>
          Mức độ
        </th>
        <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>
          Số lượng
        </th>
      </tr>
    </thead>
    <tbody>
      {difficultyData.map((row, index) => (
        <tr key={index}>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.level}</td>
          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
            {row.count}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
		</Paper>

			</Box>
		</div>
	);
};

export default DetailExamMatrixPage;
