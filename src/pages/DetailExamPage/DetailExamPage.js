import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DetailExamPage.css";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import CreatableSelect from "react-select/creatable";
import Icon from '@mui/material/Icon';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Select from 'react-select';

const examData  = 
[
  {
		id: "67cf6cee1d44d62edf5de90b",
		examCode: "MTH01",
		examName: "Giữa kỳ Giải tích 1",
		subjectId: "67cf6cee1d44d62edf5de905",
		questionBankId: "67cf6cee1d44d62edf5de904",
    questionSet: [
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
        tags: ["Chương 1", "Nhận biết"]

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
	},
	{
		id: "67cf6cee1d44d62edf5de902",
		examCode: "MTH02",
		examName: "Giữa kỳ Giải tích 2",
		subjectId: "67cf6cee1d44d62edf5de905",
		questionBankId: "67cf6cee1d44d62edf5de909",
		examStatus: "Disabled",
	},
		
];
const colourOptions = [
  { value: 'red', label: 'Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư ' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
];
const DetailExamPage = () => {
	const [editQuestionId, setEditQuestionId] = useState(null);
	const [shuffleQuestion, setShuffleQuestion] = useState(false);
	const [questions, setQuestions] = useState();
	const {examId } = useParams();
	const [selectedGroups, setSelectedGroups] = useState([]);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    // Tìm đề thi theo `examId`
    const foundExam = examData.find((exam) => exam.id === examId);
    setExam(foundExam);
    console.log("Dữ liệu tìm thấy:", foundExam);
  }, [examId]);
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
	
		// Lấy chương và mức độ từ tags
		const chapter = question.tags?.[0] ? { label: question.tags[0], value: question.tags[0] } : null;
		const level = question.tags?.[1] ? { label: question.tags[1], value: question.tags[1] } : null;
	
		setNewQuestion({ 
			questionText: question.questionText, 
			options: question.options 
		});
	
		setSelectedChapter(chapter); // Cập nhật chương đã chọn
		setSelectedLevel(level); // Cập nhật mức độ đã chọn
	
		new window.bootstrap.Modal(document.getElementById("questionModal")).show();
	};
	

	const groupedQuestions = {};
	const selectedQuestions = examData.find(qb => qb.id === examId)?.questionSet || [];
	
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

	const currentQuestionBank = examData.find(qb => qb.id === examId);
	const questionBankName = currentQuestionBank ? currentQuestionBank.examId : "Ngân hàng câu hỏi";
    
  // Lấy tất cả các tags từ subjectData và loại bỏ trùng lặp
  const allTags = [
    ...new Set(
      examData
        .filter(qb => qb.questionSet) 
        .flatMap(qb => qb.questionSet.flatMap(q => q.tags || []))
    )
  ].map(tag => ({ label: tag, value: tag }));
  
	const allChapters = [
		...new Set(
			examData.flatMap(exam =>
				exam.questionSet?.map(q => q.tags?.[0]) // Lấy tag đầu tiên (Chương)
			).filter(Boolean)
		)
	].map(chapter => ({ label: chapter, value: chapter }));
	
	const allLevels = [
		...new Set(
			examData.flatMap(exam =>
				exam.questionSet?.map(q => q.tags?.[1]) // Lấy tag thứ hai (Mức độ)
			).filter(Boolean)
		)
	].map(level => ({ label: level, value: level }));
	
	const [selectedChapter, setSelectedChapter] = useState(null);
	const [selectedLevel, setSelectedLevel] = useState(null);

	
	return (
		<div className="container list-question-container me-0">
			{/* Breadcrumb */}
			<nav className="breadcrumb">
				<Link to="/admin">Home</Link> / 
				<Link to="/admin/exam">Quản lý đề thi</Link> / 
				<span className="breadcrumb-current">{examId}</span>
			</nav>
	
			<div className="d-flex">
				<div className="search-container">
					<SearchBox></SearchBox>
				</div>
				<div className="d-flex justify-content-end ms-auto">
					<button
					className="btn btn-success mb-1"
					data-bs-toggle="modal"
					data-bs-target="#addQuestionModal"
					onClick={() => {
						setEditQuestionId(null); 
						setNewQuestion({ 
							questionText: "", 
							options: [{ optionText: "", isCorrect: false }, 
							{ optionText: "", isCorrect: false }],tags: []
						});
						setSelectedGroups([]);
					}}> Thêm câu hỏi mới </button>
				</div>
			</div>

			{Object.entries(groupedQuestions).map(([chapter, levels]) => (
				<div key={chapter}>
					<h4 className="mt-4 mb-3">{chapter}</h4>
					{Object.entries(levels).map(([level, questions]) => (
						<div key={level}>
							<div>
								{questions.map((question) => (
									<div key={question.id} className="card mb-2">
										<div className="card-header d-flex justify-content-between ps-2">
											<div className="d-flex ">
											<button 
												className="btn btn-link text-decoration-none d-flex p-0 pe-1"
												style={{color: "black"}}
												data-bs-toggle="collapse" 
												data-bs-target={`#collapse-${question.id}`}
												aria-expanded="false"
												aria-controls={`collapse-${question.id}`}
											>			
												<ArrowDropDownIcon />
											</button>
												<div>
													<h6 className="d-flex align-items-center">{question.questionText}</h6>
													{question.tags.slice(1).map((tag, index) => (
														<p className="m-0 tag-level" key={index}>{tag}</p>
													))}
												</div>
											</div>
											<div className="d-flex" style={{ marginLeft: "50px" }}>
												<button className="btn btn-primary me-2" onClick={() => handleEditQuestion(question)}>Edit</button>
												<button className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
											</div>
										</div>
										<div id={`collapse-${question.id}`} className="collapse show">
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
									<CreatableSelect
										options={allChapters}
										value={selectedChapter}
										onChange={setSelectedChapter}
										menuPortalTarget={document.body}
										placeholder="Chọn chương"
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
								<p className="mt-2 mb-2">Câu hỏi:</p>
								<textarea
									type="text"
									className="form-control mb-3"
									placeholder="Nhập câu hỏi"
									value={newQuestion.questionText}
									onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
								/>
							</div>
							<div className="form-check mt-2 mb-3">
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
											type="checkbox"
											className="form-check-input"
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
									<button className="btn btn-danger" onClick={() => handleRemoveOption(index)}><i className="fa-solid fa-xmark"></i>
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
      {/* Modal Bootstrap thuần */}
			<div className="modal fade" id="addQuestionModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
              <h5 className="modal-title">Thêm câu hỏi mới</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
              <Select
                className="basic-single ms-2 me-2"
                classNamePrefix="select"
                placeholder="Nhập câu hỏi"
                options={colourOptions}
                styles={{
                  control: (base) => ({
                      ...base,
                      minHeight: "50px",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "14px", // Cỡ chữ của placeholder (label)
                  }),
                }}
              />
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

export default DetailExamPage;
