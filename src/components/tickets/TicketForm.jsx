import { useState, useRef ,useEffect } from 'react';
import { FaTimes, FaPaperclip, FaTrash, FaChevronDown } from 'react-icons/fa';
import api from '../../utils/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

// Phone validation regex
const PHONE_REGEX = /^\+\d{1,4}\d{7,14}$/;

// Country code options with flags
const COUNTRY_CODES = [

  { code: '+91', flag: '🇮🇳' },
 
  // Add more countries as needed
];

const TicketForm = ({ onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    phone: '',
    countryCode: '+91', // Default country code
    phoneNumber: '',
    category: 'technical',
    priority: 'medium',
    description: '',
  });
  
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showSuccess, setShowSuccess] = useState(true);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const countryDropdownRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate phone number in real-time
    if (name === 'phoneNumber') {
      validatePhoneNumber(value);
    }
  };

  // Handle country code selection
  const selectCountryCode = (code) => {
    setFormData(prev => ({ ...prev, countryCode: code }));
    setIsCountryDropdownOpen(false);
    validatePhoneNumber(formData.phoneNumber);
  };

  // Phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    const fullPhone = `${formData.countryCode}${phoneNumber}`;
    
    if (phoneNumber && !PHONE_REGEX.test(fullPhone)) {
      setPhoneError('Please enter a valid phone number (e.g., 9876543210)');
    } else {
      setPhoneError('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle file attachments
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    URL.revokeObjectURL(newAttachments[index].preview);
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Combine country code and phone number
    const fullPhone = `${formData.countryCode}${formData.phoneNumber}`;
    
    // Final validation before submission
    if (formData.phoneNumber && !PHONE_REGEX.test(fullPhone)) {
      setPhoneError('Please enter a valid phone number');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append regular form data
const origin = window.location.origin;
formDataToSend.append('subject', formData.subject);
formDataToSend.append('phone', fullPhone);
formDataToSend.append('category', formData.category);
formDataToSend.append('priority', formData.priority);
formDataToSend.append('description', formData.description);
formDataToSend.append('origin', origin); // ✅ Send origin

      // Append files if any
      attachments.forEach((attachment, index) => {
        formDataToSend.append(`attachments`, attachment.file);
      });

      const response = await api.post('/tickets', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowSuccess(true);
      // setTimeout(() => {
      //   setShowSuccess(false);
      //   // onTicketCreated(response.data.data.ticket);
      //   // onClose();
      // }, 3000);
      toast.success('Ticket created successfully!');
      setFormData({
    subject: '',
    phone: '',
    countryCode: '+91', // Default country code
    phoneNumber: '',
    category: 'technical',
    priority: 'medium',
    description: '',
  })
    } catch (err) {
  const errorMessage = err.response?.data?.message || 'Failed to create ticket';

  if (errorMessage.toLowerCase().includes('phone') || 
      errorMessage.toLowerCase().includes('number')) {
    setPhoneError(errorMessage);
  } else {
    setError(errorMessage);
  }

  console.error('Error creating ticket:', err);
  toast.error(errorMessage);
}
finally {
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

        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">We Will Revert You Soon</h3>
              <p>Your ticket has been submitted successfully.</p>
                      <button
  onClick={() => setShowSuccess(false)}
  className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
>
  OK
</button>
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
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <span>{formData.countryCode}</span>
                    <FaChevronDown className={`transition-transform ${isCountryDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                      {COUNTRY_CODES.map((country) => (
                        <div
                          key={country.code}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => selectCountryCode(country.code)}
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-auto text-gray-500">{country.code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`flex-[3] py-2 px-3 rounded-lg bg-gray-50 border ${
                    phoneError ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="Enter your number"
                />
              </div>
              {phoneError ? (
                <p className="mt-1 text-sm text-red-600">
                  {phoneError}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Full number: {formData.countryCode}{formData.phoneNumber || '______'}
                </p>
              )}
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
                <option value="other">Other Complaint</option>
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
              <div className="flex flex-col gap-2">
                <div 
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaPaperclip className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      multiple
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </div>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center truncate">
                          <span className="truncate">{attachment.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              disabled={isSubmitting || phoneError}
              className={`px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-70 flex items-center ${
                phoneError ? 'cursor-not-allowed' : ''
              }`}
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