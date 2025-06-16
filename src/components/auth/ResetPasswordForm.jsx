// src/components/auth/ResetPasswordForm.jsx
import { useState } from 'react';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Make API request to reset password endpoint
      await axios.patch(`https://5vwd9w13-5000.inc1.devtunnels.ms/api/auth/resetpassword/${token}`, {
   
        password
      });
      
      // Show success state
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to reset password. The link may have expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-8">
        <div className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 text-center">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Password Reset Successful! 🎉</h2>
            <p className="text-gray-500 mt-2">Your password has been updated successfully</p>
          </div>
          
          <div className="py-6">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <p className="text-gray-600 mb-8">
              You'll be redirected to the login page shortly.
            </p>
            
            <div className="mt-6">
              <Link 
                to="/login" 
                className="inline-block py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-8">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Reset Your Password 🔒</h2>
          <p className="text-gray-500 mt-2">Create a new password for your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="New Password"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Confirm New Password"
                required
              />
            </div>
            
            <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
              <p className="font-medium">Password Requirements:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>At least 6 characters</li>
                <li>No spaces</li>
                <li>Not too common</li>
              </ul>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;