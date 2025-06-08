// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context';
// import { TicketProvider } from './context/TicketContext';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Tickets from './pages/Tickets';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';
// import DashboardLayout from './layouts/DashboardLayout';
// import LoginForm from './components/auth/LoginForm';
// import SignupForm from './components/auth/SignupForm';
// import ForgotPasswordForm from './components/auth/ForgotPasswordForm';

// // Private route component
// const PrivateRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" replace />;
// };

// // Role-based route component
// const RoleRoute = ({ roles, children }) => {
//   const { user } = useAuth();
//   return user && roles.includes(user.role) ? children : <Navigate to="/" replace />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <TicketProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<LoginForm />} />
//             <Route path="/signup" element={<SignupForm />} />
//             <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            
//             <Route path="/dashboard" element={
//               <PrivateRoute>
//                 <DashboardLayout>
//                   <Dashboard />
//                 </DashboardLayout>
//               </PrivateRoute>
//             } />
            
//             <Route path="/tickets" element={
//               <PrivateRoute>
//                 <DashboardLayout>
//                   <Tickets />
//                 </DashboardLayout>
//               </PrivateRoute>
//             } />
            
//             <Route path="/profile" element={
//               <PrivateRoute>
//                 <DashboardLayout>
//                   <Profile />
//                 </DashboardLayout>
//               </PrivateRoute>
//             } />
            
//             <Route path="/admin" element={
//               <RoleRoute roles={['admin']}>
//                 <DashboardLayout>
//                   <Dashboard />
//                 </DashboardLayout>
//               </RoleRoute>
//             } />
            
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </TicketProvider>
//     </AuthProvider>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { TicketProvider } from './context/TicketContext';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Clients from './pages/Clients';


function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        {/* <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />

            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/tickets"
              element={
                <DashboardLayout>
                  <Tickets />
                </DashboardLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router> */}
        <Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupForm />} />
    <Route path="/forgot-password" element={<ForgotPasswordForm />} />

    {/* Dashboard layout as parent route */}
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} /> {/* default /dashboard */}
      <Route path="tickets" element={<Tickets />} />
      <Route path="profile" element={<Profile />} />
         <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="clients" element={<Clients />} />
      <Route path="settings" element={<SettingsPage />} />
      {/* you can add more nested routes here */}
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
</Router>

      </TicketProvider>
    </AuthProvider>
  );
}

export default App;
