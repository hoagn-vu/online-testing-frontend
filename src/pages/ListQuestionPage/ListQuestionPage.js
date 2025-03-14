import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListQuestionPage.css";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import CreatableSelect from "react-select/creatable";

const subjectData  = 
{
		id: "67cf6cee1d44d62edf5de90b",
		subjectName: "Math",
		subjectStatus: null,
		questionBanks: [
				{
						questionBankId: "67cf702d1d44d62edf5de913",
						questionBankName: "Giải tích 1",
						questionBankStatus: null,
						list: [
								{
										id: 1,
										questionText: "What is the capital of France?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: []

								},
								{
										id: 2,
										questionText: "Which planet is known as the Red Planet?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: []
								},
								
						],
				},
				{
						questionBankId: "67cf70341d44d62edf5de916",
						questionBankName: "Giải tích 2",
						questionBankStatus: null,
						list: [
								{
										id: 1,
										questionText: "Linh?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: ["Chương 1", "Nhận biết", "Vận dụng cao"]

								},
								{
										id: 2,
										questionText: "What is the capital of France?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: ["Chương 1", "Nhận biết"]

								},
								{
										id: 3,
										questionText: "Linh 1?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: ["Chương 1", "Thông hiểu"]
								},
								{
										id: 4,
										questionText: "Hôm nay là thứ mấy?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: ["Chương 2", "Nhận biết"]

								},
								{
										id: 5,
										questionText: "Which planet is known as the Red Planet?",
										options: [
												{ optionId: "1", optionText: "Berlin", isCorrect: false },
												{ optionId: "2", optionText: "Madrid", isCorrect: false },
												{ optionId: "3", optionText: "Paris", isCorrect: true },
												{ optionId: "4", optionText: "Rome", isCorrect: false },
										],
										isRandomOrder: false,
										tags: ["Chương 2", "Thông hiểu"]
								},
						],
				}
		]
		
};

const ListQuestionPage = () => {
	const [editQuestionId, setEditQuestionId] = useState(null);
	const [shuffleQuestion, setShuffleQuestion] = useState(false);
	const [selectedQuestionBankId, setSelectedQuestionBankId] = useState(null);
	const [questions, setQuestions] = useState();
	const {subject, questionBankId } = useParams();
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

	const handleEditQuestion = (question) => {
		setEditQuestionId(question.id);

		// Chuyển đổi tags thành { label, value }
		const formattedTags = question.tags ? question.tags.map(tag => ({ label: tag, value: tag })) : [];

		setNewQuestion({ 
				questionText: question.questionText, 
				options: question.options 
		});

		setSelectedGroups(formattedTags); // Cập nhật selectedGroups với các tag của câu hỏi

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
	const selectedQuestions = subjectData.questionBanks.find(qb => qb.questionBankId === questionBankId)?.list || [];
	
	selectedQuestions.forEach((question) => {
			const chapter = question.tags[0] || "";
			const level = question.tags[1] || "";
	
			if (!groupedQuestions[chapter]) {
					groupedQuestions[chapter] = {};
			}
			if (!groupedQuestions[chapter][level]) {
					groupedQuestions[chapter][level] = [];
			}
	
			groupedQuestions[chapter][level].push(question);
	});

	const colourOptions = [
			{ value: "Chương 1", label: "Chương 1" },
			{ value: "Chương 2", label: "Chương 2" },
			{ value: "Chương 3", label: "Chương 3" },
		];

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

	const currentQuestionBank = subjectData.questionBanks.find(qb => qb.questionBankId === questionBankId);
	const questionBankName = currentQuestionBank ? currentQuestionBank.questionBankName : "Ngân hàng câu hỏi";
    
	// Lấy tất cả các tags từ subjectData và loại bỏ trùng lặp
	const allTags = [
		...new Set(
			subjectData.questionBanks.flatMap(qb =>
				qb.list.flatMap(q => q.tags || [])
			)
		)
	].map(tag => ({ label: tag, value: tag }));

	return (
		<div className="container list-question-container me-0">
			{/* Breadcrumb */}
			<nav className="breadcrumb">
				<Link to="/admin">Home</Link> / 
				<Link to="/admin/question">Ngân hàng câu hỏi</Link> / 
				<Link to={`/admin/question/${subject}`}>{decodeURIComponent(subject)}</Link> / 
				<span className="breadcrumb-current">{questionBankName}</span>
			</nav>
	
			<div className="d-flex">
				<div className="search-container">
					<SearchBox></SearchBox>
				</div>
				<div className="d-flex justify-content-end ms-auto">
					<button
					className="btn btn-success mb-3"
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
					<button className="upload-btn ms-2" onClick={handleUploadClick}>
						Upload File
					</button>
				</div>
			</div>

			{/* {selectedQuestions.map((question) => (
					<div key={question.id} className="card mb-2">
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
					<h4>{chapter}</h4>
					{Object.entries(levels).map(([level, questions]) => (
						<div key={level}>
							<div className="mb-4 mt-3">
								{questions.map((question) => (
									<div key={question.id} className="card mb-2">
										<div className="card-header d-flex justify-content-between">
											<div>
												<h6 className="d-flex align-items-center">{question.questionText}</h6>
													{question.tags.slice(1).map((tag, index) => (
														<p className="m-0 tag-level" key={index}>{tag}</p>
													))}
											</div>
											<div className="d-flex" style={{ marginLeft: "50px" }}>
												<button className="btn btn-primary me-2" onClick={() => handleEditQuestion(question)}>Edit</button>
												<button className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
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
								))}
							</div>
						</div>
					))}
				</div>
			))}

			{/* Modal Bootstrap thuần */}
			<div className="modal fade" id="questionModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
								<h5 className="modal-title">{editQuestionId ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</h5>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<CreatableSelect
								isMulti
								options={allTags}
								value={selectedGroups}
								onChange={setSelectedGroups}
								menuPortalTarget={document.body} 
								styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
							/>
							<textarea
								type="text"
								className="form-control mb-3 mt-3"
								placeholder="Nhập câu hỏi"
								value={newQuestion.questionText}
								onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
							/>
							{newQuestion.options.map((option, index) => (
								<div key={index} className="input-group mb-2">
									<div className="input-group-text">
										<input
											type="checkbox"
											checked={option.isCorrect}
											onChange={() => {
												const newOptions = [...newQuestion.options];
												newOptions[index].isCorrect = !newOptions[index].isCorrect;
												setNewQuestion({ ...newQuestion, options: newOptions });
											}}
										/>
									</div>
									<input
										type="text"
										className="form-control m-0"
										placeholder="Nhập đáp án"
										value={option.optionText}
										onChange={(e) => {
										const newOptions = [...newQuestion.options];
										newOptions[index].optionText = e.target.value;
										setNewQuestion({ ...newQuestion, options: newOptions });
										}}
									/>
									<button className="btn btn-danger" onClick={() => handleRemoveOption(index)}>X</button>
								</div>
							))}
							<button className="btn btn-outline-secondary me-2 mt-2" onClick={handleAddOption}>
								Thêm đáp án
							</button>
							<div className="form-check mt-3">
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
						</div>
						<div className="modal-footer">
							<button className="btn btn-success" onClick={handleSaveQuestion}>
								{editQuestionId ? "Cập nhật" : "Lưu"}
							</button>
							<button id="closeModalBtn" className="btn btn-secondary" data-bs-dismiss="modal">
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
