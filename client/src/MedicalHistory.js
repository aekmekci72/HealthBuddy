import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalHistory = () => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [year, setSelectedYear] = useState(''); // State to store selected year
  const [userMedicalHistory, setUserMedicalHistory] = useState([]);

  useEffect(() => {
    axios.post('http://localhost:5000/getdiseases')
      .then(response => {
        if (Array.isArray(response.data.user)) {
          setDiseases(response.data.user);
        } else {
          console.error('Diseases not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching:', error);
      });
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    axios.post('http://localhost:5000/getusermedicalhistory', {
      username: storedUsername,
    })
      .then(response => {
        if (Array.isArray(response.data.user)) {
          setUserMedicalHistory(response.data.user);
        } else {
          console.error('Medical History not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching:', error);
      });
  }, []);
  
  

  const handleDeleteMedicalHistory = (medicalHistoryItem) => {
    if (medicalHistoryItem.disease && medicalHistoryItem.year) {
      const storedUsername = localStorage.getItem('username');
      axios.post('http://localhost:5000/deletemedicalhistory', {
        username: storedUsername,
        disease: medicalHistoryItem.disease,
        year: medicalHistoryItem.year, 
      })
        .then(response => {
          if (!response.error) {
            const updatedUserMedicalHistory = userMedicalHistory.filter(item =>
              item.disease !== medicalHistoryItem.disease || item.year !== medicalHistoryItem.year
            );
            setUserMedicalHistory(updatedUserMedicalHistory);
          } else {
            console.error('Invalid response data from the server');
          }
        })
        .catch(error => {
          console.error('Error deleting medical history:', error);
        });
    }
  };
  

  const handleAddMedicalHistory = () => {
    if (selectedDisease && year) {
      const storedUsername = localStorage.getItem('username');
  
      console.log('Adding medical history with disease:', selectedDisease, 'and year:', year);
  
      axios.post('http://localhost:5000/addmedicalhistory', {
        username: storedUsername,
        disease: selectedDisease,
        year: year, 
      })
        .then(response => {
          if (!response.error) {
            const newMedicalHistory = {
              disease: selectedDisease,
              year: year, 
            };
  
            setUserMedicalHistory([...userMedicalHistory, newMedicalHistory]);
          } else {
            console.error('Invalid response data from the server');
          }
        })
        .catch(error => {
          console.error('Error adding medical history:', error);
        });
    } else {
      console.error('Please select a disease and a year for diagnosis.');
    }
  };
  

  // An example list of years, you can modify this as needed
  const yearsList = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="bg-white-resonate min-h-screen flex flex-col items-center relative">
      <div className="flex items-center relative mt-40">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Medical</h1>
      </div>
      <div className="flex items-center relative mt-5">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">History</h1>
      </div>
      <div>
        <select onChange={(e) => setSelectedDisease(e.target.value)}>
          <option value="">Select a Disease</option>
          {diseases.map((disease, index) => (
            <option key={index} value={disease.name}>
              {disease.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select a Year of Diagnosis</option>
          {yearsList.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={handleAddMedicalHistory}>Add</button>
      </div>
      <div>
        <h2>Your Medical History</h2>
        <ul>
        {userMedicalHistory.map((medicalHistoryItem, index) => (
          <li key={index}>
            {`${medicalHistoryItem.disease} - Diagnosed in ${medicalHistoryItem.year}`}
            <button onClick={() => handleDeleteMedicalHistory(medicalHistoryItem)}>Delete</button>
          </li>
        ))}

        </ul>
      </div>
    </div>
  );
};

export default MedicalHistory;
