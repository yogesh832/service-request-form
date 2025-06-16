import { useState } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import TicketForm from '../components/tickets/TicketForm';
import TicketList from '../components/tickets/TicketList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

import { de } from 'date-fns/locale';

const Tickets = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const user = useState(JSON.parse(localStorage.getItem('user')));
 

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
              24
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
        <TicketList filter={filter} />
      </Card>

      {showTicketForm && (
        <TicketForm onClose={() => setShowTicketForm(false)} />
      )}
    </div>
  );
};
export default Tickets;