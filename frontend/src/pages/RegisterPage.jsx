import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailExistsError, setIsEmailExistsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const parseErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to connect to service. Please check your internet connection or try again shortly.';
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%' }}>
        
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
