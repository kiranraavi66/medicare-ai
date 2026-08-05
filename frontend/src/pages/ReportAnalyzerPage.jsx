import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileUp, FileText, Trash2, CheckCircle2, AlertTriangle, Sparkles, Clock } from 'lucide-react';

export const ReportAnalyzerPage = () => {
  const { API_BASE_URL } = useAuth();
  
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports/`);
      setReports(res.data);
      if (res.data.length > 0) {
        setActiveReport(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/reports/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReports(prev => [res.data, ...prev]);
      setActiveReport(res.data);
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload report file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Delete this report record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/reports/${reportId}`);
      setReports(prev => prev.filter(r => r.id !== reportId));
      if (activeReport?.id === reportId) {
        setActiveReport(null);
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '0.8rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem' }}>
          <FileUp size={32} />
        </div>
        <h2>Medical Lab Report AI Summarizer</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Upload PDF or image lab reports to generate simplified explanations and key medical findings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Upload Form & Report List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* File Upload Box */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileUp size={18} color="var(--primary)" /> Upload Lab Report
            </h4>
            
            <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="file" 
                accept=".pdf,.txt,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                required
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
                {uploading ? 'Analyzing Report with AI...' : 'Upload & Summarize'}
              </button>
            </form>
          </div>

          {/* Historical Reports List */}
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--primary)" /> Saved Reports
            </h4>

            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' }}>
                No lab reports uploaded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map((r) => {
                  const isSelected = activeReport?.id === r.id;
                  return (
                    <div 
                      key={r.id} 
                      onClick={() => setActiveReport(r)}
                      style={{
                        padding: '0.8rem',
                        borderRadius: '10px',
                        background: isSelected ? 'var(--primary-glow)' : 'var(--bg-input)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <strong style={{ fontSize: '0.85rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{r.filename}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteReport(r.id); }}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem' }}
                        title="Delete Report"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: AI Analysis View */}
        <div>
          {activeReport ? (
            <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>{activeReport.filename}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded on {new Date(activeReport.created_at).toLocaleString()}</span>
                </div>
                <span style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Format: {activeReport.file_type}
                </span>
              </div>

              <div>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <Sparkles size={18} /> AI Simplified Summary
                </h4>
                <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {activeReport.summary}
                </div>
              </div>

              {activeReport.key_findings && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                    <CheckCircle2 size={18} /> Key Parameters & Clinical Findings
                  </h4>
                  <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {activeReport.key_findings}
                  </div>
                </div>
              )}

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{activeReport.disclaimer}</span>
              </div>

            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3>No Report Selected</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Select a saved report from the left sidebar or upload a new lab report to view the AI summary.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
