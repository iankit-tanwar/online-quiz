'use client'
import React, { useEffect, useState } from "react";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [durations, setDurations] = useState([]);


  useEffect(() => {
    fetchSubjects();

  }, []);

  function fetchSubjects() {
    fetch(`http://localhost:1337/api/subjects?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.data);
        console.log(data.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }



  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    fetch(`http://localhost:1337/api/subjects?populate=*&filters[name][$eq]=${e.target.value}`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming data.data[0].attributes.quiz_names is an array
        setLevels(data.data[0].attributes.quiz_names.data);
        console.log(data.data[0].attributes.quiz_names.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };




  // Handle level selection
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);


    // Find the selected level in your levels array
  const selectedLevel = levels.find((level) => level.attributes.name === e.target.value);

  if (selectedLevel) {
    console.log("Selected Level:", selectedLevel.attributes.name);
    console.log("Quiz Duration:", selectedLevel.attributes.quiz_duration_minutes);

    setDurations(selectedLevel.attributes.quiz_duration_minutes);
    
  }
  };

  
  

  return (
    <main className="container mt-5 d-flex justify-content-center">
      <div className="card text-center">
        <div className="card-header">
          <h1>WELCOME TO OKEDMY QUIZ</h1>
        </div>
        <div className="card-body nt-5 text-center">
          <div className='col '>
          <h5 className="d-flex justify-content-start">SELECT YOUR SUBJECT</h5>
            <select className="form-select" aria-label="Default select example" onChange={handleSubjectChange}>
             <option>Choose Your option</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.attributes.name}>
                  {subject.attributes.name}
                </option>
              ))}
            </select>
          </div>
          <div className='col mt-5'>
          <h5 className="d-flex justify-content-start">SELECT YOUR LEVEL</h5>
          <select className="form-select" aria-label="Default select example" onChange={handleLevelChange}>
              <option value="" selected>Level</option>
              {levels.map((levels) => (
                <option key={levels.id} value={levels.attributes.name}>
                  {levels.attributes.name}
                </option>
              ))}
            </select>

          </div>
          <div className="col mt-5">
          <h5 className="d-flex justify-content-start">DURARTION</h5>
            <input
              className="form-control mt-1"
              id="duration"
              type="text"
              aria-label="Disabled input example"
              value={durations}
              disabled
            />
          </div>
         
        </div>
        <div className="card-footer text-body-secondary">
          <a href="#" className="btn btn-primary">START QUIZ</a>
        </div>
      </div>
    </main>
  );
}
