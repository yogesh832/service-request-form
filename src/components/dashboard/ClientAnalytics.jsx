import { FaTicketAlt, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import Card from '../ui/Card';
import BarChart from '../ui/Charts/BarChart';

import { formatDate } from '../../utils/helpers';
import { useEffect ,useState } from 'react';
import api from '../../utils/api';
const ClientAnalytics = () => {
const [tickets, setTickets] = useState([]);

useEffect(() => {
  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data.data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };
  fetchTickets();
}, []);


  // Calculate statistics
  const ticketStats = {
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    total: tickets.length,
    avgResolution: 2.5 // Dummy data
  };
  
  // Resolution time data
  const resolutionData = [
    { name: 'Jan', value: 4.2 },
    { name: 'Feb', value: 3.8 },
    { name: 'Mar', value: 3.5 },
    { name: 'Apr', value: 3.1 },
    { name: 'May', value: 2.8 },
    { name: 'Jun', value: 2.5 }
  ];
  
  // Ticket priority distribution
  const priorityData = [
    { name: 'High', value: tickets.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tickets.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tickets.filter(t => t.priority === 'low').length }
  ];
  
  // Recent resolved tickets
  const recentResolved = tickets
    .filter(t => t.status === 'resolved')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics 📊</h1>
        <p className="text-gray-600">Track and analyze your support ticket performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-800">{ticketStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FaTicketAlt />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-800">{ticketStats.open}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <FaClock />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Tickets</p>
              <p className="text-2xl font-bold text-gray-800">{ticketStats.resolved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <FaCheckCircle />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Resolution</p>
              <p className="text-2xl font-bold text-gray-800">{ticketStats.avgResolution} days</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <FaChartLine />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Resolution Time Trend</h2>
          <div className="h-64">
            <BarChart data={resolutionData} />
          </div>
        </Card>
        
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Ticket Priority Distribution</h2>
          <div className="h-64">
            <BarChart data={priorityData} />
          </div>
        </Card>
      </div>
      
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-4">Recently Resolved Tickets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Resolved</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentResolved.map(ticket => (
                <tr key={ticket._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{ticket.id.slice(-6)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{ticket.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ClientAnalytics;