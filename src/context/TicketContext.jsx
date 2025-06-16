import { createContext, useState, useContext, useMemo } from 'react';
import { dummyTickets } from '../data/dummyTickets';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(dummyTickets);
  
  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: `ticket_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      company: 'Acme Corp'
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicket = (id, updates) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id ? { ...ticket, ...updates } : ticket
      )
    );
  };

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    total: tickets.length
  }), [tickets]);

  return (
    <TicketContext.Provider value={{ 
      tickets, 
      addTicket, 
      updateTicket,
      stats
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);




// import { createContext, useState, useContext, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';

// const TicketContext = createContext();
// const API_BASE = 'https://5vwd9w13-5000.inc1.devtunnels.ms/api';

// export const TicketProvider = ({ children }) => {
//   const [tickets, setTickets] = useState([]);
//   const { user } = useAuth();

//   const fetchTickets = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/tickets`, {
//         headers: {
//           Authorization: `Bearer ${user?.token}`
//         }
//       });
//       setTickets(res.data);
//     } catch (error) {
//       console.error('Error fetching tickets:', error.response?.data?.message || error.message);
//     }
//   };

//   const addTicket = async (ticketData) => {
//     try {
//       const res = await axios.post(`${API_BASE}/tickets`, ticketData, {
//         headers: {
//           Authorization: `Bearer ${user?.token}`
//         }
//       });
//       setTickets(prev => [res.data, ...prev]);
//       return res.data;
//     } catch (error) {
//       console.error('Error adding ticket:', error.response?.data?.message || error.message);
//     }
//   };

//   const updateTicket = async (id, updates) => {
//     try {
//       const res = await axios.patch(`${API_BASE}/tickets/${id}`, updates, {
//         headers: {
//           Authorization: `Bearer ${user?.token}`
//         }
//       });
//       setTickets(prev =>
//         prev.map(ticket => ticket._id === id ? res.data : ticket)
//       );
//     } catch (error) {
//       console.error('Error updating ticket:', error.response?.data?.message || error.message);
//     }
//   };

//   const stats = useMemo(() => ({
//     open: tickets.filter(t => t.status === 'open').length,
//     pending: tickets.filter(t => t.status === 'pending').length,
//     resolved: tickets.filter(t => t.status === 'resolved').length,
//     total: tickets.length
//   }), [tickets]);

//   useEffect(() => {
//     if (user?.token) fetchTickets();
//   }, [user]);

//   return (
//     <TicketContext.Provider value={{ tickets, addTicket, updateTicket, stats }}>
//       {children}
//     </TicketContext.Provider>
//   );
// };

// export const useTickets = () => useContext(TicketContext);
