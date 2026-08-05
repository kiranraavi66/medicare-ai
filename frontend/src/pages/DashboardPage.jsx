import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  MessageSquare, 
  FileText, 
  Bell, 
  Stethoscope, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Calendar,
  Sparkles 
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, API_BASE_URL } = useAuth();

  const [stats, setStats] = useState({
    chatsCount: 0,
    reportsCount: 0,
    remindersCount: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [chatRes, reportRes, remRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/chat/history`),
        axios.get(`${API_BASE_URL}/reports/`),
        axios.get(`${API_BASE_URL}/reminders/`)
      ]);

      setStats({
        chatsCount: chatRes.data.length,
        reportsCount: reportRes.data.length,
        remindersCount: remRes.data.length
      });
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-glow) 100%)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome back, {user?.full_name} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Here is your personal healthcare assistant summary & active health tasks.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Active Reminders</span>
            <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Bell size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>{stats.remindersCount}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily dosage schedule</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Saved Reports</span>
            <div style={{ background: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '0.5rem', borderRadius: '10px' }}>
              <FileText size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--secondary)' }}>{stats.reportsCount}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analyzed lab documents</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>AI Consultations</span>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent)', padding: '0.5rem', borderRadius: '10px' }}>
              <MessageSquare size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--accent)' }}>{stats.chatsCount}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total messages logged</span>
        </div>

      </div>

      {/* Quick Launch Grid */}
      <h3 style={{ marginBottom: '1.25rem' }}>Quick Actions & Services</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        <Link to="/chat" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.9rem', borderRadius: '14px' }}>
            <MessageSquare size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem' }}>AI Medical Chat</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ask symptoms & health questions</span>
          </div>
          <ArrowRight size={18} color="var(--primary)" />
        </Link>

        <Link to="/symptoms" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div style={{ background: 'var(--warning)', color: '#fff', padding: '0.9rem', borderRadius: '14px' }}>
            <Stethoscope size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem' }}>Symptom Triage</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Check risk score & condition guide</span>
          </div>
          <ArrowRight size={18} color="var(--warning)" />
        </Link>

        <Link to="/reports" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div style={{ background: 'var(--secondary)', color: '#fff', padding: '0.9rem', borderRadius: '14px' }}>
            <FileText size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem' }}>Lab Summarizer</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload PDF blood/lab reports</span>
          </div>
          <ArrowRight size={18} color="var(--secondary)" />
        </Link>

        <Link to="/hospitals" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div style={{ background: 'var(--accent)', color: '#fff', padding: '0.9rem', borderRadius: '14px' }}>
            <MapPin size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem' }}>Hospital Locator</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Find emergency room & clinics</span>
          </div>
          <ArrowRight size={18} color="var(--accent)" />
        </Link>

      </div>

    </div>
  );
};
