import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Stethoscope, 
  FileSearch, 
  ShieldCheck, 
  MapPin, 
  BellRing, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Lock 
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        padding: '5rem 1.5rem', 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem' 
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          background: 'var(--primary-glow)',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <Cpu size={16} /> Full-Stack AI Healthcare Application
        </div>

        <h1 style={{ fontSize: '3.2rem', lineHeight: 1.1, background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Smart Healthcare Information & AI Medical Assistant
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '750px' }}>
          Empowering patients with Instant AI Medical Information, Lab Report Summarization, Symptom Risk Triage, Hospital Location, and Automated Medicine Reminders.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            Sign In to Demo Account
          </Link>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="var(--secondary)" /> FastAPI + React Architecture</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="var(--secondary)" /> Gemini 1.5 AI Model</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="var(--secondary)" /> JWT Auth & RBAC</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="var(--secondary)" /> Docker Containerized</span>
        </div>
      </section>

      {/* Grid of Key Features */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2rem' }}>Core Application Modules</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <Bot size={28} />
            </div>
            <h3>AI Medical Assistant</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Real-time conversational medical queries powered by Gemini AI with Voice Speech-to-Text & Text-to-Speech audio response capability.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <FileSearch size={28} />
            </div>
            <h3>Lab Report Summarizer</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Upload lab test PDF/Image documents to parse complex medical jargon into simplified layman summaries and key findings.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <Stethoscope size={28} />
            </div>
            <h3>Interactive Symptom Checker</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Guided step-by-step health triage evaluating severity, duration, and symptom patterns to assign Low, Moderate, or High risk levels.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <MapPin size={28} />
            </div>
            <h3>Hospital & Emergency Finder</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Locate nearby 24/7 emergency rooms, specialized clinics, and pharmacies with interactive map visualization and contact numbers.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <BellRing size={28} />
            </div>
            <h3>Medicine Schedule Reminders</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Schedule daily dosage times with browser audio notifications to ensure zero missed prescription doses.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3>Admin & Security Dashboard</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Role-Based Access Control (RBAC) with JWT authentication, user status toggle, and real-time operational telemetry.
            </p>
          </div>

        </div>
      </section>

      {/* Tech Stack Specs for Resume */}
      <section style={{ maxWidth: '1000px', margin: '3rem auto 0', padding: '2rem 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Database size={22} color="var(--primary)" /> Technical Architecture Overview
          </h3>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', color: 'var(--text-muted)', listStyleType: 'none' }}>
            <li style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px' }}>⚡ <strong>Backend:</strong> FastAPI (Python 3.11), Pydantic v2, SQLAlchemy ORM</li>
            <li style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px' }}>🎨 <strong>Frontend:</strong> React 18, Vite, Custom Glassmorphism CSS</li>
            <li style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px' }}>🤖 <strong>AI Engine:</strong> Google Gemini 1.5 Flash + Fallback Engine</li>
            <li style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px' }}>🔐 <strong>Auth:</strong> OAuth2 Bearer JWT + Bcrypt Password Hashing</li>
            <li style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px' }}>🗄️ <strong>Database:</strong> SQLite (Local) / PostgreSQL (Prod)</li>
            <li style={{ padding: '0.5rem', background: 'var(--bg-input)', borderRadius: '8px' }}>🐳 <strong>DevOps:</strong> Docker & Docker-Compose multi-container</li>
          </ul>
        </div>
      </section>

    </div>
  );
};
