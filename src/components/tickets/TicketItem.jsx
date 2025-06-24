import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperclip, FaDownload } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';
import api from '../../utils/api';

const TicketItem = ({ ticket, currentUser, onStatusChange, onAssignClick }) => {
  const [status, setStatus] = useState(ticket.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

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

  const renderUserCard = (user, label) => {
    if (!user) return null;
    const fallbackLetter = user.name?.charAt(0).toUpperCase() || '?';

    return (
      <div className="flex items-center gap-3 mt-3">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
            {fallbackLetter}
          </div>
        )}
        <div className="text-sm">
          <p className="font-semibold">{label}: {user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm mb-4">
      {/* Header: Subject + Priority */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{ticket.description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {ticket.priority}
        </span>
      </div>

      {/* Metadata: ticket no, date, attachments */}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
        <div className="flex items-center gap-3">
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
      </div>

      {/* Creator Info (for admin & employee) */}
      {(userRole === 'admin' || userRole === 'employee') && ticket.user && (
        renderUserCard(ticket.user, 'User')
      )}

      {/* Assigned Employee Info (only for admin) */}
      {userRole === 'admin' && ticket.assignedTo && renderUserCard(ticket.assignedTo, 'Assigned To')}

      {/* Status Dropdown (admin + employee) */}
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

      {/* Attachments Download */}
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

      {/* Admin: Assign button */}
      {!ticket.assignedTo && userRole === 'admin' && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onAssignClick(ticket._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Assign Ticket
          </button>
        </div>
      )}

      {/* View Full Ticket Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate(`/tickets/${ticket._id}`)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          View Full Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketItem;
