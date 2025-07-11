import { useState, useEffect } from 'react';
import { FaSearch, FaUserAlt, FaEdit, FaTrash, FaFilter, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        setUsers(res.data.data.users);
        setFilteredUsers(res.data.data.users);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch users');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.toLowerCase().includes(term))
      );
    }
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveUser = async (userId) => {
    try {
      if (!editForm.name || !editForm.email) {
        toast.error('Name and email are required');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      await api.patch(`/users/${userId}`, editForm);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, ...editForm } : user
        )
      );
      toast.success('User updated successfully');
      setEditingUserId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
      console.error('Update error:', err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      console.error('Delete error:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 py-2 px-4 rounded-lg border bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute right-3 top-3 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-2 px-4 pr-10 rounded-lg border bg-gray-50 appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
        <button
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200"
          onClick={() => {
            setSearchTerm('');
            setRoleFilter('all');
          }}
        >
          Clear Filters
        </button>
      </div>
   {editingUserId && (
        <div className="mt-8 p-6 my-4 border rounded-xl bg-gray-50 shadow-inner">
          <h3 className="text-lg font-semibold mb-4">Edit User</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Name"
              className="py-2 px-4 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              placeholder="Email"
              className="py-2 px-4 border rounded-lg"
            />
            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              placeholder="Phone"
              className="py-2 px-4 border rounded-lg"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => saveUser(editingUserId)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaSave className="inline mr-2" />
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                editingUserId === user._id ? null : (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                            <FaUserAlt className="text-gray-400" />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user._id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone || 'No phone'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}

   
    </div>
  );
};

export default UserManagementPage;
