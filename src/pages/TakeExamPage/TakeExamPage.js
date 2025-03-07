import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeExamPage.css';
import QuestionCard from '../../components/QuestionCard/QuestionCard';

const TakeExamPage = ({ username, avatarUrl, studentID }) => {
    const questions = [
        { question: "8 x 8 = ?", options: ["72", "80", "64", "56"], allowMultiple: false },
        { question: "1 + 1 = ?", options: ["1", "5", "4", "3", "2"], allowMultiple: false },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0); // Bắt đầu từ câu 1 (index 0)

    return (
        <div>
            <div className="header-candi-container">
                <div className="user-info position-relative">
                    <img src={avatarUrl} alt="Avatar" className="avatar" />
                    <div>
                        <span className="username">{username}</span>
                        <span className="studentID">{studentID}</span>
                    </div>
                </div>
            </div>

            <div className="container-take-exam">
                <div className="content-take-exam">
                    {/* Truyền dữ liệu vào QuestionCard */}
                    <QuestionCard 
                        questionNumber={currentQuestion + 1} 
                        question={questions[currentQuestion].question} 
                        options={questions[currentQuestion].options} 
                        allowMultiple={questions[currentQuestion].allowMultiple}
                    />

                    <QuestionCard 
                        questionNumber={currentQuestion + 1} 
                        question={questions[currentQuestion].question} 
                        options={questions[currentQuestion].options} 
                        allowMultiple={questions[currentQuestion].allowMultiple}
                    />
                </div>

                <div className="sidebar-take-exam">
                    <div className="timer-take-exam">
                        <p className="time-title-take-exam">Thời gian còn lại</p>
                        <p className="time-count-take-exam">0:02:47</p>
                    </div>
                    <div className="progress-take-exam">
                        <h2>Câu hỏi</h2>
                        <div className="progress-detail-take-exam">
                            <p className="ques-progress-take-exam">{currentQuestion + 1}/{questions.length}</p>
                            <div className="progress-container-take-exam">
                                <p className="progress-bar-take-exam"></p>
                            </div>
                        </div>
                    </div>
                    <div className="questions-nav-take-exam">
                        {questions.map((_, index) => (
                            <button 
                                key={index} 
                                className={currentQuestion === index ? "active-take-exam" : ""}
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
