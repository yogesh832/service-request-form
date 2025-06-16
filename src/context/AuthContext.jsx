// import { createContext, useState, useContext } from 'react';
// import { dummyUsers } from '../data/dummyUsers';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });
  
//   const login = (email, password) => {
//     const user = dummyUsers.find(u => 
//       u.email === email && u.password === password
//     );
    
//     if (user) {
//       setUser(user);
//       localStorage.setItem('user', JSON.stringify(user));
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const register = (userData) => {
//     const newUser = {
//       ...userData,
//       id: `user_${Date.now()}`,
//       role: 'client'
//     };
//     dummyUsers.push(newUser);
//     return true;
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// const API_BASE = 'https://5vwd9w13-5000.inc1.devtunnels.ms';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const [token, setToken] = useState(() => {
//     return localStorage.getItem('token') || null;
//   });

//   // Set default axios auth header when token updates
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

//       const { user: userData, token: jwtToken } = res.data;

//       setUser(userData);
//       setToken(jwtToken);

//       localStorage.setItem('user', JSON.stringify(userData));
//       localStorage.setItem('token', jwtToken);

//       return true;
//     } catch (err) {
//       console.error('Login failed:', err.response?.data?.message || err.message);
//       return false;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const res = await axios.post(`${API_BASE}/auth/signup`, userData);
//       return res.data;
//     } catch (err) {
//       console.error('Signup failed:', err.response?.data?.message || err.message);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   const fetchCurrentUser = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/users/me`);
//       setUser(res.data);
//       localStorage.setItem('user', JSON.stringify(res.data));
//     } catch (err) {
//       console.error('Fetch current user failed:', err.response?.data?.message || err.message);
//       logout(); // Token might be invalid or expired
//     }
//   };

//   useEffect(() => {
//     if (token && !user) {
//       fetchCurrentUser();
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(res.data.data.user);
      console.log('User fetched:', res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      console.log(loading)
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
<AuthContext.Provider value={{ user, setUser, loading, logout }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
