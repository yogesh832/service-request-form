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