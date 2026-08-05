import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const COMMON_SYMPTOMS = [
  "Fever / High Temperature",
  "Headache / Migraine",
  "Cough / Throat Irritation",
  "Shortness of Breath",
  "Chest Pain / Pressure",
  "Abdominal Pain / Nausea",
  "Fatigue / Body Aches",
  "Dizziness / Lightheadedness",
  "Joint Pain / Stiffness",
  "Skin Rash / Itching"
];

export const SymptomCheckerPage = () => {
  const { API_BASE_URL } = useAuth();
  
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Male');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('Mild');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleCheckSymptoms = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/symptoms/check`, {
        age: parseInt(age),
        gender,
        symptoms: selectedSymptoms,
        duration,
        severity
      });
      setResult(res.data);
    } catch (err) {
      console.error('Symptom check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '0.8rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem' }}>
          <Stethoscope size={32} />
        </div>
        <h2>Interactive Symptom Risk Checker</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Select your current symptoms and health parameters to receive an automated triage assessment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Form Container */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleCheckSymptoms} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Age & Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>Age (Years)</label>
                <input type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Select Symptoms */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>Select Symptoms</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {COMMON_SYMPTOMS.map((sym, idx) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                        background: isSelected ? 'var(--primary-glow)' : 'var(--bg-input)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '} {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration & Severity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>Symptom Duration</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="Less than 24 hours">Less than 24 hours</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="More than 2 weeks">More than 2 weeks</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>Perceived Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="Mild">Mild Discomfort</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe / Intense Pain</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.9rem' }}>
              {loading ? 'Evaluating Triage Risk...' : 'Run Triage Assessment'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Risk Badge Header */}
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'center',
              background: result.risk_level === 'High' ? 'rgba(239, 68, 68, 0.15)' : result.risk_level === 'Moderate' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: result.risk_level === 'High' ? 'var(--danger)' : result.risk_level === 'Moderate' ? 'var(--warning)' : 'var(--secondary)',
              border: '1px solid',
              borderColor: result.risk_level === 'High' ? 'var(--danger)' : result.risk_level === 'Moderate' ? 'var(--warning)' : 'var(--secondary)'
            }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Triage Risk Rating</span>
              <h2 style={{ fontSize: '1.8rem', color: 'inherit', marginTop: '0.2rem' }}>{result.risk_level} Risk Level</h2>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Stethoscope size={18} color="var(--primary)" /> Possible Clinical Considerations
              </h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {result.possible_conditions.map((cond, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{cond}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} color="var(--secondary)" /> Recommended Action Steps
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {result.recommended_actions.map((act, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-input)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                    {act}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--warning)' }}>
              {result.disclaimer}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
