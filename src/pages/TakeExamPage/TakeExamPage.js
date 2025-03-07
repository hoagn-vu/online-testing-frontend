import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeExamPage.css';
import QuestionCard from '../../components/QuestionCard/QuestionCard';

const TakeExamPage = () => {
    const username = "Phương Linh";
    const studentID = "123456";
    const avatarUrl = ""; // Đường dẫn ảnh avatar

    
    const questions = [
        { question: "8 x 8 = ?", options: ["72", "80", "64", "56"], allowMultiple: false },
        { question: "1 + 1 = ?", options: ["1", "5", "4", "3", "2"], allowMultiple: true },
        { question: "Hôm nay là thứ mấy?", options: ["Thứ hai", "Chủ nhật", "Thứ năm", "Thứ ba"], allowMultiple: false },
        { question: "Cây lúa gạo thích hợp với điều kiện sinh thái nào sau đây?", 
            options: ["Khí hậu nóng, ẩm, chân ruộng ngập nước,đất phù sa.", 
                "Khí hậu ấm, khô, đất màu mỡ.", 
                "Khí hậu nóng, đất ẩm.", 
                "Khí hậu khô, đất thoát nước.", 
            ], 
            allowMultiple: false 
        },
        { question: "Ngành nuôi trồng thuỷ sản đang phát triển với tốc độ nhanh hơn ngành khai thác là do", 
            options: ["đáp ứng tốt hơn nhu cầu của con người và chủ động nguyên liệu cho các nhà máy chế biến.", 
                "nguồn lợi thuỷ sản tự nhiên đã cạn kiệt.", 
                "thiên tai ngày càng nhiều nên không thể đánh bắt được.", 
                "không phải đầu tư ban đầu.", 
            ], 
            allowMultiple: false 
        },
    ];
    
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

    return (
        <div>
            <div className="header-candidate-takexam-container d-flex align-items-center">
                <div className="user-info position-relative align-items-center d-flex justify-content-between w-100">
                    <div className='d-flex align-items-center '>
                        <img src={avatarUrl} alt="Avatar" className="avatar" />
                        <div>
                            <span className="username">{username}</span>
                            <span className="studentID"> - {studentID}</span>
                        </div>
                    </div>
                    <button className='btn btn-primary btn-sm '>Nộp bài</button>
                </div>
            </div>

            <div className="container container-take-exam d-flex justify-content-between">
                <div className="content-take-exam w-100">
                {questions.map((q, index) => (
                    <React.Fragment key={index}>
                        <QuestionCard 
                            questionNumber={index + 1} 
                            question={q.question} 
                            options={q.options} 
                            allowMultiple={q.allowMultiple}
                            onAnswerSelect={() => handleAnswerSelect(index)}
                            flagged={flaggedQuestions[index]} // Truyền trạng thái flagged
                            onToggleFlag={toggleFlag} // Gọi toggleFlag khi nhấn cờ
                        />
                        {/* Thêm <hr> giữa các câu hỏi, nhưng không thêm sau câu cuối cùng */}
                        {index < questions.length - 1 && (
                            <hr className='m-0 mt-3 mb-3 mx-auto' style={{width:'95%'}} />
                        )}
                    </React.Fragment>
                ))}
                    
                </div>

                <div className="sidebar-take-exams">
                    <div className="timer-take-exam">
                        <p className="time-title-take-exam">Thời gian còn lại</p>
                        <p className="time-count-take-exam">0:02:47</p>
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
                              onClick={() => setCurrentQuestion(index)}
                        >
                            {index + 1}
                        </button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TakeExamPage;
