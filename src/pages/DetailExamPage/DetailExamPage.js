import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate  } from "react-router-dom";
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
import FormCreateExam from "../../components/FormCreateExam/FormCreateExam";

const DetailExamPage = () => {
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { examId } = useParams();
  const [totalScore, setTotalScore] = useState(0);
  const [scores, setScores] = useState({}); 
  const [examDetails, setExamDetails] = useState([]);
  const [showFormCreateExam, setShowFormCreateExam] = useState(false);
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
    tags: [],
  });
	
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    if (location.state?.reload) {
      fetchExamDetails(); 
    }
  }, [location.state]);

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

  useEffect(() => {
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

  const handleEditQuestion = () => {
    const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.set("showFormCreateExam", "true");
		navigate(`${location.pathname}?${newSearchParams.toString()}`);
    setShowFormCreateExam(true);  
  };

  const handleCloseFormCreateExam = () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete("showFormCreateExam");
    const newUrl = newSearchParams.toString()
      ? `${location.pathname}?${newSearchParams.toString()}`
      : location.pathname;
    navigate(newUrl, { replace: true });
    setShowFormCreateExam(false);
    fetchExamDetails();
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setShowFormCreateExam(params.get("showFormCreateExam") === "true");
  }, [location.search]);

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

  /* const handleEditQuestion = (question) => {
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
  };*/

  const handleDeleteExam = (examId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa đề thi này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          //await ApiService.delete(`/exams/${examId}`);

          Swal.fire({
            title: "Đã xóa!",
            text: "Đề thi đã bị xóa thành công.",
            icon: "success",
          });

          navigate("/staff/exam"); 
        } catch (error) {
          console.error("Xóa đề thi thất bại:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể xóa đề thi. Vui lòng thử lại!",
            icon: "error",
          });
        }
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

      {showFormCreateExam ? (
        <FormCreateExam
          onClose={handleCloseFormCreateExam}
          initialData={{
            examId: examDetails?.id,
            examCode: examDetails?.examCode,
            examName: examDetails?.examName,
            subjectName: examDetails?.subjectName,
            questionBankName: examDetails?.questionBankName,
            questions: questions,
            totalScore: questions.reduce((sum, q) => sum + (q.questionScore || 0), 0),
            scores: questions.reduce((acc, q) => {
              acc[q.questionId] = q.questionScore || 0;
              return acc;
            }, {}),
          }}
        />
      ) : (
        <>
          <div className="d-flex mb-3">
            <div className="search-container">
              <SearchBox></SearchBox>
            </div>
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
                    {totalScore} {/* Sử dụng totalScore thay vì reduce để đồng bộ */}
                  </p>
                </div>
                <div className="col">
                  <p style={{ fontSize: "14px" }}>
                    <span style={{ fontWeight: "bold" }}>Phân học: </span>{examDetails.subjectName}
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    <span style={{ fontWeight: "bold" }}>Bộ câu hỏi: </span>{examDetails.questionBankName}
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
                  <i className="fas fa-ellipsis-v" style={{fontSize: "18px"}}></i>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-custom"
                  style={{
                    right: "0",
                    transform: "translate3d(-10px, 10px, 0px)",
                  }}
                >
                  <li className="tbl-action">
                    <button
                      className="dropdown-item tbl-action"
                      onClick={handleEditQuestion}
                    >
                      Chỉnh sửa
                    </button>
                  </li>
                  <li className="tbl-action">
                    <button className="dropdown-item tbl-action" onClick={() => handleDeleteExam(examDetails.id)}>Xoá</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {questions.length > 0 ? (
            questions.map((question) => {
              const hasImage = question.imgLinks && question.imgLinks.length > 0;
              return (
                <div key={question.questionId} className="question-card mb-3 p-3 bd-radius-8 pb-2 bg-white pt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="fw-bold pb-0 mb-1">Câu hỏi:</p>                    
                  </div>
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
                            <p className="mb-1" style={{ fontSize: "16px" }}>
                              {question.questionText}
                            </p>
                            {question.tags?.slice(1).map((tag, index) => (
                              <p className="m-0 tag-level" key={index}>{tag}</p>
                            ))}
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
                            style={{ listStyle: "none", fontSize: "14px" }}
                          >
                            {option.optionText}
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Không có câu hỏi nào.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DetailExamPage;