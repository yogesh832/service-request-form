import { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserAlt,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users");
        setUsers(res.data.data.users);
        setFilteredUsers(res.data.data.users);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch users"
        );
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters whenever search term or role filter changes
  useEffect(() => {
    let result = users;

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.phone && user.phone.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  // Start editing a user
  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({
      name: "",
      email: "",
      phone: "",
      role: "",
    });
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited user
  const saveUser = async (userId) => {
    try {
      // Validate form
      if (!editForm.name || !editForm.email) {
        toast.error("Name and email are required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Update user
      const res = await api.patch(`/users/${userId}`, editForm);

      // Update UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...editForm } : user
        )
      );

      toast.success("User updated successfully");
      setEditingUserId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
      console.error("Update error:", err);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete(`/users/${userId}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
      console.error("Delete error:", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "employee":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            User Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Admins</span>
              </div>
              <span className="font-bold text-purple-600">
                {users.filter((u) => u.role === "admin").length}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Employees</span>
              </div>
              <span className="font-bold text-blue-600">
                {users.filter((u) => u.role === "employee").length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Clients</span>
              </div>
              <span className="font-bold text-green-600">
                {users.filter((u) => u.role === "client").length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-left"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
              }}
            >
              Clear all filters
            </button>
            <button
              className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-left"
              onClick={() => {
                setRoleFilter("admin");
                toast.info("Showing admin users");
              }}
            >
              View all admins
            </button>
            <button
              className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-left"
              onClick={() => {
                setRoleFilter("employee");
                toast.info("Showing employee users");
              }}
            >
              View all employees
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-600">Full control over all user accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-2 px-4 pr-8 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserAlt className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No users found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) =>
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
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {user._id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          {user.phone || "No phone"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {formatDate(user.createdAt)}
                      </td>
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
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
