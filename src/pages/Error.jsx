import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookDead } from 'react-icons/fa';

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-richblack-900 via-purple-900 to-richblack-800 px-4">
      <div className="glass rounded-3xl shadow-neon p-10 flex flex-col items-center max-w-lg w-full">
        <div className="flex flex-col items-center mb-6">
          <FaBookDead className="text-6xl text-purple-400 mb-4 animate-bounce" />
          <h1 className="text-7xl font-extrabold text-white mb-2 drop-shadow-lg">404</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-white/70 text-center mb-6">
            Oops! The page you are looking for does not exist or has been moved.<br />
            Please check the URL or return to the homepage.
          </p>
        </div>
        <Link to="/" className="w-full flex justify-center">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-neon hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
