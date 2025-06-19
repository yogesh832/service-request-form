import { FaBell, FaUserCircle, FaSearch, FaBars } from 'react-icons/fa';
import Notification from './Notification';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let parsedUser = null;
    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    console.log('User data loaded:', parsedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FaBars size={20} />
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 py-2 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <FaBell className="text-gray-600" size={18} />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            {showNotifications && (
              <Notification onClose={() => setShowNotifications(false)} />
            )}
          </div>
          
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="relative group">
                {user.profilePhoto ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
               
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute right-0 top-6 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block z-50">
                  <button 
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;