import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Database, Activity, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export const AdminPanelPage = () => {
  const { API_BASE_URL } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`),
        axios.get(`${API_BASE_URL}/admin/users`)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (userId) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to toggle user status');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: '#8b5cf6', color: '#fff', padding: '0.8rem', borderRadius: '14px' }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <h2>System Administration & Control Panel</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage users, view system telemetry, and monitor AI service health.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading system diagnostics...
        </div>
      ) : (
        <>
          {/* Stats Row */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div className="glass-card">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Users</span>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', marginTop: '0.2rem' }}>{stats.total_users}</h3>
              </div>
              <div className="glass-card">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Chat Logs</span>
                <h3 style={{ fontSize: '2rem', color: 'var(--secondary)', marginTop: '0.2rem' }}>{stats.total_chats}</h3>
              </div>
              <div className="glass-card">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lab Reports Parsed</span>
                <h3 style={{ fontSize: '2rem', color: '#8b5cf6', marginTop: '0.2rem' }}>{stats.total_reports}</h3>
              </div>
              <div className="glass-card">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>System Status</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={18} /> {stats.system_status}
                </h3>
              </div>
            </div>
          )}

          {/* User Management Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" /> Registered User Accounts
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>User ID</th>
                    <th style={{ padding: '0.75rem' }}>Full Name</th>
                    <th style={{ padding: '0.75rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Joined Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem' }}>#{u.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.full_name}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          background: u.role === 'admin' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-input)',
                          color: u.role === 'admin' ? '#8b5cf6' : 'var(--text-main)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ color: u.is_active ? 'var(--secondary)' : 'var(--danger)', fontWeight: 600 }}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => toggleUserActive(u.id)}
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
