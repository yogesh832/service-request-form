import { FaFilePdf, FaFileCsv, FaTimes } from 'react-icons/fa';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useState } from 'react';

const ExportModal = ({ onClose, onExport }) => {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const handleExport = () => {
    onExport(format);
    onClose();
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-colors ${
                  format === 'csv' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FaFileCsv className="text-blue-500 text-2xl mb-2" />
                <span>CSV Format</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-colors ${
                  format === 'pdf' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FaFilePdf className="text-red-500 text-2xl mb-2" />
                <span>PDF Format</span>
              </button>
            </div>
          </div>
          
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
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ExportModal;