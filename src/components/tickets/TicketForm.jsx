import { useState } from 'react';
import { FaTimes, FaPaperclip } from 'react-icons/fa';
import api from '../../utils/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';    

const TicketForm = ({ onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    phone: '',
    category: 'technical',
    priority: 'medium',
    description: '',
    attachments: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // Add this state
const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
// Update handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');
  
  try {
    const response = await api.post('/tickets', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onTicketCreated(response.data.data.ticket);
      onClose();
    }, 3000);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create ticket');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Create New Ticket ✨</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        {/* // Add this component in return */}
{showSuccess && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">We Will Revert You Soon</h3>
      <p>Your ticket has been submitted successfully.</p>
    </div>
  </div>
)}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
                placeholder="Brief description of issue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
<input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder='Enter your mobile number'
/>

            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Inquiry</option>
                <option value="account">Account Support</option>
                <option value="delivery">Delivery Issue</option>
                <option value="general">Other Complaint</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <div className="flex space-x-4">
                {['low', 'medium', 'high'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={formData.priority === level}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium capitalize">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaPaperclip className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
              placeholder="Describe your issue in detail..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">🌀</span> Submitting...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default TicketForm;