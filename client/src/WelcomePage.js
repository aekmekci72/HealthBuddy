import leaf_design from './assets/leafdesign.png'; 
import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (


    <div className="bg-white-resonate min-h-screen flex flex-col items-center justify-center relative">
      
      <div className="flex items-center relative mt-40"> {}
      <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Health</h1>
        <img src={leaf_design} alt="Leaf Design" className="h-24 w-24 mt-[-29%]" />
      </div>
      <div className="flex items-center relative mt-5"> {}
        <h1 className="font-reborn text-9xl text-black-resonate mx-[-25px]">Buddy</h1>
      </div>


      {}

      <div className="flex"> {}
</div>

{}

<div class="font-CG_Reg p-10 w-24 min-w-[450px] text-black-resonate bg-yellow-resonate border-black-resonate rounded-lg mb-10 mt-[+5%] mr-[-0%]">
  <Link to="/signup" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            Sign Up
          </button>
        </Link>
  <Link to="/login" className="block">
          <button
            type="button"
            class="w-full border-r min-w-[200px] border-l border-t mt-5 text-black-resonate text-center px-4 py-3 text-md font-medium border-b border-black-resonate hover:bg-orange-resonate hover:text-white focus:z-10 focus:ring-2 focus:ring-amber-400 focus:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
            Log In
          </button>
        </Link>
</div>

{}
    
    </div>
  );
};

export default Homepage;
