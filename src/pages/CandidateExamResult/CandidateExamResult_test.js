import React, { useState, useEffect, useRef } from "react";
import "./CandidateExamResult.css";
import AddButton from "../../components/AddButton/AddButton";
import { Link, useNavigate , useParams } from "react-router-dom";
import ApiService from "../../services/apiService";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Check, X, HelpCircle } from "lucide-react";

const CandidateExamResultTest = () => {
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
  const value = 85;

  // Đếm thống kê cho legend
  const correctCount = listQuestions.filter(q => q.isUserChosenCorrect).length;
  const incorrectCount = listQuestions.filter(q => !q.isUserChosenCorrect && q.answerChosen?.length > 0).length;
  const skippedCount = listQuestions.filter(q => !q.answerChosen || q.answerChosen.length === 0).length;
  
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
				<span className="breadcrumb-between">
          <Link 
            to={`/staff/organize/${organizeId}/${sessionId}/${roomId}`} 
            state={{ roomName: roomName }}
            className="breadcrumb-between">
            {roomName}
          </Link>
        </span>
        <span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Bài thi</span>
			</nav>
      <div className="candidate-exam-result">
        <div className="tbl-shadow">
          <div className="header p-4 mb-0">
            <div className="row">
              <div className="col">
                <h5 className="fw-bold mb-2">Kết quả bài thi: {candidateName}</h5>
                <p className="mb-2"><strong>Phân môn:</strong> {subjectName}</p>
                <p><strong>Phòng thi:</strong> {roomName}</p>
              </div>
              <div className="col d-flex justify-content-between text-center">
                <div className="mx-3">
                  <p className="text-second">Độ chính xác</p> 
                  {/* <p>{duration} phút</p> */}
                  <div style={{ width: 50, height: 25, marginLeft: "15px" }}>
                    <CircularProgressbar
                      value={(correctCount / listQuestions.length) * 100}
                      text={`${Math.round((correctCount / listQuestions.length) * 100)}%`}
                      circleRatio={0.5} // chỉ vẽ nửa vòng
                      styles={buildStyles({
                        rotation: 0.75, // bắt đầu từ góc trái -> làm thành nửa vòng trên
                        strokeLinecap: "round",
                        pathColor: "#00C49F",
                        trailColor: "#eee",
                        textColor: "#000",
                        textSize: "20px"
                      })}
                    />
                  </div>
                </div>
                <div className="mx-3">
                  <p className="text-second">Điểm số</p>
                  <p><i className="fa-solid fa-star me-1 star-color"></i>{totalScore}</p> 
                </div>
                <div className="mx-3">
                  <p className="text-second">Câu trả lời đúng</p> 
                  <p>{correctCount}/{listQuestions.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-wrap gap-2 mt-0 p-4">
            {listQuestions.map((q, index) => (
              <div
                key={q.questionId}
                className="d-flex rounded question-box-bg "
                style={{ height: "35px", width: "60px" }}
              >
                {/* số thứ tự câu hỏi */}
                <span className="text-sm inset-0 flex items-center justify-center m-2 ms-4">
                  {index + 1}
                </span>

                {/* icon check hoặc X */}
                {q.isUserChosenCorrect ? (
                  <Check
                    size={15}
                    className="text-green-600 ms-1"
                    style={{backgroundColor: "#09dc68ff", color: "white"}}
                  />
                ) : (
                  <X
                    size={15}
                    className="text-red-600 ms-1"
                    style={{backgroundColor: "red", color: "white"}}
                  />
                )}
              </div>
            ))}
          </div>
          
          {(() => {
            const total = listQuestions.length;
            const correctCount = listQuestions.filter(q => q.isUserChosenCorrect).length;
            const incorrectCount = listQuestions.filter(
              q => !q.isUserChosenCorrect && q.answerChosen?.length > 0
            ).length;
            const skippedCount = listQuestions.filter(
              q => !q.answerChosen || q.answerChosen.length === 0
            ).length;

            const percent = (count) =>
              total > 0 ? ((count / total) * 100).toFixed(1) + "%" : "0%";

            return (
              <div className="p-4 d-flex gap-3 pt-0 pb-1">
                <p className="mb-1">
                  <strong className="text-success">Correct:</strong> {correctCount} 
                  <span className="text-second-nhat" style={{ position: "relative", top: "-4px" }}> . </span> 
                  <span className="text-second-nhat">{percent(correctCount)}</span>
                </p>
                <p className="mb-1">
                  <strong className="text-danger">Incorrect:</strong> {incorrectCount} 
                  <span className="text-second-nhat" style={{ position: "relative", top: "-4px" }}> . </span> 
                  <span className="text-second-nhat">{percent(incorrectCount)}</span>
                </p>
                <p className="mb-1">
                  <strong className="text-secondary">Skipped:</strong> {skippedCount} 
                  <span className="text-second-nhat" style={{ position: "relative", top: "-4px" }}> . </span> 
                  <span className="text-second-nhat">{percent(skippedCount)}</span>
                </p>
              </div>
            );
          })()}

          <hr className="mb-0 pb-0"></hr>

          <ul className="question-list p-4">
            {listQuestions.map((q, index) => {
              const correctCount = listQuestions.filter(x => x.isUserChosenCorrect).length;
              const pointPerCorrect = correctCount > 0 ? totalScore / correctCount : 0;

              return (
                <li key={q.questionId} className="question-item p-0 pt-3">
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

export default CandidateExamResultTest;