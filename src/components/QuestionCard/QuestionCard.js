import React, { useState, useEffect } from 'react';
import './QuestionCard.css';
import { FlagIcon } from 'lucide-react';

const QuestionCard = ({ question, options, questionNumber, allowMultiple, onAnswerSelect, flagged, onToggleFlag }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (option) => {
    let updatedSelection;

    if (allowMultiple) {
      updatedSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];
    } else {
      updatedSelection = [option];
    }

    setSelectedOptions(updatedSelection);
    
  };

  // Gọi callback khi selectedOptions thay đổi
  useEffect(() => {
    if (selectedOptions.length > 0 && onAnswerSelect) {
      onAnswerSelect(questionNumber); // Truyền index câu hỏi
    }
  }, [selectedOptions, onAnswerSelect, questionNumber]);

  return (
    <div className="question-card">
      <div className="question-take-exam">
        <div className="header-question-take-exam align-items-center d-flex">
          <p className='mb-0'>Câu {questionNumber}: {question}</p>
          <button 
              className={`ps-2 pe-2 pb-1 ${flagged ? 'flag-active' : ''}`} 
              onClick={() => onToggleFlag(questionNumber - 1)}
          >
              <FlagIcon size={16} />
          </button>

        </div>
        <ul className="options-take-exam">
          {options.map((option, index) => (
            <li key={index} className={`option ${selectedOptions.includes(option) ? 'selected' : ''}`}>
              <label className='d-flex align-items-center pt-1'>
                <input
                  type={allowMultiple ? 'checkbox' : 'radio'}
                  name={allowMultiple ? undefined : `question-${questionNumber}`}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                <span>{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionCard;
