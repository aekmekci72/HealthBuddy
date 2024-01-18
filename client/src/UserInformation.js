import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import bg_profile2 from './assets/bg_profile2.png';
// import profileheading from './assets/profileheading.png';
import profilePictures from './profilePictures/profilePictures'; // Import the profilePictures object

const UserInformation = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const storedUsername = localStorage.getItem('username');

  useEffect(() => {
    // Get the username from localStorage
    const storedUsername = localStorage.getItem('username');

    // Fetch user profile based on the username
    axios.post('http://localhost:5000/userinfo', { username: storedUsername })
      .then(response => {
        setUserProfile(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
    setNewValue('');
    setShowModal(true);
    setIsEditing(true);
  };

  const handleSubmitEdit = () => {
    if (!newValue) {
      return;
    }
    const storedUsername = localStorage.getItem('username');

    const endpoint = `/edit${editingField}`;
    const data = {
      username: storedUsername,
      newValue
    };

    axios.post(`http://localhost:5000${endpoint}`, data)
      .then(response => {
        // Update user profile after successful edit
        setUserProfile(prevUserProfile => ({
          ...prevUserProfile,
          [editingField]: newValue
        }));

        // Close the modal and deactivate editing mode
        setShowModal(false);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error editing field:', error);
      });
  };


  return (
    
    <div className="bg-white-resonate min-h-screen flex flex-col items-center relative">
      <div className="flex items-center relative mt-40">
        <h1 className="font-reborn text-7xl text-black-resonate mx-[-25px]">General</h1>
      </div>
      <div className="flex items-center relative mt-5">
        <h1 className="font-reborn text-7xl text-black-resonate mx-[-25px]">Information</h1>
      </div>
      <div className="flex items-center flex-col mt-[14%]">
      <div>
          
          <div classname="mt-[-65%]">
            {}
            {}
        
            
            {userProfile && (
  <div className='mt-[-170%]'>
    {/* Display user information */}
    {Object.keys(userProfile).map((field) => {
      // Define a mapping for specific fields
      const fieldMappings = {
        name_first: 'First name',
        name_last: 'Last name',
        // Add more mappings for other fields if needed
      };

      const displayField = fieldMappings[field] || field; // Use the mapped value or the field itself

      return (
        <div
          key={field}
          className="flex items-center space-x-1 overflow-x-hidden justify-center"
          style={{ overflowWrap: 'break-word' }}
        >
          {isEditing && editingField === field ? (
            <>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <button
                onClick={handleSubmitEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded"
              >
                Submit
              </button>
            </>
          ) : (
            <>
              <label
                htmlFor={field}
                className="transition-colors hover:text-[#C2899E]"
              >
                {displayField.charAt(0).toUpperCase() + displayField.slice(1)}: {userProfile[field]}{' '}
                <button
                  onClick={() => handleEdit(field)}
                  className="text-[#679B89] hover:text-[#C2899E] transition-colors"
                >
                  Edit
                </button>
              </label>
            </>
          )}
        </div>
      );
    })}
  </div>
)}



          </div>
          </div>
          </div>
          </div>
  );
};

export default UserInformation;
