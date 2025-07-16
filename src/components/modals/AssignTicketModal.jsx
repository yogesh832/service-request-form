import { useState } from 'react';
import { FaTimes, FaUserCheck } from 'react-icons/fa';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AssignTicketModal = ({ ticket, employees, onClose, onAssign }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedEmployee) return;

  try {
    setIsSubmitting(true);

    const res = await api.patch(`/tickets/${ticket._id}/assign`, {
      assignedTo: selectedEmployee,
    });

    const { success, message } = res.data;

    // ✅ Handle backend success or failure manually
    if (success) {
      onAssign(ticket._id, selectedEmployee);
      toast.success(message || 'Ticket assigned successfully');
      setSelectedEmployee('');
      onClose();
    } else {
      setError(message || 'Assignment failed');
      toast.error(message || 'Assignment failed');
    }

  } catch (error) {
    const message = error.response?.data?.message || 'Assignment failed';
    setError(message);
    toast.error(message); // Only one toast here
    console.error('Ticket assignment failed:', error);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Ticket Number {ticket.ticketNumber}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee
            </label>
            <div className="space-y-3">
              {employees.map(employee => (
                <label 
                  key={employee._id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="employee"
                    value={employee._id}
                    checked={selectedEmployee === employee._id}
                    onChange={() => setSelectedEmployee(employee._id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedEmployee || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Assigning...' : (
                <>
                  <FaUserCheck /> Assign Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssignTicketModal;