// src/components/admin/MakeAdminPanel.jsx
import { useState, useEffect, useCallback } from 'react';
import { 
  FaSearch, 
  FaUserAlt, 
  FaCrown, 
  FaUserTie, 
  FaUser, 
  FaBuilding,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const MakeAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    employee: 0,
    client: 0
  });
  const [companyMap, setCompanyMap] = useState({});

  // Fetch users with populated company data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRes = await api.get('/users');
      console.log('Fetched users:', usersRes.data.data.users);
      const fetchedUsers = usersRes.data.data.users;
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      
      // Calculate stats
      const adminCount = fetchedUsers.filter(u => u.role === 'admin').length;
      const employeeCount = fetchedUsers.filter(u => u.role === 'employee').length;
      const clientCount = fetchedUsers.filter(u => u.role === 'client').length;
      
      setStats({
        total: fetchedUsers.length,
        admin: adminCount,
        employee: employeeCount,
        client: clientCount
      });
      
      // Extract company IDs and fetch company names if needed
      const companyIds = [
        ...new Set(
          fetchedUsers
            .map(user => user.company?._id || user.company)
            .filter(Boolean)
        )
      ];
      
      // Create a set of company IDs we don't have names for
      const missingCompanyIds = companyIds.filter(id => 
        typeof id === 'string' && !companyMap[id]
      );
      
      if (missingCompanyIds.length > 0) {
        try {
          const companiesRes = await api.get(`/companies?ids=${missingCompanyIds.join(',')}`);
          
          // Create company ID to name mapping
          const newMap = { ...companyMap };
          companiesRes.data.data.companies.forEach(company => {
            newMap[company._id] = company.name;
          });
          setCompanyMap(newMap);
        } catch (err) {
          console.error('Failed to fetch company names', err);
          toast.warning('Some company names could not be loaded');
        }
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch users';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Get company name with fallbacks
  const getCompanyName = useCallback((company) => {
    if (!company) return 'N/A';
    
    // If company is an object with name property
    if (typeof company === 'object' && company.name) {
      return company.name;
    }
    
    // If company is an ID string
    if (typeof company === 'string') {
      return companyMap[company] || 'Loading...';
    }
    
    return 'N/A';
  }, [companyMap]);

  // Apply filters whenever search term or role filter changes
  useEffect(() => {
    let result = users;
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        (user.phone && user.phone.toLowerCase().includes(term)) ||
        (getCompanyName(user.company)?.toLowerCase().includes(term))
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users, companyMap, getCompanyName]);

  // Toggle admin status with smooth animation
  const toggleAdminStatus = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'employee' : 'admin';
    
    try {
      // Show loading toast
      const toastId = toast.loading('Updating user role...');
      
      // Update user in backend
      await api.patch(`/users/${userId}`, { role: newRole });
      
      // Update user in local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
      // Update stats
      setStats(prev => {
        if (currentRole === 'admin') {
          return { ...prev, admin: prev.admin - 1, employee: prev.employee + 1 };
        } else {
          return { ...prev, admin: prev.admin + 1, employee: prev.employee - 1 };
        }
      });
      
      // Update toast
      toast.update(toastId, {
        render: `Role updated to ${newRole}`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update user';
      toast.error(errorMsg);
      console.error('Update error:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaCrown className="text-purple-600" />;
      case 'employee': return <FaUserTie className="text-blue-500" />;
      case 'client': return <FaUser className="text-green-500" />;
      default: return <FaUserAlt className="text-gray-500" />;
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
        <button 
          onClick={() => {
            setError('');
            fetchUsers();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
        >
          <FaSync className="mr-2" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
        >
          <FaSync className="mr-2" /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 flex items-center border border-gray-100">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <FaUserAlt className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 flex items-center border border-gray-100">
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <FaCrown className="text-purple-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Admins</p>
            <p className="text-2xl font-bold text-purple-600">{stats.admin}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 flex items-center border border-gray-100">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <FaUserTie className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Employees</p>
            <p className="text-2xl font-bold text-blue-600">{stats.employee}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 flex items-center border border-gray-100">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <FaUser className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Clients</p>
            <p className="text-2xl font-bold text-green-600">{stats.client}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or company..."
              className="pl-10 w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full py-3 px-4 pr-8 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="client">Client</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                toast.info('Filters cleared');
              }}
              className="py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePhoto ? (
                            <img 
                              src={user.profilePhoto} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center text-gray-500 font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <FaBuilding className="text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate max-w-[150px]">
                          {getCompanyName(user.company)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'employee' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div 
                          onClick={() => toggleAdminStatus(user._id, user.role)}
                          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out cursor-pointer ${
                            user.role === 'admin' ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                          aria-label={`Toggle admin status for ${user.name}`}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                              user.role === 'admin' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {user.role === 'admin' ? 'Admin' : 'Make Admin'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FaSearch className="text-gray-400 text-4xl mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setRoleFilter('all');
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MakeAdminPanel;