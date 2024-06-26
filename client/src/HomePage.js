import leaf_design from './assets/leafdesign.png'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaSearch, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

const Homepage = () => {
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      axios.post('http://localhost:5000/profile', { username: storedUsername })
        .then(response => {
          setUserProfile(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);
  const handleLogout = () => {
    localStorage.setItem('username', '0');

    window.location.href = '/';
  };
  if (!userProfile) {
    return <div>Loading...</div>;
  }

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
        <SidebarButton to="/lookup" icon={<FaSearch />} text="Lookup" />

        <SidebarButton to="/about" icon={<FaQuestion />} text="About" />
      </div>

      {/* Main Content */}
      <div className="bg-white-resonate min-h-screen w-5/6 p-10">
        <div className="flex items-center justify-center mt-5">
          <h1 className=" text-9xl text-grey-resonate">Welcome</h1>
        </div>
        <div className="flex items-center justify-center mt-0">
          <h1 className=" text-9xl text-grey-resonate mx-[-25px]">{userProfile.name_first}</h1>
        </div>
        <div className="mt-5 text-black-resonate">
          <p>Welcome to Health Buddy, your personalized proactive health monitoring companion! In a world filled with uncertainties surrounding the development of orphan diseases, it can be daunting to navigate the complexities of understanding your own susceptibility. Health buddy is here to empower you by tracking and interpreting various risk factors in your life to calculate the likelihood of developing these diseases in your future.</p>
          <br></br>
          <p>To get started input some information on various aspects of your health life, by navigating to pages that can be located on the nav bar.</p>
          {}
        </div>
        <div className="flex items-center justify-center mt-5">
          <button onClick={handleLogout} className="bg-beige-resonate text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
