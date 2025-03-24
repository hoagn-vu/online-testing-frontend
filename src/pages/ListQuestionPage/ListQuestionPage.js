	import React, { useEffect, useState } from "react";
	import { useParams, Link } from "react-router-dom";
	import "bootstrap/dist/css/bootstrap.min.css";
	import "./ListQuestionPage.css";
	import Swal from "sweetalert2";
	import SearchBox from "../../components/SearchBox/SearchBox";
	import CreatableSelect from "react-select/creatable";
	import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
	import ApiService from "../../services/apiService";

	const ListQuestionPage = () => {
		const { subjectId, questionBankId } = useParams();
		const [ questions, setQuestions ] = useState([]);
		const [ subjectName, setSubjectName ] = useState("");

		const fetchData = async () => {
			const response = await ApiService.get("/subjects/questions", {
				params: { subId: subjectId, qbId: questionBankId },
			});
			setQuestions(response.data.questions);
			setSubjectName(response.data.subjectName);
			// setQuestionBankName(response.data.questionBankName);
			// console.log(response.data);
		};
		useEffect(() => {
			fetchData();
		}, [subjectId, questionBankId]);

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

					try {
							const response = await ApiService.post(`/file/upload-file-question`, formData, {
									params: { subjectId: subjectId, questionBankId: questionBankId },
									headers: {
										"Content-Type": "multipart/form-data",
								},
							});

							// if (!response.ok) {
							// 		throw new Error("Upload thất bại");
							// }

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
			}
	};


		const [editQuestionId, setEditQuestionId] = useState(null);
		const [shuffleQuestion, setShuffleQuestion] = useState(false);
		const [selectedQuestionBankId, setSelectedQuestionBankId] = useState(null);
		const [selectedGroups, setSelectedGroups] = useState([]);

		const [newQuestion, setNewQuestion] = useState({
				questionText: "",
				options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
		});

		const handleAddOption = () => {
				setNewQuestion({ ...newQuestion, options: [...newQuestion.options, { optionText: "", isCorrect: false }] });
		};

		const handleRemoveOption = (index) => {
				const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
				setNewQuestion({ ...newQuestion, options: updatedOptions });
		};

		const handleSaveQuestion = () => {
				if (newQuestion.questionText.trim() === "" || newQuestion.options.some(opt => opt.optionText.trim() === "")) {
				Swal.fire("Lỗi", "Vui lòng nhập đầy đủ câu hỏi và đáp án!", "error");
				return;
				}

				if (editQuestionId !== null) {
				// Cập nhật câu hỏi
				setQuestions(
						questions.map(q => (q.id === editQuestionId ? { ...newQuestion, id: editQuestionId } : q))
				);
				setEditQuestionId(null);
				} else {
				// Thêm câu hỏi mới
				const newId = questions.length + 1;
				setQuestions([...questions, { ...newQuestion, id: newId }]);
				}
				setNewQuestion({ questionText: "", options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }] });
				document.getElementById("closeModalBtn").click();
		};

		const handleAddQuestion = () => {
			setEditQuestionId(null); // Không có ID nghĩa là thêm mới
			setNewQuestion({ questionText: "", options: [] }); // Reset dữ liệu
			setSelectedGroups([]); // Khi thêm mới, CreatableSelect sẽ trống
			new window.bootstrap.Modal(document.getElementById("questionModal")).show();
		};

// 	const handleEditQuestion = (question) => {
// 		setEditQuestionId(question.questionId); // Cập nhật theo `questionId`
	
// 		// Lấy chương và mức độ từ tags (nếu có)
// 		const chapter = question.tags?.[0] ? { label: question.tags[0], value: question.tags[0] } : null;
// 		const level = question.tags?.[1] ? { label: question.tags[1], value: question.tags[1] } : null;
	
// 		setNewQuestion({ 
// 			questionText: question.questionText, 
// 			options: question.options 
// 		});
	
