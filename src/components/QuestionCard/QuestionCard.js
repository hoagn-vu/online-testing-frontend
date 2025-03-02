import React from "react";
import { FlagIcon } from "lucide-react";
import './QuestionCard.css'

const QuestionCard = ({ question, options, questionNumber }) => {
  return (
    <div className=" p-4 rounded-xl shadow-md d-flex">
      <div>
        <p className="text-lg font-bold mb-0">Câu {questionNumber}: <span>{question}</span> </p> 
        <ul className="">
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
      {/* Nút gắn cờ */}
      <button className="absolute top-4 right-4 p-2 rounded-lg border shadow-md hover:bg-gray-100">
        <FlagIcon size={16} />
      </button>
    </div>
  );
};

export default QuestionCard;
