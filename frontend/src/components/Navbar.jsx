import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  MessageSquare, 
  Stethoscope, 
  FileText, 
  Pill, 
  MapPin, 
  Bell, 
  LayoutDashboard, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  User 
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.75rem 1.5rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>
          <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem', borderRadius: '10px', display: 'flex' }}>
            <Activity size={24} />
          </div>
          <span>MediCare <span style={{ color: 'var(--secondary)' }}>AI</span></span>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user ? (
            <>
              <Link to="/chat" className={`btn ${isActive('/chat') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <MessageSquare size={16} /> AI Chat
              </Link>
              <Link to="/symptoms" className={`btn ${isActive('/symptoms') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <Stethoscope size={16} /> Symptoms
              </Link>
              <Link to="/reports" className={`btn ${isActive('/reports') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <FileText size={16} /> Reports
              </Link>
              <Link to="/medicines" className={`btn ${isActive('/medicines') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <Pill size={16} /> Medicines
              </Link>
              <Link to="/hospitals" className={`btn ${isActive('/hospitals') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <MapPin size={16} /> Hospitals
              </Link>
              <Link to="/reminders" className={`btn ${isActive('/reminders') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <Bell size={16} /> Reminders
              </Link>
              <Link to="/dashboard" className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', background: '#8b5cf6', color: '#fff' }}>
                  <ShieldCheck size={16} /> Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
            </>
          )}
        </nav>

        {/* User Profile & Theme Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Toggle Light/Dark Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>{user.full_name}</strong>
                <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: 'var(--danger)' }} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
