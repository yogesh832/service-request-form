import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsLoading(true);
    
  //   try {
  //     // Make API request to forgot password endpoint
  //     await api.post('/auth/forgotpassword', { email });
      
  //     // Show success message
  //     setIsSubmitted(true);
  //     toast.success('Password reset email sent successfully!');
  //   } catch (err) {
  //     // Handle errors
  //     setError(
  //       err.response?.data?.message || 
  //       'Failed to send reset email. Please try again.'
  //     );
  //     toast.error(err.response?.data?.message || 'Error sending reset email');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const origin = window.location.origin; // 👈 gets "https://service-request-jhgh.vercel.app"

    await api.post('/auth/forgotpassword', {
      email,
      origin, // ✅ send origin to backend
    });

    setIsSubmitted(true);
    toast.success('Password reset email sent successfully!');
  } catch (err) {
    setError(
      err.response?.data?.message || 'Failed to send reset email. Please try again.'
    );
    toast.error(err.response?.data?.message || 'Error sending reset email');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-8">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 mt-2">
            {isSubmitted 
              ? "Check your email for reset instructions" 
              : "Enter your email to reset your password"}
          </p>
        </div>

        {error && !isSubmitted && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Email Address"
                  required
                />
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-gray-600">
              We've sent password reset instructions to your email
            </p>
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              className="mt-6 py-2 px-6 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Resend Email
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;