import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate, useLocation  } from "react-router-dom";
import { useOutletContext } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListQuestionPage.css";
import Swal from "sweetalert2";
import CreatableSelect from "react-select/creatable";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ApiService from "../../services/apiService";
import { useSelector } from "react-redux";
import { CircularProgress, Typography, Box } from "@mui/material";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import AiGenerate from "../../components/AiGenerate/AiGenerate";
import AddQuestion from "../../components/AddQuestion/AddQuestion";
import DragDropModal from "../../components/DragDrop/DragDrop";
import Modal from "react-bootstrap/Modal";

const ListQuestionPage = () => {
	const user = useSelector((state) => state.auth.user);
	
	const { subjectId, questionBankId } = useParams();
	const [ subjectName, setSubjectName ] = useState("");
	const [ questionBankName, setQuestionBankName ] = useState("");	

	const [ questions, setQuestions ] = useState([]);
	const [allChapters, setAllChapters] = useState([]);
	const [allLevels, setAllLevels] = useState([]);

	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);

	const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
	const [showAiGenerate, setShowAiGenerate] = useState(false);
	const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

	const { selectedChapter } = useOutletContext(); // Lấy selectedChapter từ context
	const [selectedQuestions, setSelectedQuestions] = useState([]); // State để theo dõi câu hỏi được chọn
  const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const [modalImage, setModalImage] = useState(null);

  const handleClose = () => setModalImage(null);
	const handleOpenFormAddQuestion = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.set("showAddQuestionForm", "true");
		navigate(`${location.pathname}?${newSearchParams.toString()}`);
		setShowAddQuestionForm(true);
	};

	const handleCloseFormAddQuestion = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.delete("showAddQuestionForm");
		const newUrl = newSearchParams.toString()
			? `${location.pathname}?${newSearchParams.toString()}`
			: location.pathname;
		navigate(newUrl, { replace: true });
		setShowAddQuestionForm(false);
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setShowAddQuestionForm(params.get("showAddQuestionForm") === "true");
	}, [location.search]);

	const handleOpenForm = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.set("showFormDivide", "true");
		navigate(`${location.pathname}?${newSearchParams.toString()}`);
		setShowAiGenerate(true);
	};

	const handleCloseForm = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.delete("showFormDivide");
		const newUrl = newSearchParams.toString()
			? `${location.pathname}?${newSearchParams.toString()}`
			: location.pathname;
		navigate(newUrl, { replace: true });
		setShowAiGenerate(false);
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setShowAiGenerate(params.get("showFormDivide") === "true");
	}, [location.search]);

	useEffect(() => {
		const event = new CustomEvent("toggleAiForm", { detail: showAiGenerate });
		window.dispatchEvent(event);
	}, [showAiGenerate]);

	useEffect(() => {
		const event = new CustomEvent("toggleAddQuestionForm", { detail: showAddQuestionForm });
		window.dispatchEvent(event);
	}, [showAddQuestionForm]);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.get("/subjects/questions", {
				params: { subId: subjectId, qbId: questionBankId, keyword: keyword, page: page, pageSize: pageSize },
			});
			setQuestions(response.data.questions);
			setSubjectName(response.data.subjectName);
			setQuestionBankName(response.data.questionBankName);
			setTotalCount(response.data.totalCount);
			setAllChapters(response.data.allChapter.map((chapter) => ({ value: chapter, label: chapter })));
			setAllLevels(response.data.allLevel.map((level) => ({ value: level, label: level })));
		} catch (error) {
			console.error("Failed to fetch data:", error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [subjectId, questionBankId, keyword, page, pageSize]);

	const groupedQuestions = {};
	questions.forEach((question) => {
		const chapter = question.tags[0] || "Chương chưa xác định";
		const level = question.tags[1] || "Mức độ chưa xác định";

		if (!groupedQuestions[chapter]) {
				groupedQuestions[chapter] = {};
		}
		if (!groupedQuestions[chapter][level]) {
				groupedQuestions[chapter][level] = [];
		}

		groupedQuestions[chapter][level].push(question);
	});

	const [openModal, setOpenModal] = useState(false);
	
	const handleUploadClick = () => {
		setOpenModal(true);
	};

	const handleFilesDropped = (files) => {
		console.log("Files received:", files);
		// 👉 Ở đây bạn có thể xử lý upload API
		setOpenModal(false);
	};

	const handleUploadfile = async () => {
    const { value: file } = await Swal.fire({
			title: "Chọn file",
			input: "file",
			inputAttributes: {
					accept: ".docx,.txt",
					"aria-label": "Tải lên",
			},
    });

    if (file) {
			const formData = new FormData();
			formData.append("file", file);

			setIsUploading(true);
			setUploadProgress(0);
			document.getElementById("uploadModal").classList.add("show");
			document.getElementById("uploadModal").style.display = "block";

			try {
				const response = await ApiService.post(`/file/upload-file-question`, formData, {
					params: { subjectId, questionBankId },
					headers: { "Content-Type": "multipart/form-data" },
					onUploadProgress: (progressEvent) => {
						if (progressEvent.total) {
							const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

							setUploadProgress((prevProgress) => {
								// Tăng từ từ, nhưng không nhảy đột ngột
								if (percentCompleted > prevProgress) {
										return percentCompleted < 99 ? percentCompleted : 99;
								}
								return prevProgress;
							});
						}
						},
				});

				setUploadProgress(100); // Khi hoàn thành, đặt 100%

				Swal.fire({
						title: "Tải lên thành công",
						icon: "success",
				});

				fetchData();
			} catch (error) {
					Swal.fire({
						title: "Lỗi",
						text: error.message,
						icon: "error",
					});
			}

			document.getElementById("uploadModal").classList.remove("show");
			document.getElementById("uploadModal").style.display = "none";
			setIsUploading(false);
			setUploadProgress(0);
    }
	};

	const [editQuestionId, setEditQuestionId] = useState(null);
	const [shuffleQuestion, setShuffleQuestion] = useState(false);
	const [selectedQuestionBankId, setSelectedQuestionBankId] = useState(null);
	const [selectedGroups, setSelectedGroups] = useState([]);

	const [newQuestion, setNewQuestion] = useState({
		questionType: "single-choice",
		questionStatus: "available",
		questionText: "",
		options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
		isRandomOrder: false,
		tags: ["", ""],
	});

	const handleAddOption = () => {
		setNewQuestion({ ...newQuestion, options: [...newQuestion.options, { optionText: "", isCorrect: false }] });
	};

	const handleRemoveOption = (index) => {
		const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
		setNewQuestion({ ...newQuestion, options: updatedOptions });
	};

	const handleTagChange = (index, newValue) => {
    setNewQuestion((prev) => {
			const updatedTags = [...prev.tags];
			updatedTags[index] = newValue?.value || "";
			return { ...prev, tags: updatedTags };
    });
	};

	const preAddQuestion = () => {
		setEditQuestionId(null); 
		setNewQuestion({
			questionType: "single-choice",
			questionStatus: "available",
			questionText: "",
			options: [{ optionText: "", isCorrect: false }, 
			{ optionText: "", isCorrect: false }],
			tags: ["", ""],
			isRandomOrder: false,
		});
		setSelectedGroups([]);
	};

	const handleAddQuestion = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.post("/subjects/add-question", 
				newQuestion,
				{ 
					params: { subjectId: subjectId, questionBankId: questionBankId, userId: user.id }, 
				}
			);

			console.log("Thêm câu hỏi mới:", response.data);
			fetchData();
		} catch (error) {
			console.error("Failed to add question:", error);
		}
		setIsLoading(false);
	};

	const handleUpdateQuestion = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.put(`/subjects/update-question/${editQuestionId}`,
				newQuestion,
				{
					params: { subjectId: subjectId, questionBankId: questionBankId, userId: user.id },
				}
			);

			fetchData();
		} catch (error) {
			console.error("Failed to update question:", error);
		}
		setIsLoading(false);
	};

	const handleSaveQuestion = () => {
		if (newQuestion.questionText.trim() === "" || newQuestion.options.some(opt => opt.optionText.trim() === "")) {
			Swal.fire("Lỗi", "Vui lòng nhập đầy đủ câu hỏi và đáp án!", "error");
			return;
		}

		if (editQuestionId !== null) {
			// Cập nhật câu hỏi
			// setQuestions(
			// 	questions.map(q => (q.id === editQuestionId ? { ...newQuestion, id: editQuestionId } : q))
			// );
			handleUpdateQuestion();
			setEditQuestionId(null);

		} else {
			// Thêm câu hỏi mới
			// const newId = questions.length + 1;
			// setQuestions([...questions, { ...newQuestion, id: newId }]);
			console.log("Thêm câu hỏi mới:", newQuestion);
			handleAddQuestion();
		}
			setNewQuestion({ questionText: "", options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }], tags: ["", ""], isRandomOrder: false });
			document.getElementById("closeModalBtn").click();
	};

	// const handleAddQuestion = () => {
	// 	setEditQuestionId(null); // Không có ID nghĩa là thêm mới
	// 	setNewQuestion({ questionText: "", options: [] }); // Reset dữ liệu
	// 	setSelectedGroups([]); // Khi thêm mới, CreatableSelect sẽ trống
	// 	new window.bootstrap.Modal(document.getElementById("questionModal")).show();
	// };
	
	const preEditQuestion = (question) => {
		setEditQuestionId(question.questionId);

		// const chapter = question.tags?.[0] ? { label: question.tags[0], value: question.tags[0] } : "";
		// const level = question.tags?.[1] ? { label: question.tags[1], value: question.tags[1] } : "";

		setNewQuestion({ 
			questionType: question.questionType,
			questionStatus: question.questionStatus,
			questionText: question.questionText, 
			options: question.options,
			isRandomOrder: question.isRandomOrder,
			tags: [question.tags?.[0], question.tags?.[1]],
		});

		new window.bootstrap.Modal(document.getElementById("questionModal")).show(); 
	};

	const handleDelete = (id) => {
		Swal.fire({
			title: "Bạn có chắc chắn xóa?",
			text: "Bạn sẽ không thể hoàn tác hành động này!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
		}).then((result) => {
			if (result.isConfirmed) {
				console.log("Xóa tài khoản có ID:", id);
				setQuestions(prev => prev.filter(question => question.questionId !== id));
				Swal.fire({
				title: "Đã xóa!",
				text: "Câu hỏi đã bị xóa.",
				icon: "success",
				});
			}
		});
	};
	const [collapsedChapters, setCollapsedChapters] = useState({});
	const toggleChapter = (chapter) => {
  setCollapsedChapters((prev) => ({
    ...prev,
    [chapter]: !prev[chapter],
  }));
};

	// Lọc câu hỏi theo selectedChapter
  const filteredQuestions = selectedChapter
    ? { [selectedChapter]: groupedQuestions[selectedChapter] || {} }
    : groupedQuestions;

	const [editingChapter, setEditingChapter] = useState(null);
	const [editedName, setEditedName] = useState("");

	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between"> <Link to="/staff/question" className="breadcrumb-between">Ngân hàng câu hỏi</Link></span>
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between"><Link to={`/staff/question/${subjectId}`} className="breadcrumb-between">{subjectName}</Link></span>
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">{questionBankName}</span>
			</nav>

			{showAiGenerate ? (
				<AiGenerate onClose={handleCloseForm}/>
			) : showAddQuestionForm ? (
        <AddQuestion onClose={handleCloseFormAddQuestion}/>
      ) : (
				<>
				<div className="d-flex">
					<div className="sample-card-header d-flex justify-content-between align-items-center mb-2">
						<div className='left-header d-flex align-items-center'>
							<div className="search-box rounded d-flex align-items-center">
								<i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
								<input
									type="text"
									className="search-input w-100"
									placeholder="Tìm kiếm..."
									value={keyword}
									onChange={handleKeywordChange}
								/>
							</div>
						</div>
					</div>
					<div className="d-flex justify-content-end ms-auto">
						{/* <AddButton 
							data-bs-toggle="modal"
							data-bs-target="#questionModal"
							onClick={() => { preAddQuestion(); }}
						>
							<i className="fas fa-plus me-2"></i>Thêm câu hỏi
						</AddButton> */}
						<>
							<AddButton onClick={handleOpenFormAddQuestion}>
								<i className="fas fa-plus me-2"></i>Thêm câu hỏi
							</AddButton>
							{showAddQuestionForm && (
									<AddQuestion onClose={() => setShowAddQuestionForm(false)} />
								)}
						</>
						<AddButton className="upload-btn-hover" style={{backgroundColor: "#28A745", marginLeft: "10px"}} onClick={handleUploadClick}>
							<i className="fas fa-upload me-2"></i>Upload File
						</AddButton>
						<>
							<AddButton className="ms-2" onClick={handleOpenForm}>
								<i className="fas fa-brain me-2"></i>AI sinh câu hỏi
							</AddButton>

							{showAiGenerate && (
								<AiGenerate onClose={() => setShowAiGenerate(false)} />
							)}
						</>
						<div className="modal fade" id="uploadModal" tabIndex="-1" aria-hidden="true"
						style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
						>
							<div className="modal-dialog modal-dialog-centered small-modal" >
								<div className="modal-content text-center p-4 container" style={{ width: "500px" }}>
									<div className="modal-body">
										{/* Vòng tròn tiến trình MUI */}
										<Box sx={{ position: "relative", display: "inline-flex" }}>
											<CircularProgress variant="determinate" value={uploadProgress} size={80} />
											<Box
												sx={{
													top: 0,
													left: 0,
													bottom: 0,
													right: 0,
													position: "absolute",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Typography variant="caption" component="div" sx={{ color: "text.secondary", fontSize: "18px" }}>
													{`${uploadProgress}%`}
												</Typography>
											</Box>
										</Box>
										<p className="mt-3">Đang tải lên...</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* {questions.map((question) => (
						<div key={question.questionId} className="card mb-2">
								<div className="card-header d-flex justify-content-between">
										<h6>{question.questionText}</h6>
										<div className="d-flex" style={{ marginLeft: "50px" }}>
										<button className="btn btn-primary me-2" onClick={() => preEditQuestion(question)}>Edit</button>
										<button className="btn btn-danger">Delete</button>
										</div>
								</div>
								<ul className="list-group">
										{question.options.map((option, index) => (
										<li key={index} className={option.isCorrect ? "list-group-item list-group-item-success" : "list-group-item"}>
												{option.optionText}
										</li>
										))}
								</ul>
						</div>
				))} */}
				{Object.keys(groupedQuestions).length === 0 ? (
					<div
						className="d-flex align-items-center justify-content-center"
						style={{ minHeight: "350px" }} // Hoặc bạn có thể dùng height: "60vh"
					>
						<div className="text-center p-4 rounded shadow-sm bg-light text-muted" style={{ width: "400px"}}>
							<i className="fa-solid fa-circle-info fa-2x mb-2"></i>
							<h5>Không có dữ liệu</h5>
						</div>
					</div>
					) : (
					Object.entries(filteredQuestions).map(([chapter, levels]) => (
						<div className="mt-2 pb-0" key={chapter}>
							<div className="d-flex justify-content-between align-items-center mb-0">
								<div className="mb-2" style={{ display: "flex", alignItems: "center", gap: "8px", flexGrow: 1, width: "100%" }}>
									{editingChapter === chapter ? (
										<div className="d-flex align-items-center gap-2 w-100">
											<input
												className="form-control form-control-sm shadow-sm"
												style={{
													flexGrow: 1,
													fontSize: "16px",
													padding: "6px 12px",
													borderRadius: "8px",
													border: "1px solid #ced4da",
												}}
												value={editedName}
												autoFocus
												onChange={(e) => setEditedName(e.target.value)}
												onBlur={() => {
													handleUpdateChapterName(chapter, editedName);
													setEditingChapter(null);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														handleUpdateChapterName(chapter, editedName);
														setEditingChapter(null);
													}
												}}
											/>
											<button
												className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center"
												title="Lưu"
												onClick={() => {
													handleUpdateChapterName(chapter, editedName);
													setEditingChapter(null);
												}}
												style={{ width: "36px", height: "36px", borderRadius: "50%" }}
											>
												<i className="fa-solid fa-check"></i>
											</button>
											<button
												className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
												title="Hủy"
												onClick={() => setEditingChapter(null)}
												style={{ width: "36px", height: "36px", borderRadius: "50%" }}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
									) : (
										<div className="container-chapter d-flex justify-content-between align-items-center">
											<h5 className="m-0 p-2 py-3">
												{chapter}
												<i
													className="fa-solid fa-pen-to-square ms-3"
													style={{ fontSize: "18px", cursor: "pointer" }}
													onClick={() => {
														setEditingChapter(chapter);
														setEditedName(chapter);
													}}
												></i>
											</h5>
											<button
												className="btn btn-link text-decoration-none position p-0 pe-1 "
												style={{ color: "black" }}
												onClick={() => toggleChapter(chapter)}
											>
												<ArrowDropDownIcon
													fontSize="large"
													style={{
														transform: collapsedChapters[chapter] ? "rotate(180deg)" : "rotate(0deg)",
														transition: "transform 0.3s ease",
													}}
												/>
											</button>
										</div>
									)}
								</div>
								
							</div>
							{!collapsedChapters[chapter] && (
								<div className="chapter-content">
									{Object.entries(levels).map(([level, questions]) => (
										<div key={level}>		
											{questions.map((question) => {
												const hasImage = question.imgLinks && question.imgLinks.length > 0;

												return (
													<div key={question.questionId} className="question-card mb-3 p-3 bd-radius-8 pb-2 bg-white">
														<p className="mb-1 fw-bold">Câu hỏi:</p>
														<div className="d-flex">
															{/* Nội dung câu hỏi */}
															<div className={`${hasImage ? "col-9" : "col-12"} card-header mb-2`}>
																<div className="d-flex">
																	{/* <button
																		className="btn btn-link text-decoration-none position p-0"
																		style={{ color: "black" }}
																		data-bs-toggle="collapse" 
																		data-bs-target={`#collapse-${question.questionId}`}
																		aria-expanded="false"
																		aria-controls={`collapse-${question.questionId}`}
																	>            
																		<ArrowDropDownIcon />
																	</button> */}

																	<div className="question-text d-flex justify-content-between align-items-start p-2"
																		style={{
																			width: "100%", 
																			...(hasImage ? { minHeight: "160px", marginRight: "10px"} : {})
																		}}
																	>
																		<div className="me-2">
																			<p className="mb-1" style={{ fontSize: "14px" }}>
																				{question.questionText}
																			</p>
																			{question.tags?.slice(1).map((tag, index) => (
																				<p className="m-0 tag-level" key={index}>{tag}</p>
																			))}
																		</div>

																		{/* Dấu 3 chấm phía bên phải */}
																		<div className="dropdown">
																			<button
																				className="btn btn-link p-0"
																				type="button"
																				data-bs-toggle="dropdown"
																				aria-expanded="false"
																			>
																				<i className="fa-solid fa-ellipsis-vertical" style={{ fontSize: "20px", color: "#A6A6A6" }}></i>
																			</button>
																			<ul className="dropdown-menu dropdown-menu-end">
																				<li>
																					<button className="dropdown-item" onClick={() => preEditQuestion(question)}>
																						<i className="fa-solid fa-pen-to-square me-2"></i> Chỉnh sửa
																					</button>
																				</li>
																				<li>
																					<button className="dropdown-item text-danger" onClick={() => handleDelete(question.questionId)}>
																						<i className="fa-solid fa-trash-can me-2"></i> Xóa
																					</button>
																				</li>
																			</ul>
																		</div>
																	</div>
																</div>
															</div>

															{/* Hình ảnh nếu có */}
															{hasImage && (
																<div
																	className="col-3 question-image-card bd-radius-8 mb-0"
																	style={{
																		maxHeight: "160px",
																		display: "flex",
																		justifyContent: "center",
																		alignItems: "center",
																		overflow: "hidden"
																	}}
																>
																	{question.imgLinks.map((img, index) => (
																		<img
																			key={index}
																			src={img}
																			alt={`Hình ${index + 1}`}
																			style={{
																				height: "100%",
																				width: "auto",
																				objectFit: "contain"
																			}}
																		/>
																	))}
																</div>
															)}
														</div>
														<div className="d-flex justify-content-between align-items-center mb-3 mt-1">
															<div className="form-check form-switch m-0 ">
																<input 
																	className="form-check-input" 
																	type="checkbox" 
																	checked={question.isRandomOrder}
																	readOnly
																/>
																<label className="form-check-label">Đảo thứ tự đáp án</label>
															</div>
															<div className="form-check form-switch m-0">
																<input 
																	className="form-check-input" 
																	type="checkbox" 
																	checked={question.questionType === 'multiple-choice'}
																	readOnly
																/>
																<label className="form-check-label">Multiple Choice</label>
															</div>
														</div>

														{/* Đáp án */}
														<div id={`collapse-${question.questionId}`} className="collapse show">
															<ul className="list-group" style={{ borderRadius: "0 0 5px 5px" }}>
																{question.options.map((option, index) => (
																	<div key={index} className="d-flex align-items-center mb-1">
																		<input
																			type="radio"
																			name={`answer-${question.questionId}`}
																			className="form-check-input mt-1 me-2"
																			checked={option.isCorrect}
																			readOnly
																		/>
																		<li
																			className={`flex-grow-1 ${
																				option.isCorrect ? "list-group-item-success" : "list-options"
																			}`}
																			style={{ listStyle: "none" }}
																		>
																			{option.optionText}
																		</li>
																	</div>
																))}
															</ul>
														</div>
													</div>
												);
											})}
										</div>
									))}
								</div>
							)}
						</div>
					)))}

				{/* Modal Bootstrap thuần */}
				<div className="modal fade" id="questionModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered modal-xl">
					<div className="modal-content p-3">
						<div className="modal-header">
							<h5 className="modal-title">{editQuestionId ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="d-flex" style={{ display: "flex", width: "100%", gap: "10px" }}>
								<div style={{ flex: 1 }}>
									<p className="mb-1">Chọn chuyên đề kiến thức:</p>
									<CreatableSelect
										isClearable
										options={allChapters}
										value={newQuestion.tags[0] ? { value: newQuestion.tags[0], label: newQuestion.tags[0] } : null}
										onChange={(newValue) => handleTagChange(0, newValue)}
										menuPortalTarget={document.body}
										placeholder="Chọn chuyên đề kiến thức"
										styles={{
											menuPortal: (base) => ({ ...base, zIndex: 9999 }),
											container: (provided) => ({ ...provided, flex: 1 })
										}}
									/>
								</div>

								<div style={{ flex: 1 }}>
									<p className="mb-1">Mức độ:</p>
									<CreatableSelect
										isClearable
										options={allLevels}
										value={newQuestion.tags[1] ? { value: newQuestion.tags[1], label: newQuestion.tags[1] } : null}
										onChange={(newValue) => handleTagChange(1, newValue)}
										menuPortalTarget={document.body}
										placeholder="Chọn mức độ"
										styles={{
											menuPortal: (base) => ({ ...base, zIndex: 9999 }),
											container: (provided) => ({ ...provided, flex: 1 })
										}}
									/>
								</div>

							</div>
								<div>
									<p className="mb-1 mt-2"> <span style={{ color: "red" }}>*</span> Câu hỏi:</p>
									<textarea
										type="text"
										className="form-control mb-2"
										placeholder="Nhập câu hỏi"
										value={newQuestion.questionText}
										onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
									/>
								</div>
								<div className="form-check mt-0 mb-2">
									<input
										type="checkbox"
										className="form-check-input"
										id="shuffleQuestion"
										checked={newQuestion.isRandomOrder}
										onChange={(e) => setNewQuestion({ ...newQuestion, isRandomOrder: e.target.checked })}
									/>
									<label className="form-check-label" htmlFor="shuffleQuestion">
										Đảo thứ tự đáp án
									</label>
								</div>
								{newQuestion.options.map((option, index) => (
									<div key={index} className="input-group mb-2">
										<div className="input-group-text">
											<input
												className="form-check-input m-0"
												type="checkbox"
												checked={option.isCorrect}
												onChange={() => {
													const newOptions = [...newQuestion.options];
													newOptions[index].isCorrect = !newOptions[index].isCorrect;
													setNewQuestion({ ...newQuestion, options: newOptions });
												}}
											/>
										</div>
										<textarea
											className="form-control m-0"
											placeholder="Nhập đáp án"
											value={option.optionText}
											rows={1} // Hiển thị tối thiểu 1 dòng, tự động mở rộng khi nhập
											onChange={(e) => {
												const newOptions = [...newQuestion.options];
												newOptions[index].optionText = e.target.value;
												setNewQuestion({ ...newQuestion, options: newOptions });
											}}
											style={{ resize: "none", overflow: "hidden", minHeight: "40px" }} // Ngăn resize tay, tự động mở rộng
											onInput={(e) => {
												e.target.style.height = "auto"; // Reset chiều cao để tránh bị giãn bất thường
												e.target.style.height = e.target.scrollHeight + "px"; // Set chiều cao theo nội dung
											}}
										/>
										<button className="btn btn-danger d-flex align-items-center justify-content-center" onClick={() => handleRemoveOption(index)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
								))}
								<button className="btn btn-outline-secondary mt-1" style={{fontSize: "14px"}} onClick={handleAddOption}>
									<i className="fa-solid fa-plus me-2"></i>
									Thêm đáp án
								</button>
							</div>
							<div className="modal-footer">
								<CancelButton style={{width: "100px"}} id="closeModalBtn"data-bs-dismiss="modal">Hủy</CancelButton>
								<AddButton style={{width: "100px"}} onClick={handleSaveQuestion}>
									{editQuestionId ? "Cập nhật" : "Lưu"}
								</AddButton>
							</div>
						</div>
					</div>	
				</div>
				</>
			)}
			<DragDropModal
				open={openModal}
				onClose={() => setOpenModal(false)}
				onFilesDropped={handleFilesDropped}
			/>
			{/* Modal hiển thị ảnh lớn */}
      <Modal show={!!modalImage} onHide={handleClose} centered size="lg">
        <Modal.Body className="text-center p-0">
          <img
            src={modalImage}
            alt="Xem ảnh lớn"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ListQuestionPage;
