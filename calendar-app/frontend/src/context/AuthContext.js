import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        
        // Set auth token header
        setAuthToken(token);
        
        try {
          const res = await axios.get('/api/users/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error checking authentication', error);
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users/register', formData);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/users/login', formData);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};