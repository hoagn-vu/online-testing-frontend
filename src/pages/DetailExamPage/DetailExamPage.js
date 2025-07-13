import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DetailExamPage.css";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import CreatableSelect from "react-select/creatable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Select from "react-select";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";

const examData = [
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
        tags: ["Chương 1", "Nhận biết"],
        questionScore: 0.4,
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
        tags: ["Chương 1", "Nhận biết"],
        questionScore: 0.4,
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
        tags: ["Chương 1", "Thông hiểu"],
        questionScore: 0.4,
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
        tags: ["Chương 2", "Nhận biết"],
        questionScore: 0.4,
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
        tags: ["Chương 2", "Thông hiểu"],
        questionScore: 0.4,
      },
    ],
  },
];

const colourOptions = [
  { value: "red", label: "Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
];

const DetailExamPage = () => {
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [shuffleQuestion, setShuffleQuestion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
    tags: [],
  });
	
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    const testExamId = "67cf6cee1d44d62edf5de90b"; // Giá trị cố định
    const foundExam = examData.find((exam) => exam.id === testExamId);
    console.log("Testing with examId:", testExamId);
    console.log("Found Exam:", foundExam);
    setExam(foundExam);
    if (foundExam?.questionSet) {
      setQuestions([...foundExam.questionSet]);
    } else {
      setQuestions([]); // Đảm bảo không lỗi nếu không tìm thấy
    }
  }, []);

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { optionText: "", isCorrect: false }],
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSaveQuestion = () => {
    if (
      newQuestion.questionText.trim() === "" ||
      newQuestion.options.some((opt) => opt.optionText.trim() === "")
    ) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ câu hỏi và đáp án!", "error");
      return;
    }

    const tags = [selectedChapter?.label, selectedLevel?.label].filter(Boolean);

    if (editQuestionId !== null) {
      setQuestions(
        questions.map((q) =>
          q.id === editQuestionId ? { ...newQuestion, id: editQuestionId, tags } : q
        )
      );
      setEditQuestionId(null);
    } else {
      const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      setQuestions([...questions, { ...newQuestion, id: newId, tags }]);
    }
    setNewQuestion({
      questionText: "",
      options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
      tags: [],
    });
    setSelectedChapter(null);
    setSelectedLevel(null);
    document.getElementById("closeModalBtn").click();
  };

  const handleAddQuestion = () => {
    setEditQuestionId(null);
    setNewQuestion({
      questionText: "",
      options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
      tags: [],
    });
    setSelectedChapter(null);
    setSelectedLevel(null);
    new window.bootstrap.Modal(document.getElementById("questionModal")).show();
  };

  const handleEditQuestion = (question) => {
    setEditQuestionId(question.id);

    const chapter = question.tags?.[0] ? { label: question.tags[0], value: question.tags[0] } : null;
    const level = question.tags?.[1] ? { label: question.tags[1], value: question.tags[1] } : null;

    setNewQuestion({
      questionText: question.questionText,
      options: question.options,
    });
    setSelectedChapter(chapter);
    setSelectedLevel(level);

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
        setQuestions(questions.filter((q) => q.id !== id));
        Swal.fire({
          title: "Đã xóa!",
          text: "Câu hỏi đã bị xóa.",
          icon: "success",
        });
      }
    });
  };

  const allTags = [
    ...new Set(
      examData
        .filter((qb) => qb.questionSet)
        .flatMap((qb) => qb.questionSet.flatMap((q) => q.tags || []))
    ),
  ].map((tag) => ({ label: tag, value: tag }));

  const allChapters = [
    ...new Set(
      examData
        .flatMap((exam) => exam.questionSet?.map((q) => q.tags?.[0]))
        .filter(Boolean)
    ),
  ].map((chapter) => ({ label: chapter, value: chapter }));

  const allLevels = [
    ...new Set(
      examData
        .flatMap((exam) => exam.questionSet?.map((q) => q.tags?.[1]))
        .filter(Boolean)
    ),
  ].map((level) => ({ label: level, value: level }));

  return (
    <div className="container list-question-container me-0 p-4">
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between"> <Link to="/staff/exam" className="breadcrumb-between">Quản lý đề thi</Link></span>
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">examId</span>
			</nav>
      <div className="d-flex mb-3">
        <div className="search-container">
          <SearchBox></SearchBox>
        </div>
        <div className="d-flex justify-content-end ms-auto">
          <button
            className="btn btn-success mb-1"
            data-bs-toggle="modal"
            data-bs-target="#questionModal"
            onClick={handleAddQuestion}
          >
            Thêm câu hỏi mới
          </button>
        </div>
      </div>

      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} className="card mb-2">
            <div className="card-header d-flex justify-content-between ps-2">
              <div className="d-flex">
                <button
                  className="btn btn-link text-decoration-none d-flex p-0 pe-1"
                  style={{ color: "black" }}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${question.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${question.id}`}
                >
                  <ArrowDropDownIcon />
                </button>
                <div>
                  <h6 className="d-flex align-items-center">
                    {question.questionText}
                    <span
                      className="ms-1"
                      style={{ fontSize: "13px", color: "#70706E" }}
                    >
                      {question.questionScore} điểm
                    </span>
                  </h6>
									{question.tags[1] && (
                    <p className="m-0 tag-level" style={{ fontSize: "13px", color: "#70706E" }}>
                      {question.tags[1]}
                    </p>
                  )}
                </div>
              </div>
							<div className="d-flex" style={{ marginLeft: "50px" }}>
								<button className="btn pe-1 ps-1" style={{ fontSize: "20px" }} onClick={() => handleEditQuestion(question)}>
									<i className="fa-solid fa-pen-to-square" style={{color: "#A6A6A6"}}></i>	
								</button>
								<button className="btn pe-1 ps-1" style={{ fontSize: "20px" }} onClick={() => handleDelete(question.id)}>
									<i className="fa-solid fa-trash-can" style={{color: "#A6A6A6"}}></i>
								</button>
							</div>
            </div>
            <div id={`collapse-${question.id}`} className="collapse show">
              <ul className="list-group">
                {question.options.map((option, index) => (
                  <li
                    key={index}
                    className={
                      option.isCorrect
                        ? "list-group-item list-group-item-success"
                        : "list-group-item"
                    }
                  >
                    {option.optionText}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>Không có câu hỏi nào để hiển thị.</p>
      )}

      <div
        className="modal fade"
        id="questionModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editQuestionId ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="d-flex"
                style={{ display: "flex", width: "100%", gap: "10px" }}
              >
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
                      container: (provided) => ({ ...provided, flex: 1 }),
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
                      container: (provided) => ({ ...provided, flex: 1 }),
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
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, questionText: e.target.value })
                  }
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
                <label
                  className="form-check-label"
                  htmlFor="shuffleQuestion"
                >
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
                    rows={1}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index].optionText = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    style={{ resize: "none", overflow: "hidden" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
              <button
                className="btn btn-outline-secondary me-2 mt-2"
                onClick={handleAddOption}
              >
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
    </div>
  );
};

export default DetailExamPage;