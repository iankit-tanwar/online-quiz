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
  const [expired, setExpired] = useState(false); // Track if time is expired
  

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuestions();
    var countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 30);

    const x = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var minutes = Math.floor(distance / 60000);
      var seconds = Math.floor((distance % 60000) / 1000);
      var formattedTime = minutes + "m " + seconds + "s";

      // Ensure that the element exists in the DOM before updating its innerHTML
      const countdownElement = document.getElementById("countdown");
      if (countdownElement) {
        countdownElement.innerHTML = formattedTime;
      }

      if (distance <= 0) {
        clearInterval(x);
        // Make sure to check the element again before updating its innerHTML
        if (countdownElement) {
          countdownElement.innerHTML = "EXPIRED";
        }
        setExpired(true); // Time is expired
      }
    }, 1000);

    
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

    // Mark the quiz as submitted
    setSubmitted(true);
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
      {submitted ? ( // If the quiz is submitted, don't display countdown
        <div>
          <h3>Quiz Complete!</h3>
          <p>Your Score: {score} out of {questions.length}</p>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Your Answer</th>
                <th scope="col">The Correct Answer</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {questions &&
                questions.map((cv, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{cv.name}</td>
                      <td>
                        {userAnswers[idx] === null
                          ? 'Not answered'
                          : cv.options[userAnswers[idx]]}
                      </td>
                      <td>{cv.options[cv.correctAnswer]}</td>
                      <td>
                        {userAnswers[idx] === cv.correctAnswer
                          ? 'Correct'
                          : 'Incorrect'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div id="countdown"></div>
          {expired ? ( // If time is Over, show "OVER" and score card
            <div>
              <h3>Time's Up! Quiz Over</h3>
              <p>Your Score: {score} out of {questions.length}</p>
            </div>
          ) : currentQuestionIndex < questions.length ? ( // If time is not expired, handle questions
            <div className="mb-4">
              <h4 className="d-flex justify-content-between">
                {questions[currentQuestionIndex].name}{' '}
                <span>
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </h4>
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
          ) : (
            // If all questions are answered, show the score card
            <div>
              <h3>Quiz Complete!</h3>
              <p>Your Score: {score} out of {questions.length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
