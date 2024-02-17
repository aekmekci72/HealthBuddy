import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaHome } from 'react-icons/fa';

const Homepage = () => {
  return (
    <div className="flex">

      {/* Main Content */}
      <div className="bg-white-resonate min-h-screen p-10">
        <div className="flex items-center justify-center mt-5">
          <h1 className="text-9xl text-grey-resonate">Health</h1>
        </div>
        <div className="flex items-center justify-center mt-0">
          <h1 className="text-9xl text-grey-resonate mx-[-25px]">Buddy</h1>
        </div>
        <div className="mt-5 text-black-resonate">
          <p>
          Welcome to Health Buddy, your personalized proactive health monitoring companion! In a world filled with uncertainties surrounding the development of orphan diseases, it can be daunting to navigate the complexities of understanding your own susceptibility. Health buddy is here to empower you by tracking and interpreting various risk factors in your life to calculate the likelihood of developing these diseases in your future.
          </p>
          {/* Login and Signup Buttons */}
          <div className="flex justify-center mt-4">
            <Link to="/login" className={`bg-beige-resonate text-white py-2 px-4 rounded-md mr-4 hover:bg-custom-button-hover-color`}>
              <FaHome className="mr-2" />
              Log In
            </Link>
            <Link to="/signup" className={`bg-beige-resonate text-white py-2 px-4 rounded-md hover:bg-custom-button-hover-color`}>
              <FaUser className="mr-2" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
