import React from 'react';

const Modal = ({ isOpen, onClose, children, color = '#3a8dd5' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: '#1a2035',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 2px ${color}`,
        animation: 'slideUp 0.3s ease-out'
      }}>
        {children}
      </div>
      <style>{\`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      \`}</style>
    </div>
  );
};

export default Modal;
