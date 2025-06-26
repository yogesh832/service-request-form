import { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaChartBar, FaTimes } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/helpers';
import api from '../utils/api';
import { toast } from 'react-toastify';
import PhoneInput from '../components/ui/PhoneInput'; // Add this import
const Clients = () => {
  const [showClientModal, setShowClientModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    plan: 'Starter',
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tickets
        const ticketsResponse = await api.get('/tickets');
        setTicketsData(ticketsResponse.data.data.tickets || []);
        
        // Fetch companies
        const companiesResponse = await api.get('/companies');
        setCompanies(companiesResponse.data.data.companies || []);
        
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update form data when editing a client
  useEffect(() => {
    if (currentClient) {
      setFormData({
        name: currentClient.name || '',
        contact: currentClient.contact || '',
        email: currentClient.email || '',
        phone: currentClient.phone || '',
        plan: currentClient.plan || 'Starter',
      });
    } else {
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        plan: 'Starter',
      });
    }
  }, [currentClient]);

  // Calculate company stats
  const companiesWithStats = companies.map(company => {
    const tickets = ticketsData.filter(ticket => ticket.company?._id === company._id || ticket.company === company.name);
    return {
      ...company,
      ticketCount: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      pendingTickets: tickets.filter(t => t.status === 'pending').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    };
  });

  // Filter companies
  const filteredCompanies = companiesWithStats.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        company.contact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'enterprise' && company.plan === 'Enterprise') ||
                         (filter === 'professional' && company.plan === 'Professional') ||
                         (filter === 'starter' && company.plan === 'Starter');
    
    return matchesSearch && matchesFilter;
  });
  const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  };
  const handleEditClient = (client) => {
    setCurrentClient(client);
    setShowClientModal(true);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await api.delete(`/companies/${clientId}`);
        setCompanies(companies.filter(company => company._id !== clientId));
        toast.success('Client deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete client');
      }
    }
  };

  const handleSubmitClient = async (e) => {
    e.preventDefault();
        // Validate phone before submission
    const isValidPhone = validatePhone(formData.phone);

    
    if (!isValidPhone) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    try {
      let response;
      
      if (currentClient) {
        // Update existing client
        response = await api.patch(`/companies/${currentClient._id}`, formData);
        setCompanies(companies.map(c => c._id === currentClient._id ? response.data.data.company : c));
        toast.success('Client updated successfully');
      } else {
        // Create new client
        response = await api.post('/companies', formData);
        setCompanies([...companies, response.data.data.company]);
        toast.success('Client created successfully');
      }
      // fetchData(); // Refresh data
      setShowClientModal(false);
      setCurrentClient(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save client');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return  <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Companies</h1>
          <p className="text-gray-600">Manage all your client organizations and their support tickets</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentClient(null);
            setShowClientModal(true);
          }}
          className="flex items-center gap-2"
        >
          <FaPlus /> New Client
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {filteredCompanies.slice(0, 4).map(company => (
          <Card key={company._id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{company.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{company.plan} Plan</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                {company.name.charAt(0)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FaUser className="text-gray-400" />
                <span>{company.contact}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-gray-400" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaPhone className="text-gray-400" />
                <span>{company.phone}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tickets</span>
                <span className="font-medium">{company.ticketCount}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-medium text-blue-600">{company.openTickets + company.pendingTickets}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-0">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">All Clients</h2>
          <div className="flex gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="py-2 px-4 pr-8 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Plans</option>
                <option value="enterprise">Enterprise</option>
                <option value="professional">Professional</option>
                <option value="starter">Starter</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map(company => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{company.contact}</div>
                    <div className="text-sm text-gray-500">{company.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      company.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                      company.plan === 'Professional' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {company.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 mr-2">
                        <div className="flex h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${(company.resolvedTickets / company.ticketCount) * 100 || 0}%` }}
                          ></div>
                          <div 
                            className="bg-yellow-500" 
                            style={{ width: `${(company.pendingTickets / company.ticketCount) * 100 || 0}%` }}
                          ></div>
                          <div 
                            className="bg-red-500" 
                            style={{ width: `${(company.openTickets / company.ticketCount) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-900">{company.ticketCount}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="text-green-600">{company.resolvedTickets} resolved</span> • 
                      <span className="text-yellow-600"> {company.pendingTickets} pending</span> • 
                      <span className="text-red-600"> {company.openTickets} open</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      company.ticketCount === 0 ? 'bg-green-100 text-green-800' :
                      company.openTickets > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {company.ticketCount === 0 ? 'No Tickets' : company.openTickets > 0 ? 'Active Issues' : 'Stable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(company.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditClient(company)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteClient(company._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCompanies.length === 0 && (
            <div className="py-12 text-center">
              {/* <div className="text-gray-400 text-5xl mb-4">🏢</div> */}
              <h3 className="text-lg font-medium text-gray-600">No clients found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'Try changing your search terms' : 'Create your first client'}
              </p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Client Form Modal - Conditionally rendered */}
      {showClientModal && (
        <Modal onClose={() => setShowClientModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {currentClient ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button 
                onClick={() => setShowClientModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmitClient} className="p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Acme Corporation"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="contact@company.com"
                  required
                />
              </div>
              
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
<input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handleInputChange}
  className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
  placeholder="+91 1234567890"
  pattern="^\+91[6-9]\d{9}$"
  required
/>

              </div> */}
                        <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                  error={!validatePhone(formData.phone)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Type *
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                >
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition"
                >
                  {currentClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Clients;