import React, { useState, useEffect, useRef, use } from "react";
import { Link, useNavigate, useSearchParams   } from "react-router-dom";
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
import CancelButton from "../../components/CancelButton/CancelButton";
import AddButton from "../../components/AddButton/AddButton";

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

const names = ['Chuyên đề','Mức độ'];

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
	const [searchParams] = useSearchParams();
	const editMatrixId = searchParams.get("id");
	const [totalScore, setTotalScore] = useState(10);
	const [matrixType, setMatrixType] = useState("both");
	const isEditMode = Boolean(editMatrixId); // nếu có id -> đang chỉnh sửa
	const [personName, setPersonName] = useState([]);
	let finalType;

	if (isEditMode && matrixType) {
		finalType = matrixType; 
	} else {
		finalType =
			personName.includes("Mức độ") && personName.includes("Chuyên đề")
				? "both"
				: personName.includes("Chuyên đề")
				? "chapter"
				: personName.includes("Mức độ")
				? "level"
				: "both";
	}
// Reset data when personName changes
  useEffect(() => {
    if (!isEditMode && tagClassification.length > 0) {
      setData(
        tagClassification.map((item) => ({
          chapter: finalType === "level" ? "N/A" : item.chapter,
          levels: [{
            level: finalType === "chapter" ? "N/A" : item.level || "Không xác định",
            total: item.total || 0,
            questionCount: 0,
            score: 0,
          }],
        }))
      );
      setTotalScore(10); // Reset totalScore to default
    }
  }, [personName, tagClassification, finalType, isEditMode]);
	
	// Debug personName
  useEffect(() => {
    console.log("personName:", personName);
  }, [personName]);
	
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	useEffect(() => {
		if (editMatrixId && subjectOptions.length > 0) {
			fetchMatrixDetail(editMatrixId);
		}
	}, [editMatrixId, subjectOptions]);


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

	const fetchMatrixDetail = async (matrixId) => {
		try {
			const response = await ApiService.get(`/exam-matrices/${matrixId}`);
			const matrix = response.data?.data || {}; // luôn có object
			
			// ✅ set trực tiếp
			setMatrixName(matrix.matrixName || "");
			setSubjectChosen(matrix.subjectId || null);
			setBankChosen(matrix.questionBankId || null);
			
			const matrixTags = matrix.matrixTags || [];
			// ✅ Phân loại
			const hasOnlyChapter = matrixTags.every(tag => !tag.level || tag.level.trim() === "");
			const hasOnlyLevel = matrixTags.every(tag => !tag.chapter || tag.chapter.trim() === "");

			let detectedType = "both";
			if (hasOnlyChapter && !hasOnlyLevel) detectedType = "chapter";
			else if (hasOnlyLevel && !hasOnlyChapter) detectedType = "level";
			else if (hasOnlyChapter && hasOnlyLevel) detectedType = "chapter";
			setMatrixType(detectedType);

			// ✅ Nếu BOTH → cần gọi thêm tags-classification để merge total
			if (detectedType === "both") {
				const tagRes = await ApiService.get("/subjects/questions/tags-classification", {
					params: { subjectId: matrix.subjectId, questionBankId: matrix.questionBankId },
				});
				const classification = tagRes.data;

				const tags = matrixTags.map(tag => {
					const found = classification.find(c => c.chapter === tag.chapter && c.level === tag.level);
					return { ...tag, total: found ? found.total : 0 };
				});

				const groupedData = tags.reduce((acc, item) => {
					const existing = acc.find(entry => entry.chapter === item.chapter);
					if (existing) {
						existing.levels.push({ ...item });
					} else {
						acc.push({ chapter: item.chapter, levels: [{ ...item }] });
					}
					return acc;
				}, []);

				setData(
          groupedData.map(item => ({
            ...item,
            levels: item.levels.map(level => ({
              ...level,
              total: level.total || 0,
              questionCount: level.questionCount || 0,
              score: level.score || 0,
            })),
          }))
        );
      } else if (detectedType === "level") {
        const tagRes = await ApiService.get("/subjects/questions/tags-classification", {
          params: { subjectId: matrix.subjectId, questionBankId: matrix.questionBankId },
        });
        const classification = tagRes.data;
        setData(
          matrixTags.map(tag => {
            // Tìm tất cả các total theo level, lấy tổng hoặc giá trị lớn nhất
            const matches = classification.filter(c => c.level === tag.level);
            const total = matches.length > 0 ? matches.reduce((sum, c) => sum + c.total, 0) : (tag.total || 0);
            return {
              level: tag.level || "Không xác định",
              total: total,
              questionCount: tag.questionCount || 0,
              score: tag.score || 0,
            };
          })
        );
      } else { // detectedType === "chapter"
        const tagRes = await ApiService.get("/subjects/questions/tags-classification", {
          params: { subjectId: matrix.subjectId, questionBankId: matrix.questionBankId },
        });
        const classification = tagRes.data;
        setData(
          matrixTags.map(tag => {
            const matches = classification.filter(c => c.chapter === tag.chapter);
            const total = matches.length > 0 ? matches.reduce((sum, c) => sum + c.total, 0) : (tag.total || 0);
            return {
              chapter: tag.chapter,
              total: total,
              questionCount: tag.questionCount || 0,
              score: tag.score || 0,
            };
          })
        );
      }
      const matrixTotalScore = (matrix.matrixTags || []).reduce(
        (sum, tag) => sum + (tag.score || 0),
        0
      );
      setTotalScore(matrixTotalScore > 0 ? matrixTotalScore : 10);
			console.log("totalScore set in fetchMatrixDetail:", matrixTotalScore); // Debug giá trị totalScore
    } catch (error) {
      console.error("❌ Lỗi tải chi tiết ma trận:", error);
      Swal.fire("Lỗi!", "Không thể tải chi tiết ma trận", "error");
    }
	};

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


  const handleChange = (event) => {
    const value = event.target.value; 
		// Lấy phần tử cuối cùng (mục vừa chọn)
		const lastSelected = value[value.length - 1]; 
		setPersonName([lastSelected]);
  };

	useEffect(() => {
		if (editMatrixId && data.length > 0) return; 
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
      const newData = [...prevData];
      if (matrixType === "level") {
        // Trong chế độ level, data là mảng object cấp 1, không có levels
        if (!newData[chapterIndex]) {
          console.error("Invalid index:", chapterIndex);
          return prevData;
        }
        newData[chapterIndex] = { ...newData[chapterIndex], [field]: value };
      } else if (matrixType === "chapter") {
        // Trong chế độ chapter, data là mảng object cấp 1, không có levels
        if (!newData[chapterIndex]) {
          console.error("Invalid index:", chapterIndex);
          return prevData;
        }
        newData[chapterIndex] = { ...newData[chapterIndex], [field]: value };
      } else {
        // Chế độ both, xử lý với levels
        if (!newData[chapterIndex] || !newData[chapterIndex].levels[levelIndex]) {
          console.error("Invalid index:", chapterIndex, levelIndex);
          return prevData;
        }
        newData[chapterIndex].levels[levelIndex] = {
          ...newData[chapterIndex].levels[levelIndex],
          [field]: value,
        };
      }
      return newData;
    });
  };
	
	const totalSelectedQuestions = Array.isArray(data)
  ? data.reduce((sum, item) => {
      const levels = Array.isArray(item.levels) ? item.levels : [item]; 
      return sum + levels.reduce((subSum, lvl) => subSum + (lvl.questionCount || 0), 0);
    }, 0)
  : 0;


	const [difficultyData, setDifficultyData] = useState([]);

	useEffect(() => {
		const newDifficultyData = [];

		(data || []).forEach((item) => {
			const levels = Array.isArray(item.levels) ? item.levels : [item]; // nếu không có levels -> treat như 1 mảng 1 phần tử

			levels.forEach((level) => {
				const existing = newDifficultyData.find((d) => d.level === level.level);
				if (existing) {
					existing.questionCount += (level.questionCount || 0);
				} else {
					newDifficultyData.push({ level: level.level, questionCount: (level.questionCount || 0) });
				}
			});
		});

		setDifficultyData(newDifficultyData);
	}, [data]);

	
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
		
		if (editMatrixId) {
			handleUpdateMatrix();
		} else {
			handleCreateMatrix();
		}
	};
		
	const handleCreateMatrix = async () => {
		const examMatrixData = {
			matrixName: matrixName,
			subjectId: subjectChosen,
			questionBankId: bankChosen,
			matrixTags: data.flatMap((item) =>
				item.levels.map((level) => ({
					chapter: item.chapter,
					level: level.level,
					questionCount: level.questionCount,
					score: level.score,
				}))
			),
		};

		try {
			const response = await ApiService.post("/exam-matrices", examMatrixData);
			console.log("✅ Tạo mới thành công: ", response.data);
			Swal.fire({
				icon: "success",
				title: "Tạo ma trận thành công!",
				text: "Ma trận đề thi đã được lưu.",
			}).then(() => {
				navigate("/staff/matrix-exam");
			});
		} catch (error) {
			console.error("❌ Lỗi khi tạo mới ma trận đề: ", error);
			Swal.fire("Lỗi!", "Không thể tạo ma trận!", "error");
		}
	};

	const handleUpdateMatrix = async () => {
		const examMatrixData = {
			matrixName: matrixName,
			subjectId: subjectChosen,
			questionBankId: bankChosen,
			matrixTags: data.flatMap((item) =>
				item.levels.map((level) => ({
					chapter: item.chapter,
					level: level.level,
					questionCount: level.questionCount,
					score: level.score,
				}))
			),
		};

		try {
			const response = await ApiService.put(`/exam-matrices/${editMatrixId}`, examMatrixData);
			console.log("✅ Cập nhật thành công: ", response.data);
			Swal.fire({
				icon: "success",
				title: "Cập nhật ma trận thành công!",
				text: "Thông tin ma trận đề thi đã được cập nhật.",
			}).then(() => {
				navigate("/staff/matrix-exam");
			});
		} catch (error) {
			console.error("❌ Lỗi khi cập nhật ma trận đề: ", error);
			Swal.fire("Lỗi!", "Không thể cập nhật ma trận!", "error");
		}
	};

	useEffect(() => {
		console.log("totalScore in DetailExamMatrixPage:", totalScore);
	}, [totalScore]);

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
								minWidth: "220px",
								fontSize: "14px",
							},
							"& .MuiInputLabel-root": {
								fontSize: "14px",
							},
						}}
					/>
					
					<Autocomplete
						className="ms-2"
						options={subjectOptions} 
						disabled={!!editMatrixId}
						getOptionLabel={(option) => option.label}
						value={subjectOptions.find(opt => opt.value === subjectChosen) || null}
						onChange={(event, newValue) => setSubjectChosen(newValue?.value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Chọn phân môn"
								size="small"
								sx={{
									backgroundColor: "white",
									minWidth: 220,
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
						disabled={!!editMatrixId}
						getOptionLabel={(option) => option.label}
						value={bankOptions.find(opt => opt.value === bankChosen) || null}
						onChange={(event, newValue) => setBankChosen(newValue?.value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Chọn bộ câu hỏi"
								size="small"
								sx={{
									backgroundColor: "white",
									minWidth: 220,
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

					<FormControl sx={{ ml: 1, minWidth: 220 }} size="small">
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
							disabled={!!editMatrixId}
							input={
								<OutlinedInput
									label="Phân theo"
									sx={{
										minWidth: 220,
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
					<CancelButton onClick={() => navigate("/staff/matrix-exam")}>Hủy</CancelButton>
					<AddButton onClick={handleSaveMatrix} className="ms-2">
						<i className={`fas ${editMatrixId ? "fa-save" : "fa-plus"} me-2`}></i>
						{editMatrixId ? "Cập nhật" : "Tạo ma trận"}
					</AddButton>
				</div>

			</div>
			{finalType === "both" && (
      <MatrixBoth
        data={data}
        personName={personName}
        handleInputChange={handleInputChange}
        totalSelectedQuestions={totalSelectedQuestions}
        difficultyData={difficultyData}
        totalScore={totalScore}
        setTotalScore={setTotalScore}
      />
    )}

    {finalType === "chapter" && (
      <MatrixChapter
        data={data}
				handleInputChange={handleInputChange}
        personName={personName}
        totalSelectedQuestions={totalSelectedQuestionsChapter}
				totalScore={totalScore}
  			setTotalScore={setTotalScore}
      />
    )}

    {finalType === "level" && (
      <MatrixLevel
        data={data}
				handleInputChange={handleInputChange}
        personName={personName}
        totalSelectedQuestions={totalSelectedQuestionsLevel}
				totalScore={totalScore}
  			setTotalScore={setTotalScore}
      />
    )}

		</div>
	);
};

export default DetailExamMatrixPage;
