import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2023 SupportHub. All rights reserved.
            </p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;