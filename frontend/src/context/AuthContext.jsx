import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getInitialApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '');
  }
  const savedUrl = localStorage.getItem('medicare_custom_api_url');
  if (savedUrl) {
    return savedUrl.trim().replace(/\/$/, '');
  }
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) {
    return 'http://localhost:8000/api/v1';
  }
  return 'http://localhost:8000/api/v1';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medicare_token') || null);
  const [apiBaseUrl, setApiBaseUrlState] = useState(getInitialApiBaseUrl());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token, apiBaseUrl]);

  const updateApiBaseUrl = (newUrl) => {
    let formatted = newUrl.trim().replace(/\/$/, '');
    if (!formatted.endsWith('/api/v1') && !formatted.includes('/api/v1')) {
      formatted = `${formatted}/api/v1`;
    }
    localStorage.setItem('medicare_custom_api_url', formatted);
    setApiBaseUrlState(formatted);
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const res = await axios.post(`${apiBaseUrl}/auth/login`, formData);
    const { access_token, user_id, full_name, role } = res.data;

    localStorage.setItem('medicare_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser({ id: user_id, email, full_name, role });
    return res.data;
  };

  const register = async (email, full_name, password) => {
    const res = await axios.post(`${apiBaseUrl}/auth/register`, {
      email,
      full_name,
      password
    });
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('medicare_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      API_BASE_URL: apiBaseUrl,
      updateApiBaseUrl
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

