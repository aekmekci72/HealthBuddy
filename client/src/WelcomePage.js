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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ullamcorper risus a nisl sollicitudin, vel dapibus sem eleifend. Nullam ut lacus quam. Vivamus euismod, velit at lacinia commodo, tortor nulla vulputate justo, eget gravida dui odio vitae est.
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
