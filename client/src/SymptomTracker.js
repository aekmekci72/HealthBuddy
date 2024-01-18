import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // You will need to install this library
import "react-datepicker/dist/react-datepicker.css";

const SymptomTracker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [userSymptoms, setUserSymptoms] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    // Fetch the list of symptoms using the 'getsymptoms' endpoint
    axios.post('http://localhost:5000/getsymptoms')
      .then(response => {
        if (Array.isArray(response.data.user)) {
          console.log(response.data.user);
          setSymptoms(response.data.user);
        } else {
          console.error('Symptoms not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
      });
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    // Fetch the user's symptoms history using the 'getusersymptoms' endpoint
    axios.post('http://localhost:5000/getusersymptoms', {
      username: storedUsername,
    })
      .then(response => {
        if (Array.isArray(response.data.user)) {
          setUserSymptoms(response.data.user);
        } else {
          console.error('Symptoms history not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching symptoms history:', error);
      });
  }, []);

  const handleDeleteSymptom = (symptomItem) => {
    const storedUsername = localStorage.getItem('username');
    
    console.log(storedUsername, symptomItem.symptom, new Date(symptomItem.date).toISOString().split('T')[0])
    axios.post('http://localhost:5000/deletesymptom', {
      username: storedUsername,
      symptom:symptomItem.symptom,
      date: new Date(symptomItem.date).toISOString().split('T')[0],
    }) 
      .then(response => {
        if (response.data.message === 'Symptom deleted successfully') {
          const updatedUserSymptoms = userSymptoms.filter(item =>
            item.symptom !== symptomItem.symptom || item.date !== symptomItem.date
          );
          setUserSymptoms(updatedUserSymptoms);
        } else {
          console.error('Server response: Symptom not deleted');
        }
      })
      .catch(error => {
        console.error('Error deleting symptom:', error);
      });
  };
  

  const handleAddSymptom = () => {
    if (selectedSymptom && selectedDate) {
      const storedUsername = localStorage.getItem('username');

      axios.post('http://localhost:5000/addsymptom', {
        username: storedUsername,
        symptom: selectedSymptom,
        date: selectedDate,
      })
        .then(response => {
          if (!response.error) {
            const newSymptom = {
              symptom: selectedSymptom,
              date: selectedDate,
            };

            setUserSymptoms([...userSymptoms, newSymptom]);
          } else {
            console.error('Invalid response data from the server');
          }
        })
        .catch(error => {
          console.error('Error adding symptom:', error);
        });
    } else {
      console.error('Please select a symptom and a date for tracking.');
    }
  };

  return (
    <div className="bg-white-resonate min-h-screen flex flex-col items-center relative">
      <div className="flex items-center relative mt-40">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Symptom</h1>
      </div>
      <div className="flex items-center relative mt-5">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Tracker</h1>
      </div>
      <div>
        <select onChange={(e) => setSelectedSymptom(e.target.value)}>
          <option value="">Select a Symptom</option>
          {symptoms.map((symptom, index) => (
            <option key={index} value={symptom.symtpom}>
              {symptom.symptom}
            </option>
          ))}
        </select>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          placeholderText="Select a Date"
        />
        <button onClick={handleAddSymptom}>Add</button>
      </div>
      <div>
        <h2>Your Symptom History</h2>
        <ul>
        {userSymptoms.map((symptomItem, index) => (
          <li key={index}>
            {`${symptomItem.symptom} - Tracked on ${new Date(symptomItem.date).toLocaleDateString()}`}
            <button onClick={() => handleDeleteSymptom(symptomItem)}>Delete</button>
          </li>
        ))}

        </ul>
      </div>
    </div>
  );
};

export default SymptomTracker;
