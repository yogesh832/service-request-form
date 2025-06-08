import { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaFileExport } from 'react-icons/fa';
import AssignTicketModal from '../modals/AssignTicketModal';
import ExportModal from '../modals/ExportModal';
import TicketList from '../tickets/TicketList';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TicketStats from '../tickets/TicketStats';
import BarChart from '../ui/Charts/BarChart';
import PieChart from '../ui/Charts/PieChart';
import { useTickets } from '../../context/TicketContext';

const AdminDashboard = () => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const { tickets, updateTicket } = useTickets();

  const handleAssign = (ticketId, employeeId) => {
    updateTicket(ticketId, { assignedTo: employeeId });
  };

  const statsData = [
    { name: 'Open', value: tickets.filter(t => t.status === 'open').length },
    { name: 'Pending', value: tickets.filter(t => t.status === 'pending').length },
    { name: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length }
  ];

  const companyStats = tickets.reduce((acc, ticket) => {
    acc[ticket.company] = (acc[ticket.company] || 0) + 1;
    return acc;
  }, {});

  const companyData = Object.entries(companyStats).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard 👑</h1>
          <p className="text-gray-600">Manage all support tickets and assignments</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950"
          >
            <FaFileExport /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TicketStats />
        </div>
        <Card className="p-5 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <div className="h-64 w-full">
            <PieChart data={statsData} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">Tickets by Company</h3>
          <div className="h-64">
            <BarChart data={companyData} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {tickets.slice(0, 4).map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{ticket.title}</h4>
                  <p className="text-sm text-gray-500">{ticket.company} • {ticket.status}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">All Tickets 📋</h2>
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
          filter={filter} 
          onAssignClick={(ticket) => {
            setSelectedTicket(ticket);
            setShowAssignModal(true);
          }}
        />
      </Card>

      {showAssignModal && selectedTicket && (
        <AssignTicketModal 
          ticket={selectedTicket}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}

      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)}
          onExport={(format) => {
            alert(`Exporting data as ${format.toUpperCase()}...`);
          }}
        />
      )}
    </div>
  );
};
export default AdminDashboard;