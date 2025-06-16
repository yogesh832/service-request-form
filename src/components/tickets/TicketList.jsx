import { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaExclamationTriangle, FaUserPlus } from 'react-icons/fa';
import TicketItem from './TicketItem';
import api from '../../utils/api';

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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
        const response = await api.get('/tickets');
        console.log('Fetched tickets:', response.data.data.tickets);
        setTickets(response.data.data.tickets);
      } catch (err) {
        setError('Failed to load tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'assigned') return ticket.assignedTo === user?._id;
    if (filter !== 'all') return ticket.status === filter;
    return true;
  });
console.log('Filtered tickets:', filteredTickets);
  // Group tickets by company name (string key)
  const ticketsByCompany = filteredTickets.reduce((groups, ticket) => {
    const companyName = ticket.company?.name || 'Unknown Company';
    if (!groups[companyName]) groups[companyName] = [];
    groups[companyName].push(ticket);
    return groups;
  }, {});
console.log('Tickets grouped by company:', ticketsByCompany);
  if (loading) return (
    <div className="py-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-gray-600 mt-4">Loading tickets...</p>
    </div>
  );

  if (error) return (
    <div className="py-12 text-center text-red-500">
      {error}
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        Retry
      </button>
    </div>
  );

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

export default TicketList;