// 		setSelectedChapter(chapter); // Cập nhật Select Chương
// 		setSelectedLevel(level); // Cập nhật Select Mức độ
// 	};

		// const handleEditQuestion = (question) => {
		// 	setEditQuestionId(question.id);

		// 	// Chuyển đổi tags thành { label, value }
		// 	const formattedTags = question.tags ? question.tags.map(tag => ({ label: tag, value: tag })) : [];

		// 	setNewQuestion({ 
		// 			questionText: question.questionText, 
		// 			options: question.options 
		// 	});

		// 	setSelectedGroups(formattedTags); // Cập nhật selectedGroups với các tag của câu hỏi

		// 	new window.bootstrap.Modal(document.getElementById("questionModal")).show();
		// };

		const handleEditQuestion = (question) => {
			setEditQuestionId(question.id);

			// Lấy chương và mức độ từ tags (nếu có)
			const chapter = question.tags?.[0] ? { label: question.tags[0], value: question.tags[0] } : null;
			const level = question.tags?.[1] ? { label: question.tags[1], value: question.tags[1] } : null;

			setNewQuestion({ 
					questionText: question.questionText, 
					options: question.options 
			});
	
// 			if (file) {
// 					const reader = new FileReader();
// 					reader.onload = (e) => {
// 					Swal.fire({
// 							title: "Tải lên thành công",
// 							icon: "success",
// 					});
// 					};
// 					reader.readAsDataURL(file);
// 			}
// 			};

// 	// Nhóm câu hỏi theo Chương và Mức độ
// const groupedQuestions = {};
// questions.questions.forEach((question) => {
//     const chapter = question.tags[0] || "Chương chưa xác định";
//     const level = question.tags[1] || "Mức độ chưa xác định";

//     if (!groupedQuestions[chapter]) {
//         groupedQuestions[chapter] = {};
//     }
//     if (!groupedQuestions[chapter][level]) {
//         groupedQuestions[chapter][level] = [];
//     }

//     groupedQuestions[chapter][level].push(question);
// });

// 	const handleDelete = (id) => {
// 			Swal.fire({
// 					title: "Bạn có chắc chắn xóa?",
// 					text: "Bạn sẽ không thể hoàn tác hành động này!",
// 					icon: "warning",
// 					showCancelButton: true,
// 					confirmButtonColor: "#3085d6",
// 					cancelButtonColor: "#d33",
// 					confirmButtonText: "Xóa",
// 					cancelButtonText: "Hủy",
// 			}).then((result) => {
// 					if (result.isConfirmed) {

			setSelectedChapter(chapter); // Cập nhật Select Chương
			setSelectedLevel(level); // Cập nhật Select Mức độ

			new window.bootstrap.Modal(document.getElementById("questionModal")).show();
		};

		const handleUploadClick = async () => {
				const { value: file } = await Swal.fire({
						title: "Chọn file",
						input: "file",
						inputAttributes: {
						accept: "image/*",
						"aria-label": "Tải ảnh lên",
						},
				});
		
				if (file) {
						const reader = new FileReader();
						reader.onload = (e) => {
						Swal.fire({
								title: "Tải lên thành công",
								icon: "success",
						});
						};
						reader.readAsDataURL(file);
				}
				};

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

		// const currentQuestionBank = questions.questionBanks.find(qb => qb.questionBankId === questionBankId);
		// const questionBankName = currentQuestionBank ? currentQuestionBank.questionBankName : "Ngân hàng câu hỏi";
		
		// // Lấy tất cả các tags từ questions và loại bỏ trùng lặp
		// const allTags = [
		// 	...new Set(
		// 		questions.questionBanks.flatMap(qb =>
		// 			qb.list.flatMap(q => q.tags || [])
		// 		)
		// 	)
		// ].map(tag => ({ label: tag, value: tag }));
	// const currentQuestionBank = subjectData.questionBanks.find(qb => qb.questionBankId === questionBankId);
    
		// Lấy thông tin ngân hàng câu hỏi
		const questionBankName = questions.questionBankName || "Ngân hàng câu hỏi";

		// Danh sách tất cả chương & mức độ từ `questions`
		const allChapters = [
			...new Set(questions.map(q => q.tags?.[0]).filter(Boolean))
		].map(chapter => ({ label: chapter, value: chapter }));

		const allLevels = [
			...new Set(questions.map(q => q.tags?.[1]).filter(Boolean))
		].map(level => ({ label: level, value: level }));

		const [selectedChapter, setSelectedChapter] = useState(null);
		const [selectedLevel, setSelectedLevel] = useState(null);

		return (
			<div className=" list-question-container">
				{/* Breadcrumb */}
				<nav className="breadcrumb">
					<Link to="/admin">Home</Link>
					<span> / </span>
					<Link to="/admin/question">Ngân hàng câu hỏi</Link>
					<span> / </span>
					<Link to={`/admin/question/${subjectId}`}>{subjectName}</Link>
					<span> / </span>
					<span className="breadcrumb-current">{questionBankName}</span>
				</nav>
		
				<div className="d-flex">
					<div className="search-container">
						<SearchBox></SearchBox>
					</div>
					<div className="d-flex justify-content-end ms-auto">
						<button
						className="btn btn-success mb-1"
						data-bs-toggle="modal"
						data-bs-target="#questionModal"
						onClick={() => {
							setEditQuestionId(null); 
							setNewQuestion({ 
								questionText: "", 
								options: [{ optionText: "", isCorrect: false }, 
								{ optionText: "", isCorrect: false }],tags: []
							});
							setSelectedGroups([]);
						}}
						>
						Thêm câu hỏi mới
						</button>
						<button className="upload-btn ms-2" onClick={handleUploadfile}>
							Upload File
						</button>
					</div>
				</div>

				{/* {questions.map((question) => (
						<div key={question.questionId} className="card mb-2">
								<div className="card-header d-flex justify-content-between">
										<h6>{question.questionText}</h6>
										<div className="d-flex" style={{ marginLeft: "50px" }}>
										<button className="btn btn-primary me-2" onClick={() => handleEditQuestion(question)}>Edit</button>
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
																			<div className="d-flex flex-column">
																					<h6 className="d-flex align-items-center mb-0">{question.questionText}</h6>
																					{question.tags?.slice(1).map((tag, index) => (
																							<p className="m-0 tag-level" key={index}>{tag}</p>
																					))}
																			</div>
																	</div>
																	<div className="d-flex" style={{ marginLeft: "50px" }}>
																			<button className="btn btn-primary me-2" onClick={() => handleEditQuestion(question)}>
																					Edit
																			</button>
																			<button className="btn btn-danger" onClick={() => handleDelete()}>
																					Delete
																			</button>
																	</div>
															</div>
															<div id={`collapse-${question.questionId}`} className="collapse show">
																	<ul className="list-group">
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
									<p className="mb-2">Chương:</p>
									{/* <CreatableSelect
										options={allChapters}
										value={selectedChapter}
										onChange={setSelectedChapter}
										menuPortalTarget={document.body}
										placeholder="Chọn chương"
										styles={{
											menuPortal: (base) => ({ ...base, zIndex: 9999 }),
											container: (provided) => ({ ...provided, flex: 1 }) // Chia đều chiều rộng
										}}
									/> */}
								</div>
								<div style={{ flex: 1 }}>
									<p className="mb-2">Mức độ:</p>
									<CreatableSelect
										options={allLevels}
										value={selectedLevel}
										onChange={setSelectedLevel}
										menuPortalTarget={document.body}
										placeholder="Chọn mức độ"
										styles={{
												menuPortal: (base) => ({ ...base, zIndex: 9999 }),
												container: (provided) => ({ ...provided, flex: 1 }) // Chia đều chiều rộng
											}}
										/>
									</div>
									<div style={{ flex: 1 }}>
										<p className="mb-2">Mức độ:</p>
										<CreatableSelect
											options={allLevels}
											value={selectedLevel}
											onChange={setSelectedLevel}
											menuPortalTarget={document.body}
											placeholder="Chọn mức độ"
											styles={{
													menuPortal: (base) => ({ ...base, zIndex: 9999 }),
													container: (provided) => ({ ...provided, flex: 1 }) // Chia đều chiều rộng
											}}
										/>

									</div>
								</div>
								<div>
									<p className="mb-0 mt-2">Câu hỏi:</p>
									<textarea
										type="text"
										className="form-control mb-3 mt-2"
										placeholder="Nhập câu hỏi"
										value={newQuestion.questionText}
										onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
									/>
								</div>
								<div className="form-check mt-0 mb-3">
									<input
										type="checkbox"
										className="form-check-input"
										id="shuffleQuestion"
										checked={shuffleQuestion}
										onChange={() => setShuffleQuestion(!shuffleQuestion)}
									/>
									<label className="form-check-label" htmlFor="shuffleQuestion">
										Đảo thứ tự đáp án
									</label>
								</div>
								{newQuestion.options.map((option, index) => (
									<div key={index} className="input-group mb-2">
										<div className="input-group-text">
											<input
												className="form-check-input"
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
											style={{ resize: "none", overflow: "hidden" }} // Ngăn resize tay, tự động mở rộng
											onInput={(e) => {
												e.target.style.height = "auto"; // Reset chiều cao để tránh bị giãn bất thường
												e.target.style.height = e.target.scrollHeight + "px"; // Set chiều cao theo nội dung
											}}
										/>
										<button className="btn btn-danger" onClick={() => handleRemoveOption(index)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
								))}
								<button className="btn btn-outline-secondary me-2 mt-2" onClick={handleAddOption}>
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
