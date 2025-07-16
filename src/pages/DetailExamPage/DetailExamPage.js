import React, { useEffect, useState } from "react";
import { Link, useParams  } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DetailExamPage.css";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import CreatableSelect from "react-select/creatable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Select from "react-select";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Grid, TextField, Autocomplete } from "@mui/material";
import ApiService from "../../services/apiService";

const DetailExamPage = () => {
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [shuffleQuestion, setShuffleQuestion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examName, setExamName] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null); 
  const { examId } = useParams();
  const [totalScore, setTotalScore] = useState(0);
  const [scores, setScores] = useState({}); 
  const [examDetails, setExamDetails] = useState([]);
  
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
    tags: [],
  });
	
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        console.log("🔍 examId changed:", examId);
        const response = await ApiService.get("/exams/questions", {
          params: { examId: examId },
        });
        const data = response.data;
        setExamDetails({
          id: data.id,
          examCode: data.examCode,
          examName: data.examName,
          subjectName: data.subjectName,
          questionBankName: data.questionBankName,
        });
        setQuestions(data.listQuestion || []);
        // Tính tổng điểm từ questionScore
        const total = data.listQuestion.reduce((sum, q) => sum + (q.questionScore || 0), 0);
        setTotalScore(total);
        // Khởi tạo scores từ questionScore
        const initialScores = {};
        data.listQuestion.forEach((q) => {
          initialScores[q.questionId] = q.questionScore || 0;
        });
        setScores(initialScores);
      } catch (error) {
        console.error("Failed to fetch exam details: ", error);
      }
    };

    if (examId) {
      fetchExamDetails();
    } else {
      setExamDetails(null);
      setQuestions([]);
      setTotalScore(0);
      setScores({});
    }
  }, [examId]);

  /* useEffect(() => {
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
  }, []); */

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

  return (
    <div className="container list-question-container me-0 p-4">
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between"> <Link to="/staff/exam" className="breadcrumb-between">Quản lý đề thi</Link></span>
				<span className="ms-3 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">{examDetails.examName}</span>
			</nav>
      <div className="d-flex mb-3">
        <div className="search-container">
          <SearchBox></SearchBox>
        </div>
        {/* <div className="d-flex justify-content-end ms-auto">
          <AddButton onClick={handleAddQuestion}>
            <i className="fas fa-plus me-2"></i> Thêm câu hỏi
          </AddButton>
        </div> */}
      </div>
      {examDetails && (
        <div className="container tbl-shadow p-3" style={{ borderRadius: "8px", position: "relative" }}>
          <div className="row">
            <div className="col">
              <p style={{ fontSize: "14px" }}>
                <span style={{ fontWeight: "bold" }}>Mã đề thi: </span>{examDetails.examCode}
              </p>
              <p style={{ fontSize: "14px" }}>
                <span style={{ fontWeight: "bold" }}>Tên đề thi: </span>{examDetails.examName}
              </p>
              <p className="m-0" style={{ fontSize: "14px" }}>
                <span style={{ fontWeight: "bold" }}>Tổng điểm: </span>
                {questions.reduce((sum, q) => sum + q.questionScore, 0)}
              </p>
            </div>

            <div className="col">
              <p style={{ fontSize: "14px" }}>
                <span style={{ fontWeight: "bold" }}>Phân học: </span> {examDetails.subjectName}
              </p>
              <p style={{ fontSize: "14px" }}>
                <span style={{ fontWeight: "bold" }}>Bộ câu hỏi: </span> {examDetails.questionBankName}
              </p>
            </div>
          </div>
          {/* Nút 3 chấm góc phải */}
          <div 
            className="dropdown d-inline-block" 
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <button
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              className="dropdown-toggle-icon"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end dropdown-menu-custom"
              style={{
                right: "0",
                transform: "translate3d(-10px, 10px, 0px)",
              }}
            >
              <li className="tbl-action">
                <button className="dropdown-item tbl-action">Chỉnh sửa</button>
              </li>
              <li className="tbl-action">
                <button className="dropdown-item tbl-action">Xoá</button>
              </li>
            </ul>
          </div>
        </div>
      )}
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.questionId} className="card mb-2">
            <div className="card-header d-flex justify-content-between ps-2">
              <div className="d-flex">
                <button
                  className="btn btn-link text-decoration-none d-flex p-0 pe-1"
                  style={{ color: "black" }}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${question.questionId}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${question.questionId}`}
                >
                  <ArrowDropDownIcon />
                </button>

                <div>
                  {/* Nội dung câu hỏi */}
                  <h6 className="d-flex align-items-center">
                    {question.questionText}
                    <span
                      className="ms-1"
                      style={{ fontSize: "13px", color: "#70706E" }}
                    >
                      {question.questionScore} điểm
                    </span>
                  </h6>

                  {/* Hiển thị chapter & level */}
                  <p className="m-0" style={{ fontSize: "13px", color: "#70706E" }}>
                    {question.chapter} - {question.level}
                  </p>
                </div>
              </div>

              {/* Nút chỉnh sửa & xoá */}
              <div className="d-flex" style={{ marginLeft: "50px" }}>
                <button
                  className="btn pe-1 ps-1"
                  style={{ fontSize: "20px" }}
                  onClick={() => handleEditQuestion(question)}
                >
                  <i className="fa-solid fa-pen-to-square" style={{ color: "#A6A6A6" }}></i>
                </button>
                <button
                  className="btn pe-1 ps-1"
                  style={{ fontSize: "20px" }}
                  onClick={() => handleDelete(question.questionId)}
                >
                  <i className="fa-solid fa-trash-can" style={{ color: "#A6A6A6" }}></i>
                </button>
              </div>
            </div>

            {/* Collapse hiển thị options */}
            <div id={`collapse-${question.questionId}`} className="collapse show">
              <ul className="list-group">
                {question.options.map((option) => (
                  <li
                    key={option.optionId}
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
        <p>Không có câu hỏi nào.</p>
      )}
    </div>
  );
};

export default DetailExamPage;