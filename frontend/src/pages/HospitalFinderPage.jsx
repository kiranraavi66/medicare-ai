import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Clock, Navigation, ShieldAlert, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Marker Icons for Leaflet
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const HospitalFinderPage = () => {
  const { API_BASE_URL } = useAuth();
  
  const [userCoords, setUserCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi coords fallback
  const [hospitals, setHospitals] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Detecting device GPS location...');

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    fetchNearbyHospitals();
  }, [userCoords, category]);

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus('Device location acquired.');
        },
        (err) => {
          console.warn('Geolocation denied or failed, using city center fallback:', err);
          setLocationStatus('Geolocation fallback active (City Center).');
        }
      );
    } else {
      setLocationStatus('Geolocation not supported by browser.');
    }
  };

  const fetchNearbyHospitals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/hospitals/nearby`, {
        params: {
          latitude: userCoords.lat,
          longitude: userCoords.lng,
          radius_km: 25.0,
          category
        }
      });
      setHospitals(res.data);
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent)', padding: '0.8rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem' }}>
          <MapPin size={32} />
        </div>
        <h2>Emergency Hospital & Clinic Locator</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Find nearby medical centers, 24/7 trauma emergency rooms, and specialty clinics.
        </p>
      </div>

      {/* Control Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Navigation size={16} color="var(--primary)" />
          <span>{locationStatus}</span>
          <button onClick={detectLocation} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Recalibrate GPS</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--primary)" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'auto', padding: '0.4rem 0.8rem' }}>
            <option value="all">All Healthcare Facilities</option>
            <option value="emergency">24/7 Emergency Rooms Only</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
        
        {/* Leaflet Map */}
        <div className="glass-panel" style={{ padding: '0.5rem', minHeight: '450px' }}>
          <MapContainer center={[userCoords.lat, userCoords.lng]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User Position */}
            <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
              <Popup>
                <strong>Your Current Position</strong>
              </Popup>
            </Marker>

            {/* Hospital Markers */}
            {hospitals.map((h) => (
              <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hospitalIcon}>
                <Popup>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{h.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>{h.address}</div>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>📞 {h.phone}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Hospital Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Searching nearby medical centers...</div>
          ) : hospitals.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No medical facilities found within radius.</div>
          ) : (
            hospitals.map((h) => (
              <div key={h.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{h.name}</h4>
                  {h.open_24_7 && (
                    <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                      24/7 Emergency
                    </span>
                  )}
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.type} • {h.distance_km} km away</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{h.address}</div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <a href={`tel:${h.phone}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', justifyContent: 'center' }}>
                    <Phone size={14} /> Call {h.phone}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
