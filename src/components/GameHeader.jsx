import React from 'react';

const GameHeader = ({ level, levelName, score, moves }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      padding: '20px',
      backgroundColor: 'rgba(15, 20, 35, 0.6)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#66a3e0', marginBottom: '4px' }}>
          Level {level}
        </div>
        <div style={{ fontSize: '14px', color: '#b3c5d9' }}>
          {levelName}
        </div>
      </div>

      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#b3c5d9', marginBottom: '4px' }}>
          Skor
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd94d' }}>
          {score}
        </div>
      </div>

      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#b3c5d9', marginBottom: '4px' }}>
          Hamle
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: moves < 5 ? '#ff6b6b' : '#4dff88'
        }}>
          {moves}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
