import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-white">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

const Homepage = () => {
  return (


    <div className="flex">
    {/* Sidebar/Navbar */}
    <div className="bg-yellow-resonate w-1/6 p-6">
    <div className="mb-4 text-black text-2xl font-bold">
        Health Buddy
      </div>
      <SidebarButton to="/login" icon={<FaHome />} text="Log In" />
      <SidebarButton to="/signup" icon={<FaUser />} text="Sign Up" />
    </div>

    {/* Main Content */}
    <div className="bg-white-resonate min-h-screen w-5/6 p-10">
      <div className="flex items-center justify-center mt-5">
        <h1 className=" text-9xl text-grey-resonate">Health</h1>
      </div>
      <div className="flex items-center justify-center mt-0">
        <h1 className=" text-9xl text-grey-resonate mx-[-25px]">Buddy</h1>
      </div>
      <div className="mt-5 text-black-resonate">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ullamcorper risus a nisl sollicitudin, vel dapibus sem eleifend. Nullam ut lacus quam. Vivamus euismod, velit at lacinia commodo, tortor nulla vulputate justo, eget gravida dui odio vitae est.</p>
        {}
      </div>
    </div>
{}
    
    </div>
  );
};

export default Homepage;
