import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Clients from './pages/Clients';
import AdminAnalytics from './components/dashboard/AdminAnalytics';
import ClientAnalytics from './components/dashboard/ClientAnalytics';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PrivateRoute component
const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      {/* ToastContainer should be here once at top-level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={
            <PrivateRoute roles={['admin', 'employee', 'client']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="tickets" element={
            <PrivateRoute roles={['employee', 'client', 'admin']}>
              <Tickets />
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute roles={['admin', 'employee', 'client']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="analytics" element={
            <PrivateRoute roles={['admin' , 'employee']}>
              <AnalyticsPage />
            </PrivateRoute>
          } />
          <Route path="admin-analytics" element={
            <PrivateRoute roles={['admin']}>
              <AdminAnalytics />
            </PrivateRoute>
          } />
          <Route path="client-analytics" element={
            <PrivateRoute roles={['admin', 'client', 'employee']}>
              <ClientAnalytics />
            </PrivateRoute>
          } />
          <Route path="clients" element={
            <PrivateRoute roles={['admin']}>
              <Clients />
            </PrivateRoute>
          } />
          <Route path="settings" element={
            <PrivateRoute roles={['admin']}>
              <SettingsPage />
            </PrivateRoute>
          } />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
