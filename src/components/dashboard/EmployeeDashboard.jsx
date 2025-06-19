import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import TicketList from '../tickets/TicketList';
import Card from '../ui/Card';
import TicketStats from '../tickets/TicketStats';
import api from '../../utils/api';

const EmployeeDashboard = () => {
  const [filter, setFilter] = useState('assigned');
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

  if (loading) return  <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard 👷</h1>
        <p className="text-gray-600">Welcome back! Here are your assigned tickets</p>
      </div>

      <TicketStats tickets={tickets} />

      <Card className="p-0">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Tickets 📋</h2>
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
                <option value="assigned">Assigned to Me</option>
                <option value="open">All Open</option>
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
          tickets={tickets}
          filter={filter}
          showAssignButton={false}
        />
      </Card>
    </div>
  );
};

export default EmployeeDashboard;