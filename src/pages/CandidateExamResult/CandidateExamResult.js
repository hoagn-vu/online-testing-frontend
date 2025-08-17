import React, { useState, useEffect, useRef } from "react";
import "./CandidateExamResult.css";
import AddButton from "../../components/AddButton/AddButton";
import { Link, useNavigate , useParams } from "react-router-dom";
import ApiService from "../../services/apiService";

const CandidateExamResult = () => {
  const sampleData = {
    studentName: "Nguyễn Văn A",
    examCode: "EX123",
    duration: 45,
    score: 7,
    questions: [
      {
        questionText: "1 + 1 = ?",
        selectedAnswer: "A. 2",
        correctAnswer: "A. 2",
        score: 1,
        options: [
          { optionText: "A. 2" },
          { optionText: "B. 3" },
          { optionText: "C. 1" },
        ],
      },
      {
        questionText: "2 + 2 = ?",
        selectedAnswer: "B. 3",
        correctAnswer: "C. 4",
        score: 0,
        options: [
          { optionText: "A. 5" },
          { optionText: "B. 3" },
          { optionText: "C. 4" },
          { optionText: "D. 6" },
        ],
      },
      {
        questionText: "5 - 3 = ?",
        selectedAnswer: "A. 2",
        correctAnswer: "A. 2",
        score: 1,
        options: [
          { optionText: "A. 2" },
          { optionText: "B. 4" },
          { optionText: "C. 1" },
        ],
      },
    ],
  };
  //const { studentName, examCode, duration, score, questions } = sampleData;
  const { organizeId, sessionId, roomId, candidateId } = useParams();
  const [organizeExamName, setOrganizeExamName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [duration, setDuration] = useState("");
  const [totalScore, setTotalScore] = useState("");
  const [listQuestions, setListQuestion] = useState([]);
  const [listOptions, setListOptions] = useState([]);
  console.log("organizeId:", organizeId)
  console.log("sessionId:", sessionId)
  console.log("roomId:", roomId)
  console.log("candidateId:", candidateId)

  const fetchData = async () => {
		try {
			const response = await ApiService.get("/users/get-review-exam-user", {
				params: { 
          userId: candidateId, 
          organizeExamId: organizeId, 
          sessionId: sessionId,
          roomId: roomId,
        },
			});
			setOrganizeExamName(response.data.organizeExamName);
			setSessionName(response.data.sessionName);
      setRoomName(response.data.roomName);
			setCandidateName(response.data.fullName);
      setSubjectName(response.data.subjectName);
      setDuration(response.data.duration);
			setTotalScore(response.data.totalScore);
      setListQuestion(response.data.questions);
      setListOptions(response.data.questions.options);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}
	};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
    {/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
					<Link to="/staff/organize" className="breadcrumb-between">Quản lý kỳ thi</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
				<Link 
					to={`/staff/organize/${organizeId}`} 
					state={{ organizeExamName: organizeExamName }} 
					className="breadcrumb-between">
					{organizeExamName}
				</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
				<Link 
					to={`/staff/organize/${organizeId}/${sessionId}`} 
					state={{ sessionName: sessionName }}
					className="breadcrumb-between">
					{sessionName}
				</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">Phòng {roomName}</span>
			</nav>
      <div className="candidate-exam-result">
        <div className="tbl-shadow">
          <div className="header p-2 mb-0">
            <h5>Kết quả bài thi của: {candidateName}</h5>
            <div className="row">
              <div className="col">
                <p><strong>Phân môn:</strong> {subjectName}</p>
                <p><strong>Phòng thi:</strong> {roomName}</p>
              </div>
              <div className="col">
                <p><strong>Thời gian làm bài:</strong> {duration} phút</p>
                <p><strong>Điểm số:</strong> {totalScore}/10</p>
              </div>
            </div>
          </div>
          <ul className="question-list">
            {listQuestions.map((q, index) => {
              const correctCount = listQuestions.filter(x => x.isUserChosenCorrect).length;
              const pointPerCorrect = correctCount > 0 ? totalScore / correctCount : 0;

              return (
                <li key={q.questionId} className="question-item pt-2 pb-0">
                  <h6>
                    <strong>
                      Câu {index + 1}: {q.questionText}
                    </strong>
                  </h6>
                  <ul className="options-list">
                    {q.options.map((option) => {
                      const isSelected = q.answerChosen.includes(option.optionId);
                      const isCorrect = option.isCorrect;
                      let className = "option";

                      if (isSelected) {
                        className += isCorrect ? " correct" : " wrong";
                      } else if (isCorrect) {
                        className += " correct";
                      }

                      return (
                        <li key={option.optionId} className={className}>
                          {option.optionText}
                          {isSelected && " (Đáp án chọn)"}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2">
                    <strong>Điểm:</strong>{" "}
                    {q.isUserChosenCorrect ? pointPerCorrect : 0}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="footer">
            <button className="btn btn-secondary" onClick={() => window.history.back()}>
              Quay lại
            </button>
            <AddButton onClick={() => window.print()}>
              Tải về kết quả
            </AddButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateExamResult;