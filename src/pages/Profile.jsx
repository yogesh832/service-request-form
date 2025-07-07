import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaSave } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { toast } from 'react-toastify';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    profilePhoto: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/me`);
        const user = response.data.data.user;

        localStorage.setItem('user', JSON.stringify(user));

        setProfileData({
          ...user,
          phone: user.phone?.startsWith('+91') ? user.phone.slice(3) : user.phone
        });

        if (user.profilePhoto) {
          setFilePreview(user.profilePhoto);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('❌ Only JPG, PNG or WEBP images are allowed');
      return;
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`❌ Image must be less than or equal to ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const isNumeric = /^[0-9]*$/.test(value);
      if (!isNumeric) return;
      setErrors((prev) => ({ ...prev, phone: '' }));
    }

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let phone = profileData.phone?.trim() || '';
    if (phone.startsWith('+91')) phone = phone.slice(3);

    if (phone && phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      if (phone) formData.append('phone', `+91${phone}`);
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }

      const response = await api.patch(`/users/me`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfileData({
        ...response.data.data.user,
        phone: response.data.data.user.phone?.startsWith('+91')
          ? response.data.data.user.phone.slice(3)
          : response.data.data.user.phone,
      });

      if (response.data.data.user.profilePhoto) {
        setFilePreview(response.data.data.user.profilePhoto);
      }

      setSelectedFile(null);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-5">
            <div className="flex flex-col items-center">
              <div className="relative">
                {filePreview ? (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                    <img
                      src={filePreview}
                      alt="Profile"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {profileData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                    <FaCamera className="text-gray-700" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{profileData?.name}</h2>
              <p className="text-gray-600 capitalize">{profileData?.role}</p>
              <p className="text-sm text-gray-500 mt-1">
                {profileData?.company?.name || profileData?.company}
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="px-4 py-2">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setFilePreview(profileData.profilePhoto || '');
                      setErrors({});
                    }}
                    variant="secondary"
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="px-4 py-2 flex items-center gap-2">
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
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">+91</span>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={10}
                      className={`pl-10 w-full py-2.5 px-4 rounded-lg bg-gray-50 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
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
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
