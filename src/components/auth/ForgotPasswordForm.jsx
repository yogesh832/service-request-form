import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate password reset
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  return (
     <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-8">    <div className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100">
      <div className="text-center mb-8">
        <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <FaEnvelope className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Reset Password 🔒</h2>
        <p className="text-gray-500 mt-2">
          {isSubmitted 
            ? "Check your email for reset instructions" 
            : "Enter your email to reset your password"}
        </p>
      </div>

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
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Send Reset Link
          </button>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <p className="text-gray-600">
            We've sent password reset instructions to your email
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
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
    </div></section>

  );
};
export default ForgotPasswordForm;