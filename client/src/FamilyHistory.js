import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FamilyHistory = () => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [userFamilyHistory, setUserFamilyHistory] = useState([]);
  useEffect(() => {
    axios.post('http://localhost:5000/getdiseases')
      .then(response => {
        console.log('Response from server:', response.data);
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
    axios.post('http://localhost:5000/getuserfamilyhistory', {
      username: storedUsername,
    })
    .then(response => {
      console.log('Response from server:', response.data);
      setUserFamilyHistory(response.data.user);
      if (Array.isArray(response.data.user)) {
        setUserFamilyHistory(response.data.user);
      } else {
        console.error('Family History not found in the response data');
      }
    })
    .catch(error => {
      console.error('Error fetching:', error);
    });
}, []);
const handleAddFamilyHistory = () => {
  if (selectedDisease && selectedGeneration) {
    const storedUsername = localStorage.getItem('username');



    axios.post('http://localhost:5000/addfamilyhistory', {
      username: storedUsername,
      disease: selectedDisease,
      generation: selectedGeneration,
    })
      .then(response => {
        if (!response.error) {
          const newFamilyHistory = {
            disease: selectedDisease,
            generation: selectedGeneration,
          };
      
          setUserFamilyHistory([...userFamilyHistory, newFamilyHistory]);
        } else {
          console.error('Invalid response data from the server');
        }
      })
      .catch(error => {
        console.error('Error adding family history:', error);
      });
  }
};



  const handleDeleteFamilyHistory = (familyHistoryItem) => {
    if (familyHistoryItem.disease && familyHistoryItem.familyMember) {
      const storedUsername = localStorage.getItem('username');
      axios.post('http://localhost:5000/deletefamilyhistory', {
        username: storedUsername,
        disease: familyHistoryItem.disease,
        generation: familyHistoryItem.generation,
      })
        .then(response => {
          const updatedUserFamilyHistory = userFamilyHistory.filter(item => item !== familyHistoryItem);
          setUserFamilyHistory(updatedUserFamilyHistory);
        })
        .catch(error => {
          console.error('Error deleting family history:', error);
        });
    }
  };
  
  

  return (
    <div className="bg-white-resonate min-h-screen flex flex-col items-center relative">
      <div className="flex items-center relative mt-40">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Family</h1>
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
        <select onChange={(e) => setSelectedGeneration(e.target.value)}>
          <option value="">Generations back</option>
          {[...Array(10).keys()].map((generation) => (
            <option key={generation} value={generation + 1}>
              {generation + 1}
            </option>
          ))}
        </select>

        <button onClick={handleAddFamilyHistory}>Add</button>
      </div>
      <div>
        <h2>Your Family History</h2>
        <ul>
          {userFamilyHistory.map((familyHistoryItem, index) => (
            <li key={index}>
              {`${familyHistoryItem.disease} - ${familyHistoryItem.generation}`}
              <button onClick={() => handleDeleteFamilyHistory(familyHistoryItem)}>Delete</button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default FamilyHistory;
