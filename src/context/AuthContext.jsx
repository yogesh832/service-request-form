import { createContext, useState, useContext } from 'react';
import { dummyUsers } from '../data/dummyUsers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const login = (email, password) => {
    const user = dummyUsers.find(u => 
      u.email === email && u.password === password
    );
    
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`,
      role: 'client'
    };
    dummyUsers.push(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);