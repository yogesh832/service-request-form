import { useEffect, useRef } from 'react';
import { FaTimes, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Notification = ({ onClose }) => {
  const notifications = [
    { id: 1, type: 'new', message: 'New ticket #TKT-102 created', timestamp: '2 mins ago' },
    { id: 2, type: 'assignment', message: 'You were assigned to ticket #TKT-98', timestamp: '1 hour ago' },
    { id: 3, type: 'update', message: 'Ticket #TKT-75 was updated', timestamp: '3 hours ago' },
  ];
  
  const ref = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      ref={ref}
      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 border border-gray-200"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <FaBell />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-3">
              <FaBell className="text-gray-400 text-xl" />
            </div>
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-gray-50 text-center">
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          Mark all as read
        </button>
      </div>
    </motion.div>
  );
};