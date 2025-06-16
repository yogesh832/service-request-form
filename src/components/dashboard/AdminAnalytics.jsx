import { FaTicketAlt, FaUserClock, FaChartPie, FaBuilding } from 'react-icons/fa';
import Card from '../ui/Card';
import BarChart from '../ui/Charts/BarChart';
import PieChart from '../ui/Charts/PieChart';
import{ useState ,useEffect } from 'react';
import api from '../../utils/api'; // Ensure you have an API utility to fetch data
const AdminAnalytics = () => {
  const [tickets, setTickets] = useState([]);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/tickets');
      const tickets = response.data.data.tickets;
      setTickets(tickets);
    };

  fetchData();
}, []);
useEffect(() => {
  const fetchCompanies = async () => {
    const response = await api.get('/companies');
    const companies = response.data.data.companies;
    setCompanies(companies);
  };
  fetchCompanies();
}, []);
    // Calculate statistics
    const ticketStats = {
      open: tickets.filter(t => t.status === 'open').length,
      pending: tickets.filter(t => t.status === 'pending').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      total: tickets.length,
      unassigned: tickets.filter(t => !t.assignedTo).length
    };
  // Ticket status distribution
  const statusData = [
    { name: 'Open', value: ticketStats.open },
    { name: 'Pending', value: ticketStats.pending },
    { name: 'Resolved', value: ticketStats.resolved }
  ];
  
  // Tickets by company
  const companyData = companies.map(company => ({
    name: company.name,
    value: tickets.filter(t => t.company === company.name).length
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Analytics 📈</h1>
        <p className="text-gray-600">Global support performance metrics</p>
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
        
        <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unassigned</p>
              <p className="text-2xl font-bold text-gray-800">{ticketStats.unassigned}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <FaUserClock />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-800">{ticketStats.resolved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <FaChartPie />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-gray-800">{companies.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <FaBuilding />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Ticket Status Distribution</h2>
          <div className="h-64">
            <PieChart data={statusData} />
          </div>
        </Card>
        
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Tickets by Company</h2>
          <div className="h-64">
            <BarChart data={companyData} />
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Resolution Time by Priority</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">8.2</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">1.5</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">24.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">24.5</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">5.0</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">72.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Low</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">48.8</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">12.0</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">120.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Employee Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mike Employee</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">18</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">12.4h</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">David Employee</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">22</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">19</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">10.8h</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sarah Admin</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">8</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">7</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">9.2h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;

