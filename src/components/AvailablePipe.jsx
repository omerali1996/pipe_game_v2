import React from 'react';
import { PIPE_TYPES } from '../constants';

const AvailablePipe = ({ type, isSelected, onPress, onRotate }) => {
  const renderPipe = () => {
    const centerX = 50;
    const centerY = 50;
    const pathStyle = { stroke: '#b3bcc8', strokeWidth: 5, fill: 'none', strokeLinecap: 'round' };

    switch (type) {
      case PIPE_TYPES.STRAIGHT_V:
        return <line x1={centerX} y1="15" x2={centerX} y2="85" {...pathStyle} />;
      case PIPE_TYPES.STRAIGHT_H:
        return <line x1="15" y1={centerY} x2="85" y2={centerY} {...pathStyle} />;
      case PIPE_TYPES.CORNER_BR:
        return <path d={\`M \${centerX} 15 L \${centerX} \${centerY} L 85 \${centerY}\`} {...pathStyle} />;
      case PIPE_TYPES.CORNER_BL:
        return <path d={\`M \${centerX} 15 L \${centerX} \${centerY} L 15 \${centerY}\`} {...pathStyle} />;
      case PIPE_TYPES.CORNER_TR:
        return <path d={\`M \${centerX} 85 L \${centerX} \${centerY} L 85 \${centerY}\`} {...pathStyle} />;
      case PIPE_TYPES.CORNER_TL:
        return <path d={\`M \${centerX} 85 L \${centerX} \${centerY} L 15 \${centerY}\`} {...pathStyle} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onPress}
      onDoubleClick={onRotate}
      style={{
        width: '80px',
        height: '80px',
        backgroundColor: isSelected ? 'rgba(58, 141, 213, 0.3)' : '#141d2e',
        border: \`2px solid \${isSelected ? '#4d99e6' : '#4d7fcc'}\`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: 0,
        boxShadow: isSelected ? '0 0 12px rgba(58, 141, 213, 0.5)' : 'none'
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {renderPipe()}
      </svg>
    </button>
  );
};

export default AvailablePipe;
