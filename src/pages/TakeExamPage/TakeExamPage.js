import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeExamPage.css';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { useSelector } from "react-redux";

const TakeExamPage = () => {
  const { organizeExamId, sessionId, roomId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const avatarUrl = ""; // Đường dẫn ảnh avatar

  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(1);
  const [organizeExamName, setOrganizeExamName] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await ApiService.get(`/process-take-exams/take-exam`, {
          params: { organizeExamId, sessionId, roomId, userId: user.id },
        });
        setQuestions(response.data.questions);
        setDuration(response.data.duration * 60);
        setOrganizeExamName(response.data.organizeExamName);
      } catch (error) {
        console.error('Failed to fetch questions: ', error);
      }
    };

    fetchQuestions();
  }, [organizeExamId, sessionId, roomId]);

  useEffect(() => {
      if (duration <= 0) {
          alert("Hết thời gian làm bài!");
          return;
      }
      
      const interval = setInterval(() => {
          setDuration(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
  }, [duration]);

  const formatTime = (sec) => {
      const minutes = Math.floor(sec / 60);
      const seconds = sec % 60;
      return `${minutes < 10 ? "0"+minutes : minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const [leaveCount, setLeaveCount] = useState(0);

// useEffect(() => {
//   const handleFullscreen = () => {
//     if (document.documentElement.requestFullscreen) {
//       document.documentElement.requestFullscreen();
//     } else if (document.documentElement.mozRequestFullScreen) {
//       document.documentElement.mozRequestFullScreen();
//     } else if (document.documentElement.webkitRequestFullscreen) {
//       document.documentElement.webkitRequestFullscreen();
//     } else if (document.documentElement.msRequestFullscreen) {
//       document.documentElement.msRequestFullscreen();
//     }
//   };

//   // handleFullscreen();

//   const handleBlur = () => setLeaveCount((prev) => prev + 1);
//     window.addEventListener("blur", handleBlur);
//     return () => window.removeEventListener("blur", handleBlur);
//   }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0); 

  const [answeredQuestions, setAnsweredQuestions] = useState(Array(questions.length).fill(false));

  // Tính phần trăm tiến trình
  const answeredCount = answeredQuestions.filter(q => q).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  const [flaggedQuestions, setFlaggedQuestions] = useState(Array(questions.length).fill(false));

  const handleAnswerSelect = (questionIndex) => {
      setAnsweredQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex] = true; // Đánh dấu câu hỏi đã được trả lời
        return updated;
      });
    };
  
  const toggleFlag = (index) => {
      setFlaggedQuestions((prev) => {
          const updated = [...prev];
          updated[index] = !updated[index]; // Đảo trạng thái flag
          return updated;
      });
  };

  // Tạo danh sách tham chiếu đến các câu hỏi
  const questionRefs = useRef(questions.map(() => React.createRef()));
  
  const handleScrollToQuestion = (index) => {
      if (questionRefs.current[index]) {
          questionRefs.current[index].scrollIntoView({
              behavior: 'smooth', // Cuộn mượt
              block: 'center',    // Căn giữa màn hình
          });
      }
  };
  
  const handleSubmitExam = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn nộp bài?",
      text: "Sau khi nộp, bạn sẽ không thể thay đổi câu trả lời!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Nộp bài",
      cancelButtonText: "Hủy",
      didOpen: () => {
        // Thêm class tùy chỉnh khi alert mở ra
        document.querySelector(".swal2-confirm").classList.add("swal-button");
        document.querySelector(".swal2-cancel").classList.add("swal-button");
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Nộp bài thành công!",
          text: "Bài thi của bạn đã được gửi.",
          icon: "success",
          didOpen: () => {
            document.querySelector(".swal2-confirm").classList.add("swal-button");
          }
        });
      }
    });
  };

  return (
      <div>
          <div className="header-candidate-takexam-container d-flex align-items-center">
              <div className="user-info position-relative align-items-center d-flex justify-content-between w-100">
                  <div className='d-flex align-items-center '>
                      <img src={avatarUrl} alt="Avatar" className="avatar" />
                      <div className='ms-3'>
                          <p className="username m-0 p-0">{user.fullName}</p>
                          <p className="studentID m-0 p-0">{user.userCode}</p>
                      </div>
                  </div>
                  <h5 className='d-flex align-items-center justify-content-between m-0 fw-bold'>{organizeExamName}</h5>
                  <button className='btn btn-primary btn-sm btn-submit' onClick={handleSubmitExam}>Nộp bài</button>
              </div>
          </div>

          <div className="container container-take-exam d-flex justify-content-between">
              <div className="content-take-exam w-100">
              {questions.map((q, index) => (
                  <React.Fragment key={index}>
                      <div ref={(el) => (questionRefs.current[index] = el)}>
                          <QuestionCard 
                              questionNumber={index + 1} 
                              question={q.questionName} 
                              options={q.options} 
                              allowMultiple={q.allowMultiple}
                              onAnswerSelect={() => handleAnswerSelect(index)}
                              flagged={flaggedQuestions[index]} 
                              onToggleFlag={toggleFlag} 
                          />
                      </div>
                      {index < questions.length - 1 && (
                          <hr className='m-0 mt-1 mb-3 mx-auto' style={{ width: '95%' }} />
                      )}
                  </React.Fragment>
              ))}  
              </div>

              <div className="sidebar-take-exams">
                  <div className="timer-take-exam">
                      <p className="time-title-take-exam pt-2">Thời gian còn lại</p>
                      <p className="time-count-take-exam mb-2">{formatTime(duration)}</p>
                  </div>
                  <div className="progress-take-exam">
                      <h5>Câu hỏi</h5>
                      <div className="progress-detail-take-exam">
                          <p className="ques-progress-take-exam">{answeredCount}/{questions.length}</p>
                          <div className="progress-container-take-exam">
                          <p className="progress-bar-take-exam" style={{ width: `${progressPercentage}%` }}></p>
                          </div>
                      </div>
                  </div>
                  <div className="questions-nav-take-exam">
                      {questions.map((_, index) => (
                          <button 
                          key={index} 
                          className={`btn btn-sm m-1 
                            ${currentQuestion === index ? "" : ""}
                            ${answeredQuestions[index] ? "finish" : ""} // Chuyển xanh khi đã trả lời
                            ${flaggedQuestions[index] ? "flagged" : ""}`}
                            onClick={() => handleScrollToQuestion(index)}
                      >
                          {index + 1}
                      </button>
                      ))}
                  </div>
                  <div className="leave-count-take-exam d-flex justify-content-center">
                    <p>Số lần rời khỏi trang: {leaveCount}</p>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default TakeExamPage;
