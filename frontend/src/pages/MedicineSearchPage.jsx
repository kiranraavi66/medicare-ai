import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Pill, Search, Info, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const MedicineSearchPage = () => {
  const { API_BASE_URL } = useAuth();
  
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, [searchQuery, category]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/medicines/`, {
        params: { q: searchQuery, category }
      });
      setMedicines(res.data);
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.8rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem' }}>
          <Pill size={32} />
        </div>
        <h2>Pharmaceutical Medicine Directory</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Search for prescription and over-the-counter medicine usages, active ingredients, dosage guidance, and precautions.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            placeholder="Search medicine name, active ingredient, or indication (e.g. Paracetamol, fever)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--primary)" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'auto' }}>
            <option value="all">All Categories</option>
            <option value="Analgesics">Analgesics & Fever</option>
            <option value="NSAID">NSAIDs & Anti-inflammatory</option>
            <option value="Antibiotic">Antibiotics</option>
            <option value="Antihistamine">Antihistamines</option>
            <option value="Proton Pump Inhibitor">Stomach Acid & Reflux</option>
            <option value="Antidiabetic">Antidiabetic</option>
          </select>
        </div>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading medicine directory...
        </div>
      ) : medicines.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No medicine records match your search criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {medicines.map((med) => (
            <div key={med.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{med.name}</h3>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-input)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    {med.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <strong>Generic Name:</strong> {med.generic_name}
                </div>

                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  <strong>Primary Uses:</strong> {med.uses}
                </div>
              </div>

              <button onClick={() => setSelectedMed(med)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem', marginTop: '1rem' }}>
                <Info size={16} /> View Dosage & Safety Precautions
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedMed && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', width: '100%', background: 'var(--bg-card-solid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ color: 'var(--primary)' }}>{selectedMed.name}</h3>
              <button onClick={() => setSelectedMed(null)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Generic / Active Ingredient:</strong> {selectedMed.generic_name}
              </div>

              <div>
                <strong>Dosage & Administration:</strong>
                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', marginTop: '0.25rem' }}>
                  {selectedMed.dosage_info}
                </div>
              </div>

              <div>
                <strong>Potential Side Effects:</strong>
                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', marginTop: '0.25rem', color: 'var(--warning)' }}>
                  {selectedMed.side_effects}
                </div>
              </div>

              <div>
                <strong>Key Safety Precautions:</strong>
                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', marginTop: '0.25rem' }}>
                  {selectedMed.precautions}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setSelectedMed(null)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
