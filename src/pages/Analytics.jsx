import DashboardLayout from '../layouts/DashboardLayout';
import ClientAnalytics from '../components/dashboard/ClientAnalytics';
import AdminAnalytics from '../components/dashboard/AdminAnalytics';
import { useAuth } from '../context/AuthContext';

const AnalyticsPage = () => {
  const { user } = useAuth();
  
  return (
  <div>
      {user?.role === 'admin' ? <AdminAnalytics /> : <ClientAnalytics />}
   </div>
  );
};

export default AnalyticsPage;