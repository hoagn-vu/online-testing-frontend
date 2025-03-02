import React from "react";

const QuestionCard = ({ question, options, questionNumber }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold">Question {questionNumber}:</h3>
      <p className="mb-2">{question}</p>
      <ul className="space-y-2">
        {options.map((option, index) => (
          <li key={index} className="flex items-center">
            <input type="radio" name={`question-${questionNumber}`} id={`option-${index}`} />
            <label htmlFor={`option-${index}`} className="ml-2 cursor-pointer">
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCard;
