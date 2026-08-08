import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldAlert, LogIn, ArrowRight, Settings, Check } from 'lucide-react';

export const RegisterPage = () => {
  const { register, API_BASE_URL, updateApiBaseUrl } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailExistsError, setIsEmailExistsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(API_BASE_URL);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const parseErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to reach backend server. Please verify backend server URL.';
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
    return err.message || 'Registration failed. Please check your inputs.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsEmailExistsError(false);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register(email, fullName, password);
      navigate('/dashboard');
    } catch (err) {
      const errMsg = parseErrorMessage(err);
      setError(errMsg);
      if (errMsg.toLowerCase().includes('already registered') || errMsg.toLowerCase().includes('already exist')) {
        setIsEmailExistsError(true);
      }
      if (errMsg.includes('Unable to reach')) {
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

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '460px', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '0.8rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem' }}>
            <UserPlus size={28} />
          </div>
          <h2>Create Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join MediCare AI for personalized health tracking
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} /> {error}
            </div>
            {isEmailExistsError && (
              <div style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.8rem' }}>
                  An account with this email address already exists in MediCare AI.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                  <LogIn size={14} /> Sign In To Your Account <ArrowRight size={14} />
                </Link>
              </div>
            )}
            {error.includes('Unable to reach') && (
              <button 
                type="button" 
                onClick={() => setShowConfig(!showConfig)}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', marginTop: '0.25rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, textAlign: 'left' }}
              >
                {showConfig ? 'Hide Backend Connection Settings' : '🔧 Configure Backend Server URL'}
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
                <Check size={14} /> Backend URL saved! Try registering again.
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="Dr. Alex Morgan / Jane Doe" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setError(''); setIsEmailExistsError(false); }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', display: 'block' }}>Password</label>
            <input 
              type="password" 
              required 
              minLength={6} 
              placeholder="Minimum 6 characters" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in here</Link>
        </div>

      </div>
    </div>
  );
};
