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

const listQuestionBank = [
    {
        id: "67cf6cee1d44d62edf5de90b",
        subjectName: "Math",
        subjectStatus: null,
        questionBanks: [
            {
                questionBankId: "67cf702d1d44d62edf5de913",
                questionBankName: "Giải tích 1",
                questionBankStatus: null,
                list: [],
            },
            {
                questionBankId: "67cf70341d44d62edf5de916",
                questionBankName: "Giải tích 2",
                questionBankStatus: null,
                list: [],
            }
        ]
    },
    {
        id: "67cf6d191d44d62edf5de90d",
        subjectName: "History",
        subjectStatus: null,
        questionBanks: [
            {
                questionBankId: "67cf702d1d44d62edf5de913",
                questionBankName: "His 1",
                questionBankStatus: null,
                list: [],
            },
            {
                questionBankId: "67cf70341d44d62edf5de916",
                questionBankName: "His 2",
                questionBankStatus: null,
                list: [],
            }
        ]
    }
];

// Dữ liệu mẫu cho dropdown
const colourOptions = [
    { value: 'red', label: 'Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư ' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
  ];
  const columns = [
    { field: "id", headerName: "#", width: 50, headerAlign: "center", align: "center" },
    {
        field: "topic",
        headerName: "Chuyên đề kiến thức",
        minWidth: 200,
        flex: 0.05,
        renderCell: (params) => {
            return params.row.isFirst ? (
                <div 
                    className="d-flex align-items-center text-break"
                    style={{
                        whiteSpace: "normal",  
                        wordBreak: "break-word",  
                        lineHeight: "1.2",  
                        padding: "5px",  
                        height: "100%",  
                    }}
                >
                    <strong>{params.value}</strong>
                </div>
            ) : "";
        },
    },
    { field: "difficulty", headerName: "Độ khó", width: 140, headerAlign: "center" },
    {
        field: "selected",
        headerAlign: "center",
        headerName: "Số lượng chọn / Tổng",
        width: 200,
        align: "center",
        renderCell: (params) => {
            const isFooterRow = params.row.topic === "Tổng số câu đã chọn";
            const [value, setValue] = useState(params.row.selected || 0);

            if (isFooterRow) {
                return (
                    <div className="d-flex align-items-center justify-content-center fw-bold w-100 h-100 text-center">
                        {params.row.selected}
                    </div>
                );
            }

            return (
                <div className="d-flex align-items-center justify-content-center w-100 h-100">
                    <input
                        type="number"
                        className="form-control text-center"
                        style={{ width: "80px", padding: "5px" }}
                        value={value}
                        min="0"
                        max={params.row.totalQuestion}
                        onChange={(e) => setValue(e.target.value)} // Cập nhật giá trị khi nhập
                    />
                    <span className="ms-1">/ {params.row.totalQuestion}</span>
                </div>
            );
        },
    },
    { field: "unit", headerName: "Đơn vị", width: 65, align: "center", headerAlign: "center" },
    {
        field: "score",
        headerName: "Điểm / Câu",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
            const isFooterRow = params.row.topic === "Tổng số câu đã chọn";
            const [value, setValue] = useState(params.row.score || 0);

            return (
                <div className="d-flex align-items-center justify-content-center w-100 h-100">
                    {isFooterRow ? (
                        <strong>{params.value || ""}</strong>
                    ) : (
                        <input
                            type="number"
                            className="form-control text-center"
                            style={{ width: "100%" }}
                            value={value}
                            min="0"
                            onChange={(e) => setValue(e.target.value)} // Cập nhật giá trị khi nhập
                        />
                    )}
                </div>
            );
        },
    },
];

const rawDatas  = 
	{ 
		id: 1, 
		matrixName: "Lịch sử 10 giữa kỳ 1",
		subjectId: "",
		subjectName: "Lịch sử",
		questionBankId: "",
		questionBankName: "Lịch sử 10",
		matrixTags:[
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Nhận biết"],
				questionCount: "5", 
				tagScore: "1"
			},
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Nhận biết"],
				questionCount: "5", 
				tagScore: "1"
			},
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Nhận biết"],
				questionCount: "5", 
				tagScore: "1"
			},
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Nhận biết"],
				questionCount: "5", 
				tagScore: "1"
			},
			{
				tagName: ["Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", "Nhận biết"],
				questionCount: "5", 
				tagScore: "1"
			}
		],
		totalQuestion: "5", 	
	};

