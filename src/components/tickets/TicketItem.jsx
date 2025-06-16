import { FaCircle, FaPaperclip, FaUser } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const TicketItem = ({ ticket }) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{ticket.subject}</h3> {/* subject use karo title ki jagah */}
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {ticket.description}
          </p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {ticket.priority}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{ticket?.ticketNumber}</span>  {/* id => _id */}
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
    </div>
  );
};

export default TicketItem;
