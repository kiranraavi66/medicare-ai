import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldAlert, Sparkles, Settings, Check } from 'lucide-react';

export const LoginPage = () => {
  const { login, API_BASE_URL, updateApiBaseUrl } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(API_BASE_URL);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const parseErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to connect to backend server. Please verify backend URL configuration.';
    }
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map(d => d.msg || d.message || JSON.stringify(d)).join(', ');
    }
    if (typeof detail === 'object' && detail !== null) {
      return detail.msg || detail.message || JSON.stringify(detail);
    }
    return err.message || 'Sign in failed. Please check your credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = parseErrorMessage(err);
      setError(msg);
      if (msg.includes('Unable to connect')) {
        setShowConfig(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    if (!customUrl) return;
    updateApiBaseUrl(customUrl);
    setSavedSuccess(true);
    setError('');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const setDemoUser = () => {
    setEmail('patient@medicare.ai');
    setPassword('password123');
    setError('');
  };

  const setDemoAdmin = () => {
    setEmail('admin@medicare.ai');
    setPassword('adminpassword123');
    setError('');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '460px', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.8rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem' }}>
            <LogIn size={28} />
          </div>
          <h2>Sign In to MediCare AI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Access your medical dashboard & AI assistant
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} /> {error}
            </div>
            {error.includes('Unable to connect') && (
              <button 
                type="button" 
                onClick={() => setShowConfig(!showConfig)}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', marginTop: '0.5rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
              >
                {showConfig ? 'Hide Backend Connection Settings' : '🔧 Configure Backend URL Settings'}
              </button>
            )}
          </div>
        )}

        {/* Dynamic Backend URL Config Section */}
        {showConfig && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Settings size={16} /> Backend Server Connection URL
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Enter your live deployed backend URL (e.g. <code>https://medicare-backend.onrender.com/api/v1</code>)
            </p>
            <form onSubmit={handleSaveUrl} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={customUrl} 
                onChange={(e) => setCustomUrl(e.target.value)} 
                placeholder="https://your-backend.onrender.com/api/v1"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                Save
              </button>
            </form>
            {savedSuccess && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                <Check size={14} /> Backend URL saved! Try signing in again.
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setError(''); }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Quick Fill Buttons */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Quick Fill Demo Credentials:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button type="button" onClick={setDemoAdmin} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
              <Sparkles size={12} color="#8b5cf6" /> Admin Demo
            </button>
            <button type="button" onClick={setDemoUser} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
              <Sparkles size={12} color="var(--primary)" /> Patient Demo
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
        </div>

      </div>
    </div>
  );
};
