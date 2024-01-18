import leaf_design from './assets/leafdesign.png'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    console.log(storedUsername);

    if (storedUsername) { // Check if storedUsername is not null or undefined
      axios.post('http://localhost:5000/profile', { username: storedUsername })
        .then(response => {
          setUserProfile(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);
  
  // Render conditionally based on userProfile
  if (!userProfile) {
    return <div>Loading...</div>; // You can replace this with a loading indicator
  }

  return (
    <div className="bg-white-resonate min-h-screen flex flex-col items-center justify-center relative">
      <div className="flex items-center relative mt-40">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Welcome</h1>
        <img src={leaf_design} alt="Leaf Design" className="h-24 w-24 mt-[-29%]" />
      </div>
      <div className="flex items-center relative mt-5">
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">{userProfile.name_first}</h1>
      </div>
      
<div class="font-CG_Reg p-10 w-24 min-w-[450px] text-black-resonate bg-yellow-resonate border-black-resonate rounded-lg mb-10 mt-[+5%] mr-[-0%]">
  <Link to="/profile" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            Profile
          </button>
        </Link>
  <Link to="/userinformation" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            General Information
          </button>
        </Link>
  <Link to="/familyhistory" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            Family History
          </button>
        </Link>
  <Link to="/medicalhistory" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            Medical History
          </button>
        </Link>
  <Link to="/symptomtracker" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Symptom Tracker
          </button>
        </Link>

  <Link to="/results" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            Results
          </button>
        </Link>
  <Link to="/about" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            About
          </button>
        </Link>
</div>

{}
    
    </div>
  );
};

export default Homepage;
