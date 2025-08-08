import React, { useState, useEffect } from 'react';
import './QuestionCard.css';
import { FlagIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

const QuestionCard = ({ question, options, questionId, questionNumber, allowMultiple, onAnswerSelect, flagged, onToggleFlag, questionIndex }) => {
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  
  const handleOptionChange = (optionId) => {
    let updatedSelection;

    if (allowMultiple) {
      updatedSelection = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter((id) => id !== optionId)
        : [...selectedOptionIds, optionId];
    } else {
      updatedSelection = [optionId];
    }

    setSelectedOptionIds(updatedSelection);
  };

  useEffect(() => {
    if (selectedOptionIds.length > 0 && onAnswerSelect) {
      onAnswerSelect(questionId, selectedOptionIds, questionIndex);
    }
  }, [selectedOptionIds]);

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
            <li key={option.optionId} className={`option ${selectedOptionIds.includes(option.optionId) ? 'selected' : ''}`}>
              <label className='d-flex pt-1'>
                <div>
                  <input
                    type={allowMultiple ? 'checkbox' : 'radio'}
                    name={allowMultiple ? undefined : `question-${questionId}`}
                    value={option.optionId}
                    checked={selectedOptionIds.includes(option.optionId)}
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
      optionId: PropTypes.string.isRequired,
      optionText: PropTypes.string.isRequired,
    })
  ).isRequired,
  questionId: PropTypes.string.isRequired,
  questionNumber: PropTypes.number.isRequired,
  allowMultiple: PropTypes.bool,
  onAnswerSelect: PropTypes.func,
  flagged: PropTypes.bool,
  onToggleFlag: PropTypes.func,
  questionIndex: PropTypes.number.isRequired,
};

export default QuestionCard;
