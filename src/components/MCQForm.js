'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const answerToNumber = {
  ans1: 0,
  ans2: 1,
  ans3: 2,
  ans4: 3,
};

export default function MCQForm() {
  
  const searchParams = useSearchParams();
  const search = searchParams.get('qtest');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  function fetchQuestions() {
    fetch(`http://localhost:1337/api/questions?filters[Subject][$eq]=${search}`)
      .then((res) => res.json())
      .then((data) => {
        const extractedQuestions = data.data.map((item) => ({
          name: item.attributes.name,
          options: [
            item.attributes.ans1,
            item.attributes.ans2,
            item.attributes.ans3,
            item.attributes.ans4,
          ],
          correctAnswer: answerToNumber[item.attributes.correctAnswer],
        }));

        setQuestions(extractedQuestions);
        const initialUserAnswers = new Array(extractedQuestions.length).fill(null);
        setUserAnswers(initialUserAnswers);
        const initialCorrectAnswers = extractedQuestions.map((question) => question.correctAnswer);
        setCorrectAnswers(initialCorrectAnswers);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleAnswerSelect = (selectedOption) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(updatedUserAnswers);
  };


  const calculateScore = () => {
    return questions.reduce((totalScore, currentQuestion, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === currentQuestion.correctAnswer) {
        return totalScore + 1;
      }
      return totalScore;
    }, 0);
  };

  const submitAnswer = () => {
    // Calculate the score
    const newScore = calculateScore();
  
    // Move to the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  
    // Update the score state
    setScore(newScore);
  };
  

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="container">
      {currentQuestionIndex < questions.length && (
        <div className="mb-4">
          <h4 className='d-flex justify-content-between'>{questions[currentQuestionIndex].name} <span>{currentQuestionIndex+1}/{questions.length}</span></h4>
          <ul className="list-group">
            {questions[currentQuestionIndex].options.map((option, optionIndex) => (
              <li key={optionIndex} className="list-group-item">
                <label className="form-check-label">
                  <input
                    type="radio"
                    name={`question${currentQuestionIndex}`}
                    value={optionIndex}
                    checked={userAnswers[currentQuestionIndex] === optionIndex}
                    onChange={() => handleAnswerSelect(optionIndex)}
                    className="form-check-input me-3"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-2 d-flex justify-content-between">
            {currentQuestionIndex > 0 && (
              <button onClick={previousQuestion} className="btn btn-secondary">
                Previous
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 && (
              <button onClick={nextQuestion} className="btn btn-primary">
                Next
              </button>
            )}
            {currentQuestionIndex === questions.length - 1 && (
              <button onClick={submitAnswer} className="btn btn-primary">
                Submit
              </button>
            )}
          </div>
        </div>
      )}

      {currentQuestionIndex === questions.length && (
        <div>
          <h3>Quiz Complete!</h3>
          <p>Your Score: {score} out of {questions.length}</p>
        </div>
      )}
    </div>
  );
}
