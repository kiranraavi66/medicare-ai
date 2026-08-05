import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Plus, CheckCircle, Clock, Trash2, Volume2, Pill, ShieldAlert } from 'lucide-react';

export const RemindersPage = () => {
  const { API_BASE_URL } = useAuth();
  
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('08:00 AM');
  const [frequency, setFrequency] = useState('Daily');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reminders/`);
      setReminders(res.data);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/reminders/`, {
        medicine_name: medicineName,
        dosage,
        time_of_day: timeOfDay,
        frequency,
        notes
      });
      setReminders(prev => [res.data, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (id) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/reminders/${id}/toggle`);
      setReminders(prev => prev.map(r => r.id === id ? res.data : r));
    } catch (err) {
      console.error('Failed to toggle reminder:', err);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm('Delete this medicine reminder?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/reminders/${id}`);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
    }
  };

  const testAudioNotification = (remName) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("⏰ MediCare Reminder Alert", {
        body: `Time to take your scheduled dose: ${remName}`,
        icon: '/favicon.ico'
      });
    }
    // Play subtle audio alert synth tone
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const resetForm = () => {
    setMedicineName('');
    setDosage('');
    setTimeOfDay('08:00 AM');
    setFrequency('Daily');
    setNotes('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={28} color="var(--primary)" /> Medicine Schedule & Reminders
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Never miss a prescription dosage with audio & browser notifications.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Add New Reminder
        </button>
      </div>

      {/* Reminder Grid */}
      {reminders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <Pill size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>No Medicine Reminders Set</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Add your daily prescription times to stay on track.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {reminders.map((rem) => (
            <div 
              key={rem.id} 
              className="glass-card"
              style={{
                opacity: rem.is_active ? 1 : 0.6,
                borderLeft: '4px solid',
                borderLeftColor: rem.is_active ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{rem.medicine_name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dosage: {rem.dosage}</span>
                </div>
                <button 
                  onClick={() => toggleReminder(rem.id)}
                  style={{
                    background: rem.is_active ? 'var(--secondary-glow)' : 'var(--bg-input)',
                    color: rem.is_active ? 'var(--secondary)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {rem.is_active ? 'Active' : 'Paused'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                <Clock size={16} /> {rem.time_of_day} • {rem.frequency}
              </div>

              {rem.notes && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  {rem.notes}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  onClick={() => testAudioNotification(rem.medicine_name)}
                  className="btn btn-secondary" 
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  title="Test Sound Alert"
                >
                  <Volume2 size={14} /> Test Alert
                </button>

                <button 
                  onClick={() => deleteReminder(rem.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.3rem' }}
                  title="Delete Reminder"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
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
          <div className="glass-card animate-fade-in" style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-card-solid)' }}>
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Add Medicine Reminder</h3>

            <form onSubmit={handleCreateReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', display: 'block' }}>Medicine Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Paracetamol / Amoxicillin" 
                  value={medicineName} 
                  onChange={(e) => setMedicineName(e.target.value)} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', display: 'block' }}>Dosage Amount</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 500mg / 1 Tablet" 
                    value={dosage} 
                    onChange={(e) => setDosage(e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', display: 'block' }}>Schedule Time</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="08:00 AM" 
                    value={timeOfDay} 
                    onChange={(e) => setTimeOfDay(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', display: 'block' }}>Special Instructions / Notes</label>
                <input 
                  type="text" 
                  placeholder="Take after breakfast with water" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Saving...' : 'Set Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
