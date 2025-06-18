
import { FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import TicketItem from './TicketItem';

const StatusIcon = ({ status }) => {
  const icons = {
    open: <FaExclamationTriangle className="text-red-500" />,
    pending: <FaClock className="text-yellow-500" />,
    resolved: <FaCheck className="text-green-500" />
  };
  
  return (
    <div className={`p-2 rounded-lg ${
      status === 'open' ? 'bg-red-100' : 
      status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'
    }`}>
      {icons[status]}
    </div>
  );
};

const TicketList = ({ tickets, currentUser, onAssignClick }) => {
  // Group tickets by company
  const ticketsByCompany = tickets.reduce((groups, ticket) => {
    const companyName = ticket.company?.name || 'Unknown Company';
    if (!groups[companyName]) groups[companyName] = [];
    groups[companyName].push(ticket);
    return groups;
  }, {});

  return (
    <div className="overflow-hidden">
      {Object.entries(ticketsByCompany).map(([companyName, companyTickets]) => (
        <div key={companyName} className="mb-6">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">{companyName}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {companyTickets.map(ticket => (
              <div key={ticket._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <StatusIcon status={ticket.status} />
                  <div className="flex-1">
                    <TicketItem 
                      ticket={ticket}
                      currentUser={currentUser}
                      onAssignClick={onAssignClick}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;