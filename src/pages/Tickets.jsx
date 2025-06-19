import { useState ,useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import TicketForm from '../components/tickets/TicketForm';
import TicketList from '../components/tickets/TicketList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

import api from '../utils/api';
import AssignTicketModal from '../components/modals/AssignTicketModal';
import { toast } from 'react-toastify';
const Tickets = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [employees, setEmployees] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
        const response = await api.get('/tickets');
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
  
  // Handle ticket assignment
  const handleAssign = async (ticketId, employeeId) => {
    try {
      await api.patch(`/tickets/${ticketId}/assign`, { 
        assignedTo: employeeId 
      });
      
      setTickets(prev =>
        prev.map(ticket =>
          ticket._id === ticketId 
            ? { 
                ...ticket, 
                assignedTo: employees.find(e => e._id === employeeId) 
              } 
            : ticket
        )
      );
      toast.success('Ticket assigned successfully')
      setShowAssignModal(false);
    } catch (error) {
      console.error('Assignment failed:', error);
      toast.error(error.response?.data?.message || 'Assignment failed');
      setError(error.response?.data?.message || 'Assignment failed');
    }
  };
   // Fetch employees for a specific ticket
  const fetchEmployeesForTicket = async (ticketId) => {
    try {
      // console.log('Fetching employees for ticket:', ticketId);
      const res = await api.get(`/tickets/${ticketId}/employees`);
      setEmployees(res.data.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Handle assign button click
  const handleAssignClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    // console.log('Assigning ticket:', ticketId);

    fetchEmployeesForTicket(ticketId);
    setShowAssignModal(true);
  };



  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
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
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tickets 🎫</h1>
          <p className="text-gray-600">Manage all your support requests in one place</p>
        </div>
        
        {user?.role === 'client' && (
          <Button 
            onClick={() => setShowTicketForm(true)}
            className="flex items-center gap-2"
          >
            <FaPlus /> New Ticket
          </Button>
        )}
      </div>

      <Card className="p-0">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">All Tickets</h2>
      <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-sm font-medium">
  {filteredTickets.length}
</span>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search tickets..."
                className="pl-10 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="py-2 px-4 pr-8 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
     <TicketList
          tickets={filteredTickets}
          currentUser={currentUser}
          onAssignClick={handleAssignClick}
        />
      </Card>

      {showTicketForm && (
        <TicketForm onClose={() => setShowTicketForm(false)} />
      )}

     {showAssignModal && selectedTicketId && (
        <AssignTicketModal
          ticket={tickets.find(t => t._id === selectedTicketId)}
          employees={employees}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}
      
    </div>
  );
};
export default Tickets;