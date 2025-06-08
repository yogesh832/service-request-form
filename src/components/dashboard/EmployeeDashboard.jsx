import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import TicketList from '../tickets/TicketList';
import Card from '../ui/Card';
import TicketStats from '../tickets/TicketStats';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const [filter, setFilter] = useState('assigned');
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard 👷</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here are your assigned tickets</p>
      </div>

      <TicketStats />

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
          filter={filter} 
          showAssignButton={false}
        />
      </Card>
    </div>
  );
};