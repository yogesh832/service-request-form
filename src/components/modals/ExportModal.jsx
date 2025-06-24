// components/ExportModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { FaFilePdf, FaFileExcel, FaTimes, FaFileAlt } from 'react-icons/fa';
import api from '../../utils/api'; // Your pre-configured axios instance
import { toast } from 'react-toastify';

const ExportModal = ({ onClose }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);

  // Fetch preview data in JSON (no file download)
  // const fetchPreview = async (resource) => {
  //   if (!dateRange.start || !dateRange.end) {
  //     toast.error('Please select both start and end dates for preview');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setPreviewResource(resource);

  //     const params = new URLSearchParams({
  //       startDate: dateRange.start,
  //       endDate: dateRange.end,
  //       preview: 'true',
  //     }).toString();

  //     const response = await api.get(`/export/${resource}/json?${params}`);
  //     setPreviewData(response.data.data || []);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || error.message || 'Failed to fetch preview');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleExport = async (resource, format) => {
    if (!dateRange.start || !dateRange.end) {
      toast.error('Please select both start and end dates before exporting');
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
      }).toString();

      const response = await api.get(`/export/${resource}/${format}?${params}`, {
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${resource}_export.${format}`;

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success('Export successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Export Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-6">
          {['users', 'tickets', 'companies'].map((resource) => (
            <div key={resource}>
              <h3 className="text-lg font-semibold capitalize mb-2">{resource} Data</h3>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleExport(resource, 'excel')}
                  disabled={loading}
                >
                  <FaFileExcel className="text-green-600 mr-2" /> Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport(resource, 'pdf')}
                  disabled={loading}
                >
                  <FaFilePdf className="text-red-600 mr-2" /> PDF
                </Button>
                {/* <Button
                  variant="outline"
                  onClick={() => fetchPreview(resource)}
                  disabled={loading}
                >
                  <FaFileAlt className="mr-2" /> Preview
                </Button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Preview Table */}
        {previewData && previewResource && (
          <div className="mt-8 overflow-auto max-h-96 border border-gray-200 rounded p-4 bg-gray-50">
            <h4 className="text-lg font-semibold mb-4">
              Preview: {previewResource.charAt(0).toUpperCase() + previewResource.slice(1)} Data
            </h4>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-3 py-1 text-left text-sm font-semibold"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                  >
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="border border-gray-300 px-3 py-1 text-sm"
                      >
                        {val ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExportModal;
