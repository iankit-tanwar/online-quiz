'use client'

import React, { useState } from 'react';
import MCQForm from '@/components/MCQForm';
import { useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const search = searchParams.get('qtest');
  const [showMCQForm, setShowMCQForm] = useState(false);

  const startQuiz = () => {
   
    setShowMCQForm(true);
  };

  return (
    <div className="container">
      <div className="row mt-3 m-0">
        <div className="col-12 a_tbdr p-0">
          <div className="card">
            <div className="card-header">
              <h1>ONLINE {search} QUIZ TEST</h1>
            </div>
            <div className="card-body">
            
                
              {showMCQForm ? (
                <MCQForm />
              ) : (
                <div>
                    <h2>THE TEST</h2>
                  <p>The test contains 25 questions and there is 30m time limit</p>
                  <p>The test is not official; it's just a nice way to see how much you know or don't know about the {search}</p>
                  <h1>COUNT YOUR SCORE</h1>
                  <p>You will get 1 point for each correct answer. At the end of the quiz, your total score will be displayed. The maximum score is 25 points</p>
                  <p>Quiz Topic: {search}</p>
                  <h5 className="card-title">Start the Quiz</h5>
                  <p className="card-text">Good luck</p>
                  <button className='btn btn-success' onClick={startQuiz}>Start the {search} quiz</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
