import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeExamPage.css'
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import { Link } from 'react-router-dom';

const TakeExamPage = ({ username, avatarUrl, studentID }) => {
    const questions = [
        { question: "8 x 8 = ?", options: ["72", "80", "64", "56"] },
        { question: "1 + 1 = ?", options: ["1", "5", "4", "3", "2"] },
      ];
    const [currentQuestion, setCurrentQuestion] = useState(1);

    return (
        <div>
            <div className="header-candi-container">
                {/* Avatar + Tên + Nút mở dropdown */}
                <div className="user-info position-relative">
                    <img src={avatarUrl} alt="Avatar" className="avatar" />
                    <div>
                        <span className="username">{username}</span>
                        <span className="studentID">{studentID}</span>
                    </div>
                </div>
            </div>

        <div className='d-flex'>
            <div className='content-01 mt-5'>
                    <div className="">
                        {questions.map((q, index) => (
                            <QuestionCard key={index} question={q.question} options={q.options} questionNumber={index + 1} />
                        ))}
                </div>
            </div>

                
            <div className='content-02'>
                {/* Sidebar hiển thị thời gian và danh sách câu hỏi */}
                <div className="p-4 rounded-xl shadow-md w-64">
                    {/* Đồng hồ đếm ngược */}
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                        <p className="text-sm font-semibold">Time to complete</p>
                        <p className="text-orange-500 text-2xl font-bold">10:00</p>
                    </div>

                    {/* Thanh tiến trình */}
                    <p className="mt-4 text-sm">Question</p>
                    <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(currentQuestion / questions.length) * 100}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{currentQuestion}/{questions.length}</p>

                    {/* Danh sách câu hỏi */}
                    <div className="grid grid-cols-5 gap-2 mt-4">
                    {Array.from({ length: questions.length }, (_, i) => (
                        <button
                        key={i}
                        className={`p-2 rounded-lg border ${currentQuestion === i + 1 ? "bg-gray-400 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                        onClick={() => setCurrentQuestion(i + 1)}
                        >
                        {i + 1}
                        </button>
                    ))}
                    </div>
                </div>
            </div>

        </div>
        </div>
    );
};


export default TakeExamPage;