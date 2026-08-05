import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div style={{
      background: 'rgba(245, 158, 11, 0.1)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
      color: 'var(--warning)',
      padding: '0.5rem 1.5rem',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      gap: '0.5rem',
      textAlign: 'center'
    }}>
      <AlertTriangle size={16} style={{ flexShrink: 0 }} />
      <span>
        <strong>Medical Disclaimer:</strong> MediCare AI provides healthcare information for educational purposes only. It is not a substitute for professional clinical advice, diagnosis, or emergency care.
      </span>
    </div>
  );
};