const rawData  = [
    { id: 1, topic: "Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", difficulty: "Nhận biết", selected: "5", totalQuestion: "5", unit: "Câu", score: "1"},
    { id: 2, topic: "Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", difficulty: "Thông hiểu", selected: "2", totalQuestion: "10", unit: "Câu"},
    { id: 3, topic: "Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", difficulty: "Vận dụng cao", selected: "2", totalQuestion: "5", unit: "Câu"},
    { id: 4, topic: "Các nước Á, Phi, và Mĩ La Tinh giai đoạn 1945-2000", difficulty: "Nhận biết", selected: "2", totalQuestion: "9", unit: "Câu"},
    { id: 5, topic: "Các nước Á, Phi, và Mĩ La Tinh giai đoạn 1945-2000", difficulty: "Thông hiểu", selected: "2", totalQuestion: "15", unit: "Câu"},
    { id: 6, topic: "Liên Xô và các nước Đông Âu giai đoạn 1945-1991", difficulty: "Vận dụng cao", selected: "2", totalQuestion: "5", unit: "Câu" },
];

const difficultyData = [
    { level: "Nhận biết", count: 10 },
    { level: "Thông hiểu", count: 15 },
    { level: "Vận dụng cao", count: 5 },
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
	// Xử lý gộp chuyên đề
	const processData = (data) => {
		let groupedData = [];
		let lastTopic = null;
		data.forEach((item, index) => {
			let isFirst = item.topic !== lastTopic;
			groupedData.push({ ...item, id: index + 1, isFirst });
			lastTopic = item.topic;
		});
		return groupedData;
	};
    
	// Tính tổng số câu đã chọn
	const calculateTotalSelected = (data) => {
		return data.reduce((sum, item) => sum + Number(item.selected), 0); 
	};
	const processedData = processData(rawData);
	const totalSelected = calculateTotalSelected(rawData);
	const [rows, setRows] = useState([]);
	// const [totalSelected, setTotalSelected] = useState(0);
	
	const footerRow = {
			id: "", 
			topic: "Tổng số câu đã chọn",  
			difficulty: "",
			selected: `${totalSelected}`,  
			totalQuestion: "",
			unit: "Câu",
			isFirst: true,
	};
	
	const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

	



	return (
		<div className="detail-matrix-page">
			{/* Breadcrumb */}
			<nav>
				<Link to="/admin">Home</Link> / 
				<Link to="/admin/exam-matrix">Quản lý ma trận đề</Link> / 
				<span className="breadcrumb-current"></span>
			</nav>

			<div className="d-flex mt-4">
				<div className="d-flex">          
					<TextField
						required
						id="outlined-size-small"
										defaultValue="Small"
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
						className="basic-single ms-2 me-2"
						classNamePrefix="select"
						placeholder="Chọn phân môn"
						name="color"
						options={colourOptions}
						styles={{
								control: (base) => ({
										...base,
										width: "250px", // Cố định chiều rộng
										minWidth: "250px",
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
						className="basic-single"
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
					<FormControl sx={{ ml: 1, width: 235,}} size="small">
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
			<Box display="flex" gap={2} className="mt-3">
				<table className="table table-bordered ">
					{/* Header */}
					<thead className="">
						<tr>
							{columns.map((col, index) => (
								<th key={index} style={{ borderBottom: "2px solid #ccc" }}>
									{col.headerName}
								</th>
							))}
						</tr>
					</thead>

					{/* Body */}
					<tbody>
						{processedData.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{columns.map((col, colIndex) => (
									<td key={colIndex} style={{ borderRight: "1px solid #ddd" }}>
										{row[col.field]}
									</td>
								))}
							</tr>
						))}

						{/* Footer Row */}
						<tr className="footer-row" style={{ fontWeight: "bold", backgroundColor: "#f5f5f5", textAlign: "center" }}>
							{columns.map((col, colIndex) => (
								<td key={colIndex}>{footerRow[col.field]}</td>
							))}
						</tr>
					</tbody>
				</table>

				<Paper sx={{ display: "inline-block", padding: 2, height: "250px" }}>
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
														<td style={{ border: "1px solid #ddd", padding: "8px" }}>
																{row.level}
														</td>
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
