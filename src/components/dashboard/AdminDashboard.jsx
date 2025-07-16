import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaFileExport } from "react-icons/fa";
import AssignTicketModal from "../modals/AssignTicketModal";
import ExportModal from "../modals/ExportModal";
import TicketList from "../tickets/TicketList";
import Card from "../ui/Card";
import Button from "../ui/Button";
import TicketStats from "../tickets/TicketStats";
import BarChart from "../ui/Charts/BarChart";
import PieChart from "../ui/Charts/PieChart";
import api from "../../utils/api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignError, setAssignError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(userData);

        const res = await api.get("/tickets");
        setTickets(res.data.data.tickets);
      } catch (err) {
        setError("Failed to load tickets");
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchEmployeesForTicket = async (ticketId) => {
    try {
      console.log("Fetching employees for ticket:", ticketId);
      const res = await api.get(`/tickets/${ticketId}/employees`);
      setEmployees(res.data.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAssignClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setAssignError(""); // reset any previous error
    fetchEmployeesForTicket(ticketId);
    setShowAssignModal(true);
  };

  const handleAssign = async (ticketId, employeeId) => {
    try {
      const res = await api.patch(`/tickets/${ticketId}/assign`, {
        assignedTo: employeeId,
      });

      const result = res.data;

      if (result.success === false) {
        toast.error(result.message || "❌ Assignment failed");
        return;
      }

      // ✅ Success
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? {
                ...ticket,
                assignedTo: employees.find((e) => e._id === employeeId),
              }
            : ticket
        )
      );
      toast.success("✅ Ticket assigned successfully");
      setShowAssignModal(false);
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error(
        error.response?.data?.message ||
          "❌ Assignment failed due to server error"
      );
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter !== "all" && ticket.status !== filter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (ticket.subject &&
          ticket.subject.toLowerCase().includes(searchLower)) ||
        (ticket.description &&
          ticket.description.toLowerCase().includes(searchLower)) ||
        (ticket.company &&
          ticket.company.name &&
          ticket.company.name.toLowerCase().includes(searchLower)) ||
        (ticket._id && ticket._id.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const statsData = [
    { name: "Open", value: tickets.filter((t) => t.status === "open").length },
    {
      name: "Pending",
      value: tickets.filter((t) => t.status === "pending").length,
    },
    {
      name: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
    },
  ];

  const companyStats = tickets.reduce((acc, ticket) => {
    const companyName = ticket.company?.name || "Unknown";
    acc[companyName] = (acc[companyName] || 0) + 1;
    return acc;
  }, {});

  const companyData = Object.entries(companyStats).map(([name, value]) => ({
    name,
    value,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage all support tickets and assignments
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950"
          >
            <FaFileExport /> Export
          </Button>
        </div>
      </div>

      {/* Stats & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TicketStats tickets={tickets} />
        </div>
        <Card className="p-5 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <div className="h-64 w-400">
            <PieChart data={statsData} />
          </div>
        </Card>
      </div>

      {/* Bar Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">Tickets by Company</h3>
          <div className="h-64">
            <BarChart data={companyData} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {tickets.slice(0, 4).map((ticket) => (
              <div
                key={ticket._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{ticket.subject}</h4>
                  <p className="text-sm text-gray-500">
                    {ticket.company?.name} • {ticket.status}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* All Tickets Table */}
      <Card className="p-0">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Tickets 📋
          </h2>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="py-2 px-4 pr-8 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <TicketList
          tickets={filteredTickets}
          currentUser={currentUser}
          onAssignClick={handleAssignClick}
        />
      </Card>

      {/* Modals */}
      {showAssignModal && selectedTicketId && (
        <AssignTicketModal
          ticket={tickets.find((t) => t._id === selectedTicketId)}
          employees={employees}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
          error={assignError}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={(format) => {
            alert(`Exporting data as ${format.toUpperCase()}...`);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
