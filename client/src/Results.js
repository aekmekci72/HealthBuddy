import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Results = () => {
  const [diseaseMatches, setDiseaseMatches] = useState([]);
  const storedUsername = localStorage.getItem('username');

  useEffect(() => {
    axios
      .post('http://localhost:5000/calculatepercentagematch', {
        username: storedUsername,
      })
      .then((response) => {
        const diseaseMatchResults = response.data.diseaseMatchResults;

        if (diseaseMatchResults && typeof diseaseMatchResults === 'object') {
          setDiseaseMatches(
            Object.entries(diseaseMatchResults).map(([disease, percent]) => ({
              disease,
              percent,
            }))
          );
        } else {
          console.error('Invalid disease match data format in the response');
        }
      })
      .catch((error) => {
        console.error('Error fetching disease match data:', error);
      });
  }, [storedUsername]);

  return (
    <div className = "bg-white-resonate min-h-screen flex flex-col items-center relative">
      <div className="flex items-center relative mt-40">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Results</h1>
      </div>
      <ul>
        {diseaseMatches.map((diseaseMatch, index) => (
          <li key={index}>
            {`${diseaseMatch.disease}: ${diseaseMatch.percent.toFixed(2)}%`}
          </li>
        ))}

      </ul>
    </div>
  );
};

export default Results;
