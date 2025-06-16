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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {user.role === 'admin' ? <AdminAnalytics /> : <ClientAnalytics />}
    </div>
  );
};

export default AnalyticsPage;
