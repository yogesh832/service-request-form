import { FaTicketAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useTickets } from '../../context/TicketContext';
import Card from '../ui/Card';

const StatCard = ({ icon, title, value, color }) => (
  <Card className={`border-l-4 ${color} p-5 hover:shadow-md transition-shadow`}>
    <div className="flex items-center">
      <div className="mr-4 p-3 rounded-full bg-opacity-20 bg-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const TicketStats = () => {
  const { stats } = useTickets();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard 
        icon={<FaTicketAlt className="text-blue-500 text-xl" />}
        title="Total Tickets"
        value={stats.total}
        color="border-blue-500"
      />
      <StatCard 
        icon={<FaClock className="text-yellow-500 text-xl" />}
        title="Pending Tickets"
        value={stats.pending}
        color="border-yellow-500"
      />
      <StatCard 
        icon={<FaCheckCircle className="text-green-500 text-xl" />}
        title="Resolved Tickets"
        value={stats.resolved}
        color="border-green-500"
      />
    </div>
  );
};