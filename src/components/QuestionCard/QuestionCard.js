import React, { useState, useEffect } from 'react';
import './QuestionCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

const QuestionCard = ({ question, options, questionNumber, allowMultiple, onAnswerSelect, flagged, onToggleFlag }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  useEffect(() => {
    const preselected = options
      .filter(option => option.IsChosen === true)
      .map(option => option.optionId);
    setSelectedOptions(preselected);
  }, [options]);
  
  const handleOptionChange = (optionId) => {
    let updatedSelection;
  
    if (allowMultiple) {
      updatedSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter((o) => o !== optionId)
        : [...selectedOptions, optionId];
    } else {
      updatedSelection = [optionId];
    }
  
    setSelectedOptions(updatedSelection);

    if (onAnswerSelect) {
      onAnswerSelect(questionNumber - 1, updatedSelection);
    }
  };  
  
  // const handleOptionChange = (option) => {
  //   let updatedSelection;

  //   if (allowMultiple) {
  //     updatedSelection = selectedOptions.includes(option)
  //       ? selectedOptions.filter((o) => o !== option)
  //       : [...selectedOptions, option];
  //   } else {
  //     updatedSelection = [option];
  //   }

  //   setSelectedOptions(updatedSelection);
    
  // };

  // // Gọi callback khi selectedOptions thay đổi
  // useEffect(() => {
  //   if (selectedOptions.length > 0 && onAnswerSelect) {
  //     onAnswerSelect(questionNumber); // Truyền index câu hỏi
  //   }
  // }, [selectedOptions, onAnswerSelect, questionNumber]);

  return (
    <div className="question-card">
      <div className="question-take-exam">
        <div className="header-question-take-exam align-items-center d-flex">
          <p className='mb-0 fw-bold'>Câu {questionNumber}: {question}</p>
          <button 
            className={`ps-2 pe-2 ${flagged ? 'flag-active' : ''}`} 
            onClick={() => onToggleFlag(questionNumber - 1)}
          >
            <FontAwesomeIcon icon={faFlag} size="" />
          </button>

        </div>
        <ul className="options-take-exam">
          {options.map((option, index) => (
            <li key={index} className={`option ${selectedOptions.includes(option.optionId) ? 'selected' : ''}`}>
              <label className='d-flex pt-1'>
                <div>
                  <input
                    type={allowMultiple ? 'checkbox' : 'radio'}
                    name={allowMultiple ? undefined : `question-${questionNumber}`}
                    value={option.optionId}
                    checked={selectedOptions.includes(option.optionId)}
                    onChange={() => handleOptionChange(option.optionId)}
                  />
                </div>
                <span>{option.optionText}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      optionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      optionText: PropTypes.string.isRequired
    })
  ).isRequired,
  questionNumber: PropTypes.number.isRequired,
  allowMultiple: PropTypes.bool,
  onAnswerSelect: PropTypes.func,
  flagged: PropTypes.bool,
  onToggleFlag: PropTypes.func,
};

export default QuestionCard;
