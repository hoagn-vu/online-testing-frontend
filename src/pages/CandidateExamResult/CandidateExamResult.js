import React from "react";
import "./CandidateExamResult.css";

const CandidateExamResult = () => {
  const sampleData = {
    studentName: "Nguyễn Văn A",
    examCode: "EX123",
    duration: 45,
    score: 7,
    questions: [
      {
        questionText: "1 + 1 = ?",
        selectedAnswer: "A. 2",
        correctAnswer: "A. 2",
        score: 1,
        options: [
          { optionText: "A. 2" },
          { optionText: "B. 3" },
          { optionText: "C. 1" },
        ],
      },
      {
        questionText: "2 + 2 = ?",
        selectedAnswer: "B. 3",
        correctAnswer: "C. 4",
        score: 0,
        options: [
          { optionText: "A. 5" },
          { optionText: "B. 3" },
          { optionText: "C. 4" },
          { optionText: "D. 6" },
        ],
      },
      {
        questionText: "5 - 3 = ?",
        selectedAnswer: "A. 2",
        correctAnswer: "A. 2",
        score: 1,
        options: [
          { optionText: "A. 2" },
          { optionText: "B. 4" },
          { optionText: "C. 1" },
        ],
      },
    ],
  };
  const { studentName, examCode, duration, score, questions } = sampleData;

  return (
    <div className="p-4">
      <div className="header">
        <h2>Kết quả bài thi của: {studentName}</h2>
        <p><strong>Mã đề thi:</strong> {examCode}</p>
        <p><strong>Thời gian làm bài:</strong> {duration} phút</p>
        <p><strong>Điểm số:</strong> {score}/10</p>
      </div>
      <ul className="question-list">
        {questions.map((q, index) => (
          <li key={index} className="question-item">
            <h4>Câu {index + 1}: {q.questionText}</h4>
            <ul className="options-list">
              {q.options.map((option, optIndex) => {
                const isSelected = option.optionText === q.selectedAnswer;
                const isCorrect = option.optionText === q.correctAnswer;
                let className = "option";

                if (isSelected) {
                  className += isCorrect ? " correct" : " wrong";
                } else if (isCorrect) {
                  className += " correct";
                }

                return (
                  <li key={optIndex} className={className}>
                    {option.optionText}
                    {isSelected && " (Đáp án chọn)"}
                  </li>
                );
              })}
            </ul>
            <p><strong>Điểm:</strong> {q.score}</p>
          </li>
        ))}
      </ul>
      <div className="footer">
        <button className="btn btn-secondary" onClick={() => window.history.back()}>
          Quay lại
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Tải về kết quả
        </button>
      </div>
    </div>
  );
};

export default CandidateExamResult;