import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // React Router v6+

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 bg-gray-100 text-center">
      <h1 className="text-6xl font-extrabold text-red-600">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you're looking for doesn’t exist or has been moved.
      </p>

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center mt-6 px-5 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
      >
        <FaArrowLeft className="mr-2" /> Go to Home
      </button>

      {/* <div className="mt-10">
 <img
  src="https://illustrations.popsy.co/gray/web-error.svg"
  alt="Not Found Illustration"
  className="w-80 mx-auto"
/>
      </div> */}
    </div>
  );
};

export default NotFound;
