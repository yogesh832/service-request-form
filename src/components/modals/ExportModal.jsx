import { FaFilePdf, FaFileCsv, FaTimes, FaFileExcel, FaUsers, FaTicketAlt } from 'react-icons/fa';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'; // If using Redux

const ExportModal = ({ onClose }) => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Get token from Redux or localStorage
  const { userToken } = useSelector(state => state.auth) || {};
  const token = userToken || localStorage.getItem('token');

  const handleExport = async (resource, format) => {
    try {
      setLoading(true);
      
      // Construct query parameters
      const params = new URLSearchParams();
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);
      
      // Create Axios instance with credentials
      const api = axios.create({
        baseURL:  'https://localhost:5000', // Use environment variable if set
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      const url = `/api/export/${resource}/${format}?${params.toString()}`;
      
      // Make API request
      const response = await api.get(url, {
        responseType: 'blob', // Important for file downloads
      });
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${resource}_export.${format}`;
      
      // Create download link
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success(`Export completed successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Export failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Export Data</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
          
          {/* User Data Export */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaUsers className="text-blue-500" />
              <h4 className="text-lg font-medium text-gray-800">User Data</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleExport('users', 'excel')}
                variant="outline"
                className="flex items-center gap-2 justify-center"
                disabled={loading}
              >
                <FaFileExcel className="text-green-600" />
                <span>Excel</span>
              </Button>
              <Button
                type="button"
                onClick={() => handleExport('users', 'pdf')}
                variant="outline"
                className="flex items-center gap-2 justify-center"
                disabled={loading}
              >
                <FaFilePdf className="text-red-500" />
                <span>PDF</span>
              </Button>
            </div>
          </div>
          
          {/* Ticket Data Export */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaTicketAlt className="text-purple-500" />
              <h4 className="text-lg font-medium text-gray-800">Ticket Data</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleExport('tickets', 'excel')}
                variant="outline"
                className="flex items-center gap-2 justify-center"
                disabled={loading}
              >
                <FaFileExcel className="text-green-600" />
                <span>Excel</span>
              </Button>
              <Button
                type="button"
                onClick={() => handleExport('tickets', 'pdf')}
                variant="outline"
                className="flex items-center gap-2 justify-center"
                disabled={loading}
              >
                <FaFilePdf className="text-red-500" />
                <span>PDF</span>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;