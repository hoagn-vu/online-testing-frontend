import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeExamPage.css'
import QuestionCard from '../../components/QuestionCard/QuestionCard';

const TakeExamPage = () => {
    const questions = [
        { question: "8 x 8 = ?", options: ["72", "80", "64", "56"] },
        { question: "1 + 1 = ?", options: ["1", "5", "4", "3", "2"] },
      ];

    return (
        <div className="">

        </div>
    );
};


export default TakeExamPage;