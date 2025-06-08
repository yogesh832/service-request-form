import { FaUser, FaEnvelope, FaBuilding, FaGlobe, FaBell, FaLock, FaShieldAlt } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
const SettingsPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: true
  });
  
  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings ⚙️</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-blue-100">{user?.email}</p>
              <p className="text-blue-100 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{user?.company}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FaLock className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Password</p>
                      <p className="font-medium">••••••••</p>
                    </div>
                  </div>
                  <Button variant="secondary">Change</Button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Two-Factor Auth</p>
                      <p className="font-medium">Disabled</p>
                    </div>
                  </div>
                  <Button variant="secondary">Enable</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Preferences</h2>
        </div>
        <div className="p-5">
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <FaGlobe className="text-gray-500" /> Language & Region
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Language</label>
                <select className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Timezone</label>
                <select className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition">
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT-06:00) Central Time</option>
                  <option>(GMT-07:00) Mountain Time</option>
                  <option>(GMT-08:00) Pacific Time</option>
                  <option>(GMT-00:00) UTC</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <FaBell className="text-gray-500" /> Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <span className={`absolute inset-0 rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></span>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    notifications.email ? 'transform translate-x-6' : ''
                  }`}></span>
                </div>
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get instant alerts on your device</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  <span className={`absolute inset-0 rounded-full transition-colors ${
                    notifications.push ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></span>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    notifications.push ? 'transform translate-x-6' : ''
                  }`}></span>
                </div>
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-gray-600">Summary of your support activity</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0"
                    checked={notifications.weeklyReport}
                    onChange={() => handleNotificationChange('weeklyReport')}
                  />
                  <span className={`absolute inset-0 rounded-full transition-colors ${
                    notifications.weeklyReport ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></span>
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    notifications.weeklyReport ? 'transform translate-x-6' : ''
                  }`}></span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Danger Zone</h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-800">Delete Account</h3>
              <p className="text-sm text-gray-600">
                Permanently remove your account and all associated data
              </p>
            </div>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;