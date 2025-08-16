import React, { useState, useEffect, useRef } from "react";
import "./CandidateExamResult.css";
import AddButton from "../../components/AddButton/AddButton";
import { Link, useNavigate , useParams } from "react-router-dom";

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
  const { studentName, examCode, duration, score, questions } = sampleData;
  const { organizeId, sessionId, roomId } = useParams();
  const [organizeExamName, setOrganizeExamName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [roomName, setRoomName] = useState("");

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
            <h5>Kết quả bài thi của: {studentName}</h5>
            <div className="row">
              <div className="col">
                <p><strong>Phân môn:</strong> {score}/10</p>
                <p><strong>Mã đề thi:</strong> {examCode}</p>
              </div>
              <div className="col">
                <p><strong>Thời gian làm bài:</strong> {duration} phút</p>
                <p><strong>Điểm số:</strong> {score}/10</p>
              </div>
            </div>
          </div>
          <ul className="question-list">
            {questions.map((q, index) => (
              <li key={index} className="question-item pt-2 pb-0">
                <h6><strong>Câu {index + 1}: {q.questionText}</strong></h6>
                <ul className="options-list">
                  {q.options.map((option, optIndex) => {
                    const isSelected = option.optionText === q.selectedAnswer;
                    const isCorrect = option.optionText === q.correctAnswer;
                    let className = "option";

                    if (isSelected) {
                      className += isCorrect ? " correct" : " wrong";
                    } else if (isCorrect) {
                      className += " correct";
                    }

                    return (
                      <li key={optIndex} className={className}>
                        {option.optionText}
                        {isSelected && " (Đáp án chọn)"}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2"><strong>Điểm:</strong> {q.score}</p>
              </li>
            ))}
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