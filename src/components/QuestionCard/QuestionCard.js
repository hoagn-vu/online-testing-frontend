import React, { useState } from 'react';
// import { FlagIcon } from "lucide-react";
import './QuestionCard.css'

const QuestionCard = ({ question, options, questionNumber, allowMultiple }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

    const handleOptionClick = (option) => {
        if (allowMultiple) {
            setSelectedOptions(prev => 
                prev.includes(option) 
                    ? prev.filter(item => item !== option) 
                    : [...prev, option]
            );
        } else {
            setSelectedOptions([option]);
        }
    };

  return (
    <div className="question-card">
            <div className="header-question-card">
                <h2>Question {questionNumber}</h2>
                <button><i className="fa-solid fa-flag"></i></button>
            </div>
            <p>{question}</p>
            <ul className="options-list">
                {options.map((option, index) => (
                    <li key={index} className={`option ${selectedOptions.includes(option) ? 'selected' : ''}`} 
                        onClick={() => handleOptionClick(option)}>
                        {option}
                    </li>
                ))}
            </ul>
        </div>
  );
};

export default QuestionCard;
