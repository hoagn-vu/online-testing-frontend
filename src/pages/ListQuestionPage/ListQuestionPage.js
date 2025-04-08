import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation  } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListQuestionPage.css";
import Swal from "sweetalert2";
import CreatableSelect from "react-select/creatable";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ApiService from "../../services/apiService";
import { useSelector } from "react-redux";
import { CircularProgress, Typography, Box } from "@mui/material";

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
				Swal.fire({
				title: "Đã xóa!",
				text: "Câu hỏi đã bị xóa.",
				icon: "success",
				});
			}
		});
	};

	return (
		<div className=" list-question-container">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between"> <Link to="/staff/question" className="breadcrumb-between">Ngân hàng câu hỏi</Link></span>
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between"><Link to={`/staff/question/${subjectId}`} className="breadcrumb-between">{subjectName}</Link></span>
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">{questionBankName}</span>
			</nav>
	
			<div className="d-flex">
				<div className="search-container">
					<div className="search-box me-2 rounded d-flex align-items-center">
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
				<div className="d-flex justify-content-end ms-auto">
					<button
						className="btn btn-success"
						data-bs-toggle="modal"
						data-bs-target="#questionModal"
						onClick={() => { preAddQuestion(); }}
					>
						Thêm câu hỏi mới
					</button>
					<button className="upload-btn ms-2" onClick={handleUploadfile}>
						Upload File
					</button>
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
			{Object.entries(groupedQuestions).map(([chapter, levels]) => (
				<div key={chapter}>
					<h4 className="mt-4 mb-3">{chapter}</h4>
					{Object.entries(levels).map(([level, questions]) => (
						<div key={level}>
							<div>
								{questions.map((question) => (
									<div key={question.questionId} className="card mb-2">
										<div className="card-header d-flex justify-content-between ps-2">
												<div className="d-flex ">
														<button 
																className="btn btn-link text-decoration-none position p-0 pe-1 "
																style={{color: "black"}}
																data-bs-toggle="collapse" 
																data-bs-target={`#collapse-${question.questionId}`}
																aria-expanded="false"
																aria-controls={`collapse-${question.questionId}`}
														>            
																<ArrowDropDownIcon />
														</button>
														<div className="d-flex flex-column justify-content-center">
															<h6 className="mb-0">{question.questionText}</h6>
															{question.tags?.slice(1).map((tag, index) => (
																<p className="m-0 tag-level" key={index}>{tag}</p>
															))}
														</div>

												</div>
												<div className="d-flex" style={{ marginLeft: "50px" }}>
														<button className="btn btn-primary me-2" onClick={() => preEditQuestion(question)}>
																Edit
														</button>
														<button className="btn btn-danger" onClick={() => handleDelete()}>
																Delete
														</button>
												</div>
										</div>
										<div id={`collapse-${question.questionId}`} className="collapse show">
												<ul className="list-group" style={{ borderRadius: "0 0 5px 5px" }}>
														{question.options.map((option, index) => (
																<li key={index} className={option.isCorrect ? "list-group-item list-group-item-success" : "list-group-item"}>
																		{option.optionText}
																</li>
														))}
												</ul>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			))}

		{/* Modal Bootstrap thuần */}
		<div className="modal fade" id="questionModal" tabIndex="-1" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered modal-xl">
				<div className="modal-content">
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
							<button className="btn btn-outline-secondary mt-1" onClick={handleAddOption}>
								<i className="fa-solid fa-plus me-2"></i>
								Thêm đáp án
							</button>
						</div>
						<div className="modal-footer">
							<button className="btn btn-success" onClick={handleSaveQuestion}>
								{editQuestionId ? "Cập nhật" : "Lưu"}
							</button>
							<button id="closeModalBtn" className="btn btn-danger" data-bs-dismiss="modal">
								Hủy
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListQuestionPage;
