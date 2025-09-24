import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeExamPage.css';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { useSelector } from "react-redux";
import avatar from "../../assets/images/avar.jpg";
import { Modal, Button } from "react-bootstrap";

const TakeExamPage = () => {
  const { organizeExamId, sessionId, roomId, takeExamId } = useParams();
  const avatarUrl = ""; // Đường dẫn ảnh avatar
  const userId = useSelector((state) => state.auth.user.id);
  const navigate = useNavigate();
  const [organizeExamName, setOrganizeExamName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [userCode, setUserCode] = useState("");
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.get(`/users/${userId}`, );

        setFullName(response.data.fullName);
        setUserCode(response.data.userCode);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [organizeExamId, sessionId, roomId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await ApiService.post("/generate-exam", {
          userId: userId,
          organizeExamId: organizeExamId,
          sessionId: sessionId,
          roomId: roomId
        });

        if (response.data.code !== "success") {
          navigate("/candidate/home");
          return;
        }

        setOrganizeExamName(response.data.data.organizeExamName);
        const processedQuestions = response.data.data.questions.map(q => {
          return {
            ...q,
            options: q.isRandomOrder ? shuffleArray(q.options) : q.options
          };
        });

        setQuestions(processedQuestions);
        setDuration(response.data.data.duration);
      } catch (error) {
        console.error('Failed to fetch questions: ', error);
      }
    };
    
    fetchQuestions();
  }, [organizeExamId, sessionId, roomId]);

  const handleQuickSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.post(
        `/submit-answer/${userId}/${takeExamId}/submit`
      );
      if (response.data.status === "submitted") {
        setIsLoading(false);
        navigate(`/candidate/result/${takeExamId}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Failed to quick submit answers: ", error);
    }
  };

  useEffect(() => {
    if (duration <= 0) {
      handleQuickSubmit();
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

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement &&
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement) {
        
        setIsWarning(true);
        setLeaveCount((prev) => prev + 1);
        handleLeaveExam();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // handleFullscreen();
    const handleBlur = () => {
      setIsWarning(true);
      setLeaveCount((prev) => prev + 1);
      handleLeaveExam();
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);
    
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

  const [answers, setAnswers] = useState([]);

  const handleAnswerChange = async (questionId, selectedOptionIds) => {
    setAnswers((prevAnswers) => {
      const existing = prevAnswers.find((a) => a.questionId === questionId);
      if (existing) {
        return prevAnswers.map((a) =>
          a.questionId === questionId
            ? { ...a, optionIds: selectedOptionIds }
            : a
        );
      } else {
        return [...prevAnswers, { questionId, optionIds: selectedOptionIds }];
      }
    });

    // đồng thời gọi API để lưu câu trả lời
    try {
      await ApiService.post(
        // `/process-take-exams/submit-answers?type=save&takeExamId=${organizeExamId}&userId=${userId}`,
        // [{ questionId, optionIds: selectedOptionIds }]
        `/submit-answer/${userId}/${takeExamId}/save`,
        { questionId: questionId, optionIds: selectedOptionIds }
      );
      console.log("Câu trả lời đã được lưu:", { questionId, optionIds: selectedOptionIds });
    } catch (error) {
      console.error("Lỗi khi lưu câu trả lời:", error);
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
        document.querySelector(".swal2-confirm").classList.add("swal-button");
        document.querySelector(".swal2-cancel").classList.add("swal-button");
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ApiService.post(
            `/submit-answer/${userId}/${takeExamId}/submit`
          );
          if (response.data.status === "submitted") {
            navigate(`/candidate/result/${takeExamId}`);
          }

        } catch (error) {
          console.error("Nộp bài thất bại:", error);
          Swal.fire("Lỗi", "Không thể nộp bài. Vui lòng thử lại.", "error");
        }
      }
    });
  };

  const handleCheckCanContinue = async () => {
    try {
      const response = await ApiService.get(`/process-take-exams/check-can-continue?userId=${userId}&takeExamId=${takeExamId}`);

      if (response.data && response.data.canContinue === false) {
        navigate(`/candidate/result/${takeExamId}`);
      }
    } catch (error) {
      console.error("Failed to check continue:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleCheckCanContinue();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, takeExamId]);

  const handleLeaveExam = async () => {
    try {
      await ApiService.post(`/process-take-exams/violation?userId=${userId}&takeExamId=${takeExamId}`);

    } catch (error) {
      console.error("Failed to leave exam:", error);
    }
  };

  const returnExamAfterLeave = () => {
    setIsWarning(false);
    handleFullscreen();
  };

  // useEffect(() => {
  //   if (leaveCount > 0) {
  //     handleLeaveExam();
  //   }
  // }, [leaveCount]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div> 
        <div>
          <div className="header-candidate-takexam-container d-flex align-items-center">
            <div className="user-info position-relative align-items-center d-flex justify-content-between w-100">
              <div className='d-flex align-items-center '>
                <img src={avatar} alt="Avatar" className="avatar" />
                <div className='ms-3'>
                  <p className="username m-0 p-0">{fullName}</p>
                  <p className="studentID m-0 p-0">{userCode}</p>
                </div>
              </div>
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
                    questionId={q.questionId}
                    question={q.questionText} 
                    options={q.options} 
                    allowMultiple={q.questionType === "multiple-choice"}
                    defaultSelectedOptions={q.options.filter(o => o.isChosen).map(o => o.optionId)} 
                    onAnswerSelect={(questionId, selectedOptionIds, index) => {
                      handleAnswerChange(questionId, selectedOptionIds);
                      handleAnswerSelect(index);
                    }}
                    flagged={flaggedQuestions[index]} 
                    onToggleFlag={toggleFlag}
                    questionIndex={index}
                    imgLinks={q.imgLinks}
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
              {/* <div className="leave-count-take-exam d-flex justify-content-center">
                <p>Số lần rời khỏi trang: {leaveCount}</p>
              </div> */}
            </div>

              <Modal show={isWarning} onHide={() => setIsWarning(false)} centered backdrop="static" keyboard={false}>
                <Modal.Header className="bg-light">
                  <Modal.Title className="text-center w-100">Cảnh báo</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                  <h5 className="fw-bold pb-2">Cảnh báo vi phạm</h5>
                  <p>Bạn đã rời khỏi trang</p>
                  <p>Đã thông báo cho giám thị</p>
                  <p>Nếu bạn tiếp tục rời khỏi trang, bài thi của bạn có thể bị hủy</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button variant="warning" onClick={returnExamAfterLeave}>
                    Quay lại làm bài
                  </Button>
                </Modal.Footer>
              </Modal>
              
            {/* ) : (
              <div className="warning-message mt-5">
                <p>Cảnh báo: Bạn đã rời khỏi trang {leaveCount} lần.</p>
                <p>Đã thông báo cho giám thị.</p>
                <p>Nếu bạn tiếp tục rời khỏi trang, bài thi của bạn có thể bị hủy.</p>
                <button className="btn btn-warning" onClick={returnExamAfterLeave}>
                  Quay lại làm bài
                </button>
              </div>
            ) } */}
          </div>
        </div>
    </div>
  );
};

export default TakeExamPage;
