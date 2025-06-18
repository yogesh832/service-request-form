import { useState } from 'react';
import { FaCircle, FaPaperclip, FaUser, FaDownload } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';
import api from '../../utils/api';

const TicketItem = ({ ticket, currentUser, onStatusChange, onAssignClick }) => {
  const [status, setStatus] = useState(ticket.status);
  
  const [isUpdating, setIsUpdating] = useState(false);

const userData = JSON.parse(localStorage.getItem('user'));
const userRole = userData?.role;

  const isAssignedEmployee = userRole === 'admin' || userRole === 'employee';

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setIsUpdating(true);
      await api.patch(`/tickets/${ticket._id}/status`, { status: newStatus });
      setStatus(newStatus);
      onStatusChange?.(ticket._id, newStatus);
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {ticket.description}
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {ticket.priority}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{ticket.ticketNumber}</span>
          <span>•</span>
          <span>{formatDate(ticket.createdAt)}</span>
          
          {ticket.attachments?.length > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaPaperclip size={12} /> {ticket.attachments.length}
              </span>
            </>
          )}
        </div>
        
        {ticket.assignedTo && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaUser size={12} className="text-gray-400" />
            <span>Assigned</span>
          </div>
        )}

        
      </div>
      
      {ticket.assignedTo && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
          <div>
            <p className="font-medium">{ticket.assignedTo.name}</p>
            {ticket.assignedTo.phone && (
              <p className="text-gray-500">{ticket.assignedTo.phone}</p>
            )}
          </div>
        </div>
      )}
      
{isAssignedEmployee && (
  <div className="mt-3">
    <select 
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating || (userRole === 'employee' && status === 'resolved')}
      className={`w-full py-2 px-3 rounded-lg border ${
        isUpdating || (userRole === 'employee' && status === 'resolved')
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-white'
      }`}
    >
      <option value="open">Open</option>
      <option value="pending">Pending</option>
      <option value="resolved">Resolved</option>
    </select>

    {isUpdating && <p className="text-xs text-gray-500 mt-1">Updating...</p>}

    {userRole === 'employee' && status === 'resolved' && (
      <p className="text-xs text-red-500 mt-1">Resolved ticket cannot be changed.</p>
    )}
  </div>
)}


      
      {ticket.attachments?.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Attachments:</p>
          <div className="flex flex-wrap gap-2">
            {ticket.attachments.map((file, index) => (
              <a 
                key={index}
                href={file.path}
                download
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <FaDownload size={12} /> {file.originalname}
              </a>
            ))}
          </div>
        </div>
      )}
      

      {/* Assign button (only show if ticket isn't assigned and user is admin) */}
      {!ticket.assignedTo && currentUser?.role === 'admin' && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onAssignClick(ticket._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Assign Ticket
          </button>
        </div>
      )}

    </div>
  );
};

export default TicketItem;