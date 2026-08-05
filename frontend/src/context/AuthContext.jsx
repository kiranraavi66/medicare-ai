import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL ="https://medicare-ai-8vv3.onrender.com/api/v1";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medicare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`);
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

    const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
    const { access_token, user_id, full_name, role } = res.data;

    localStorage.setItem('medicare_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser({ id: user_id, email, full_name, role });
    return res.data;
  };

  const register = async (email, full_name, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      full_name,
      password
    });
    // Auto login after registration
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('medicare_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
