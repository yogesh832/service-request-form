import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Removed direct imports for lazy-loaded components to avoid redeclaration errors
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeSignup from './components/auth/EmployeeSignupFrom';
import MakeAdmin from './pages/MakeAdminPanel';
import ManageUsersPage from './pages/ManageUserPage';
import TicketDetail from './components/tickets/TicketDetail'
import ClientSignup from './components/auth/ClientSignup';
// Lazy imports
const Home = lazy(() => import('./pages/Home'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const SignupForm = lazy(() => import('./components/auth/SignupForm'));
const ForgotPasswordForm = lazy(() => import('./components/auth/ForgotPasswordForm'));
const ResetPasswordForm = lazy(() => import('./components/auth/ResetPasswordForm'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Profile = lazy(() => import('./pages/Profile'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const Clients = lazy(() => import('./pages/Clients'));
const AdminAnalytics = lazy(() => import('./components/dashboard/AdminAnalytics'));
const ClientAnalytics = lazy(() => import('./components/dashboard/ClientAnalytics'));

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
      {/* ToastContainer at top-level */}
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

      {/* Suspense to show fallback while lazy components load */}
      <Suspense fallback={      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />


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
                    <Route path="employee-signup" element={
            <PrivateRoute roles={['admin']}>
              <EmployeeSignup />
            </PrivateRoute>
          } />
                    <Route path="client-signup" element={
            <PrivateRoute roles={['admin']}>
              <ClientSignup />
            </PrivateRoute>
          } />
          <Route path="make-admin" element={
            <PrivateRoute roles={['admin']}>
              <MakeAdmin />
            </PrivateRoute>
          } />
                    <Route path="manage-user" element={
            <PrivateRoute roles={['admin']}>
              <ManageUsersPage />
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
      </Suspense>
    </Router>
  );
}

export default App;
