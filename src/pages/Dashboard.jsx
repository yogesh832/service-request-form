import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      case 'client':
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;