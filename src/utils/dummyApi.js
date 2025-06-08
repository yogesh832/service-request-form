// Simulate API call delay
export const simulateApiCall = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Dummy notification data
export const dummyNotifications = [
  { id: 1, type: 'new', message: 'New ticket #TKT-102 created', timestamp: '2 mins ago' },
  { id: 2, type: 'assignment', message: 'You were assigned to ticket #TKT-98', timestamp: '1 hour ago' },
  { id: 3, type: 'update', message: 'Ticket #TKT-75 was updated', timestamp: '3 hours ago' },
  { id: 4, type: 'reminder', message: 'Follow up on ticket #TKT-64', timestamp: '1 day ago' }
];