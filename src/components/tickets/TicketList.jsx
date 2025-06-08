import { useState } from 'react';
import { FaCheck, FaClock, FaExclamationTriangle, FaUserPlus } from 'react-icons/fa';
import TicketItem from './TicketItem';
import { useTickets, useAuth } from '../../context';


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

const TicketList = ({ filter = 'all', onAssignClick, showAssignButton = true }) => {
  const { tickets } = useTickets();
  const { user } = useAuth();
  
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'assigned') return ticket.assignedTo === user?.id;
    if (filter !== 'all') return ticket.status === filter;
    return true;
  });

  // Group tickets by company
  const ticketsByCompany = filteredTickets.reduce((groups, ticket) => {
    const company = ticket.company;
    if (!groups[company]) groups[company] = [];
    groups[company].push(ticket);
    return groups;
  }, {});

  return (
    <div className="overflow-hidden">
      {Object.entries(ticketsByCompany).map(([company, companyTickets]) => (
        <div key={company} className="mb-6">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">{company}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {companyTickets.map(ticket => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <StatusIcon status={ticket.status} />
                  <div className="flex-1">
                    <TicketItem ticket={ticket} />
                  </div>
                  {showAssignButton && !ticket.assignedTo && user?.role === 'admin' && (
                    <button 
                      onClick={() => onAssignClick?.(ticket)}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FaUserPlus /> Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {filteredTickets.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-600">No tickets found</h3>
          <p className="text-gray-500 mt-1">
            {filter === 'all' 
              ? "There are no tickets in the system" 
              : `There are no ${filter} tickets`}
          </p>
        </div>
      )}
    </div>
  );
};
export default  TicketList;