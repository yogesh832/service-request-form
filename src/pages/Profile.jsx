import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUser, FaEnvelope, FaBuilding, FaLock, FaSave } from 'react-icons/fa';
import Card from '../components/ui/Card';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));

      console.log('User from localStorage:', userData);

      const response = await api.get(`/users/me`);
      console.log('Fetched profile:', response.data.data.user);
      setProfileData(response.data.data.user);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/users/me`, profileData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  // Import missing icons and Card component

  // Add handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Use profileData instead of user
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile 👤</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-5">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {profileData?.name?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{profileData?.name}</h2>
              <p className="text-gray-600 capitalize">{profileData?.role}</p>
              <p className="text-sm text-gray-500 mt-1">{profileData?.company}</p>
            </div>
            
            <div className="mt-8 space-y-4">
              <button className="w-full py-2.5 px-4 text-left rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800">
                Account Settings
              </button>
              <button className="w-full py-2.5 px-4 text-left rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800">
                Notification Preferences
              </button>
              <button className="w-full py-2.5 px-4 text-left rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800">
                Billing Information
              </button>
              <button className="w-full py-2.5 px-4 text-left rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-red-600">
                Delete Account
              </button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="px-4 py-2 flex items-center gap-2"
                  >
                    <FaSave /> Save Changes
                  </Button>
                </div>
              )}
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10 w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10 w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10 w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="pl-10 w-full py-2.5 px-4 rounded-lg bg-gray-100 border border-gray-200"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={profileData.bio || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
                  placeholder="Tell us a little about yourself..."
                ></textarea>
              </div>
            </form>
          </Card>
          
          <Card className="p-5 mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Security</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">Password</h3>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                </div>
                <Button variant="secondary">Change Password</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="secondary">Enable 2FA</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Profile;