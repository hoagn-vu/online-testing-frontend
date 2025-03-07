import React, { useState } from 'react';
import './QuestionCard.css';
import { FlagIcon } from 'lucide-react';

const QuestionCard = ({ question, options, questionNumber, allowMultiple }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (option) => {
    if (allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option) // Bỏ chọn nếu đã chọn
          : [...prev, option] // Thêm vào danh sách nếu chưa chọn
      );
    } else {
      setSelectedOptions([option]); // Chỉ chọn 1 đáp án
    }
  };

  return (
    <div className="question-card">
      <div className="question-take-exam">
        <div className="header-question-take-exam align-items-center d-flex">
          <p className='mb-0'>Câu {questionNumber}: {question}</p>
          <button>
            <FlagIcon size={20} className='mb-2' />
          </button>
        </div>
        <ul className="options-take-exam">
          {options.map((option, index) => (
            <li key={index} className={`option ${selectedOptions.includes(option) ? 'selected' : ''}`}>
              <label className='d-flex align-items-center pt-1'>
                <input
                  type={allowMultiple ? 'checkbox' : 'radio'}
                  name={allowMultiple ? undefined : `question-${questionNumber}`} // Nếu là radio, dùng name để nhóm lại
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
