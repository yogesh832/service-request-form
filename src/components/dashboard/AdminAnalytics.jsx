// src/components/admin/AdminAnalytics.jsx
import { useState, useEffect } from 'react';
import { 
  FaTicketAlt, 
  FaUserClock, 
  FaChartPie, 
  FaBuilding,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import Card from '../ui/Card';
import BarChart from '../ui/Charts/BarChart';
import PieChart from '../ui/Charts/PieChart';
import api from '../../utils/api';
import Spinner from '../ui/Spinner';

const AdminAnalytics = () => {
  const [tickets, setTickets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [priorityResolution, setPriorityResolution] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For employee performance table
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'resolvedTickets',
    direction: 'descending'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [ticketsRes, companiesRes, priorityRes, performanceRes] = await Promise.all([
          api.get('/tickets'),
          api.get('/companies'),
          api.get('/analytics/priority-resolution-times'),
          api.get('/analytics/employee-performance')
        ]);

        setTickets(ticketsRes.data.data.tickets);
        setCompanies(companiesRes.data.data.companies);
        setPriorityResolution(priorityRes.data.data);
        setEmployeePerformance(performanceRes.data.data);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    value: tickets.filter(t => t.company?.name === company.name).length
  }));

  // Handle sorting for employee performance table
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort employee performance data
  const getSortedEmployees = () => {
    const sortableItems = [...employeePerformance];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Apply search filter
    return sortableItems.filter(emp => {
      if (statusFilter !== 'all' && emp.status !== statusFilter) {
        return false;
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          emp.name.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          (emp.phone && emp.phone.toLowerCase().includes(term))
        );
      }
      
      return true;
    });
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const badgeStyles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    const priorityText = {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[priority]}`}>
        {priorityText[priority]}
      </span>
    );
  };

  // Get sort indicator
  const getSortIndicator = (columnName) => {
    if (!sortConfig.key) return <FaSort className="text-gray-400" />;
    
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? 
        <FaSortUp className="text-blue-500" /> : 
        <FaSortDown className="text-blue-500" />;
    }
    
    return <FaSort className="text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FaChartPie className="text-red-500 text-2xl" />
        </div>
        <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
                {priorityResolution.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getPriorityBadge(item.priority)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.averageTime.toFixed(1)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.minTime.toFixed(1)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.maxTime.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Employee Performance</h2>
          
          {/* Filters for employee performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 w-full py-2 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-4 pr-8 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="on leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Employee</span>
                      <span className="ml-1">{getSortIndicator('name')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('assignedTickets')}
                  >
                    <div className="flex items-center">
                      <span>Assigned</span>
                      <span className="ml-1">{getSortIndicator('assignedTickets')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('resolvedTickets')}
                  >
                    <div className="flex items-center">
                      <span>Resolved</span>
                      <span className="ml-1">{getSortIndicator('resolvedTickets')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('averageResolutionTime')}
                  >
                    <div className="flex items-center">
                      <span>Avg. Time</span>
                      <span className="ml-1">{getSortIndicator('averageResolutionTime')}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedEmployees().map(emp => (
                  <tr key={emp.employeeId} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {emp.profilePhoto ? (
                          <img 
                            src={emp.profilePhoto} 
                            alt={emp.name} 
                            className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {emp.assignedTickets}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {emp.resolvedTickets}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {emp.averageResolutionTime.toFixed(1)}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {getSortedEmployees().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No employees found matching your criteria
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;