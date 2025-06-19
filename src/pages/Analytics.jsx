import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ClientAnalytics from '../components/dashboard/ClientAnalytics';
import AdminAnalytics from '../components/dashboard/AdminAnalytics';

const AnalyticsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user'); // ya tumhara localStorage key jo bhi ho
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return  <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>;

  return (
    <div>
      {user.role === 'admin' ? <AdminAnalytics /> : <ClientAnalytics />}
    </div>
  );
};

export default AnalyticsPage;
