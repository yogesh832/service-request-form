import { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaSave, FaCamera, FaLock } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const VALID_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    profilePhoto: '',
    about: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const initialDataRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me');
        const user = data.data.user;
        
        setProfileData({
          name: user.name,
          email: user.email,
          company: user.company?.name || '',
          role: user.role,
          phone: user.phone || '',
          profilePhoto: user.profilePhoto || '',
          about: user.about || ''
        });
        
        setIsLoading(false);
      } catch {
        toast.error('Failed to load profile');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be under 3MB');
      return;
    }

    if (!VALID_FILE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please use JPG, PNG, GIF, or WEBP');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setPreviewImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {


      const { data } = await api.patch('/users/me', profileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
console.log(profileData)
      // Update only changed fields
      setProfileData(prev => ({
        ...prev,
        name: data.data.user.name,
        email: data.data.user.email,
        phone: data.data.user.phone || '',
        about: data.data.user.about || '',
        profilePhoto: data.data.user.profilePhoto || prev.profilePhoto
      }));
      
      setPreviewImage(null);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Update failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEdit = () => {
    initialDataRef.current = { ...profileData };
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData(initialDataRef.current);
    setPreviewImage(null);
    setIsEditing(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const ProfileImage = () => {
    const imageUrl = previewImage || profileData.profilePhoto;
    return imageUrl ? (
      <img
        src={imageUrl}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border shadow"
        onError={(e) => e.target.src = ''}
      />
    ) : (
      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl">
        {profileData.name?.[0]?.toUpperCase() || 'U'}
      </div>
    );
  };

  const InputField = ({ 
    id, 
    label, 
    icon, 
    required, 
    autoComplete, 
    ...props 
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          autoComplete={autoComplete}
          {...props}
          className={`pl-10 w-full py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            props.disabled ? 'bg-gray-50' : 'bg-white'
          }`}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
 <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile 👤</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-5">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <ProfileImage />
                {isEditing && (
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                    aria-label="Change profile photo"
                  >
                    <FaCamera className="text-gray-700 text-lg" />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={!isEditing}
                />
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 text-center">{profileData.name}</h2>
              <p className="text-gray-600 capitalize mt-1">{profileData.role}</p>
              <p className="text-sm text-gray-500 mt-1">{profileData.company}</p>
              
              {profileData.phone && (
                <div className="flex items-center mt-2 text-gray-600">
                  <FaPhone className="mr-2" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 space-y-3">
              <button className="w-full py-3 px-4 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-800 font-medium">
                Account Settings
              </button>
              <button className="w-full py-3 px-4 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-800 font-medium">
                Security Settings
              </button>
            </div>
          </Card>
        </div>
        
        {/* Main profile form */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
              
              {!isEditing ? (
                <Button onClick={handleEdit}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">🌀</span> Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FaSave /> Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="profile-name"
                  label="Full Name"
                  icon={<FaUser className="text-gray-400" />}
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                />
                
                <InputField
                  id="profile-email"
                  label="Email Address"
                  icon={<FaEnvelope className="text-gray-400" />}
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  autoComplete="email"
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="profile-company"
                  label="Company"
                  icon={<FaBuilding className="text-gray-400" />}
                  value={profileData.company}
                  disabled
                />
                
                <InputField
                  id="profile-phone"
                  label="Phone Number"
                  icon={<FaPhone className="text-gray-400" />}
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  autoComplete="tel"
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              
              <InputField
                id="profile-role"
                label="Role"
                icon={<FaLock className="text-gray-400" />}
                value={profileData.role}
                disabled
              />
              
              <div>
                <label htmlFor="profile-about" className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>
                <textarea
                  id="profile-about"
                  name="about"
                  value={profileData.about}
                  onChange={handleChange}
                  rows={4}
                  disabled={!isEditing}
                  className={`w-full py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  }`}
                  placeholder="Tell us a little about yourself..."
                />
              </div>
            </form>
          </Card>
          
          {/* Security section */}
          <Card className="p-5 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Security</h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">Password</h3>
                  <p className="text-sm text-gray-600 mt-1">Last changed 3 months ago</p>
                </div>
                <Button variant="secondary" className="w-full md:w-auto">
                  Change Password
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;