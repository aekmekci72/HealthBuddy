import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

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
  if (familyHistoryItem.disease && familyHistoryItem.generation) {
    const storedUsername = localStorage.getItem('username');
    axios.post('http://localhost:5000/deletefamilyhistory', {
      username: storedUsername,
      disease: familyHistoryItem.disease,
      generation: familyHistoryItem.generation,
    })
      .then(response => {
        const updatedUserFamilyHistory = userFamilyHistory.filter(item =>
          item.disease !== familyHistoryItem.disease || item.generation !== familyHistoryItem.generation
        );
        setUserFamilyHistory(updatedUserFamilyHistory);
      })
      .catch(error => {
        console.error('Error deleting family history:', error);
      });
  }
};

  
  

  return (
    <div className="flex">
      {/* Sidebar/Navbar */}
      <div className="bg-yellow-resonate w-1/6 p-6">
      <div className="mb-4 text-black text-2xl font-bold">
          Health Buddy
        </div>
        <SidebarButton to="/homepage" icon={<FaHome />} text="Home" />
        <SidebarButton to="/profile" icon={<FaUser />} text="Profile" />
        <SidebarButton to="/userinformation" icon={<FaInfoCircle />} text="General Info" />
        <SidebarButton to="/familyhistory" icon={<FaHistory />} text="Family History" />
        <SidebarButton to="/symptomtracker" icon={<FaChartLine />} text="Symptom Tracker" />
        <SidebarButton to="/results" icon={<FaList />} text="Results" />
        <SidebarButton to="/about" icon={<FaQuestion />} text="About" />
      </div>
      <div className="bg-white-resonate min-h-screen w-5/6 p-10">
        <div className="flex items-center justify-center mt-5">
          <h1 className=" text-9xl text-grey-resonate">Family</h1>
        </div>
        <div className="flex items-center justify-center mt-0">
          <h1 className=" text-9xl text-grey-resonate mx-[-25px]">History</h1>
        </div>
      <div className="flex items-center flex-col mt-[5%]">
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
    </div>
    </div>
  );
};

export default FamilyHistory;
