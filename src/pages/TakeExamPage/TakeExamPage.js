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

            <div className="container-take-exam">
                <div className="content-take-exam">
                    <div className="question-take-exam">
                        <div className="header-question-take-exam">
                            <h2 id="q1">Question 1</h2>
                            <button><i className="fa-solid fa-flag"></i></button>
                        </div>
                        <p>Who was the first female Prime Minister of the United Kingdom?Who was the first female Prime Minister of the United Kingdom?Who was the first female Prime Minister of the United Kingdom?Who was the first female Prime Minister of the United Kingdom?</p>
                        <ul className="options-take-exam">

                        </ul>
                    </div>
                    <div className="question-take-exam">
                        <div className="header-question-take-exam">
                            <h2 id="q2">Question 2</h2>
                            <button id="button-active"><i className="fa-solid fa-flag"></i></button>
                        </div>                
                        <p>Who was the famous explorer who discovered America?</p>
                        <ul className="options-take-exam">
                        </ul>
                    </div>
                    <div className="question-take-exam">
                        <div className="header-question-take-exam">
                            <h2 id="q3">Question 3</h2>
                            <button><i className="fa-solid fa-flag"></i></button>
                        </div>                
                        <p>Who was the famous explorer who discovered America?</p>
                        <ul className="options-take-exam">
                        </ul>
                    </div>
                    <div className="question-take-exam">
                        <div className="header-question-take-exam">
                            <h2 id="q4">Question 4</h2>
                            <button><i className="fa-solid fa-flag"></i></button>
                        </div>                
                        <p>Who was the famous explorer who discovered America?</p>
                        <ul className="options-take-exam">
                        </ul>
                    </div>
                    <div classNameName="question-take-exam">
                        <div className="header-question-take-exam">
                            <h2 id="q5">Question 5</h2>
                            <button><i className="fa-solid fa-flag"></i></button>
                        </div>                
                        <p>Who was the famous explorer who discovered America?</p>
                        <ul className="options-take-exam">
                        </ul>
                    </div>
                </div>

                <div className="sidebar-take-exam">
                    <div className="timer-take-exam">
                        <p className="time-title-take-exam">Time to complete</p>
                        <p className="time-count-take-exam">0:02:47</p>
                    </div>
                    <div className="progress-take-exam">
                        <h2>Question</h2>
                        <div className="progress-detail-take-exam">
                            <p className="ques-progress-take-exam">11/21</p>
                            <div className="progress-container-take-exam">
                                <p className="progress-bar-take-exam"></p>
                            </div>
                        </div>
                    </div>
                    <div className="questions-nav-take-exam">
                        <button className="active-take-exam">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>
                        <button>6</button>
                        <button>7</button>
                        <button>8</button>
                        <button>9</button>
                        <button>10</button>
                    </div>
                </div>
            </div>

        
        </div>
    );
};


export default TakeExamPage;