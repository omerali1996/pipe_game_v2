import React from 'react';
import { PIPE_TYPES } from '../constants';

const PipeCell = ({ cell, onPress, onRotate }) => {
  const renderPipe = () => {
    const centerX = 50;
    const centerY = 50;

    if (cell.isBlocked) {
      return (
        <>
          <line x1="20" y1="20" x2="80" y2="80" stroke="#8b5656" strokeWidth="3" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="#8b5656" strokeWidth="3" />
        </>
      );
    }

    if (cell.type === PIPE_TYPES.START) {
      return (
        <>
          <ellipse cx={centerX} cy="72" rx="20" ry="20" fill="#4d99e6" />
          <rect x="42" y="45" width="16" height="30" fill="#3a7bc8" />
        </>
      );
    }

    if (cell.type === PIPE_TYPES.TARGET) {
      return (
        <>
          <path d="M 30 75 L 35 25 L 65 25 L 70 75 Z" stroke="#e6b84d" strokeWidth="3" fill="none" />
          <circle cx={centerX} cy={centerY} r="15" fill="#ffd94d" />
        </>
      );
    }

    if (cell.placed && cell.type) {
      const pathStyle = { stroke: '#8b94a3', strokeWidth: 5, fill: 'none', strokeLinecap: 'round' };

      switch (cell.type) {
        case PIPE_TYPES.STRAIGHT_V:
          return <line x1={centerX} y1="10" x2={centerX} y2="90" {...pathStyle} />;
        case PIPE_TYPES.STRAIGHT_H:
          return <line x1="10" y1={centerY} x2="90" y2={centerY} {...pathStyle} />;
        case PIPE_TYPES.CORNER_BR:
          return <path d={\`M \${centerX} 10 L \${centerX} \${centerY} L 90 \${centerY}\`} {...pathStyle} />;
        case PIPE_TYPES.CORNER_BL:
          return <path d={\`M \${centerX} 10 L \${centerX} \${centerY} L 10 \${centerY}\`} {...pathStyle} />;
        case PIPE_TYPES.CORNER_TR:
          return <path d={\`M \${centerX} 90 L \${centerX} \${centerY} L 90 \${centerY}\`} {...pathStyle} />;
        case PIPE_TYPES.CORNER_TL:
          return <path d={\`M \${centerX} 90 L \${centerX} \${centerY} L 10 \${centerY}\`} {...pathStyle} />;
      }
    }

    return null;
  };

  const getBorderColor = () => {
    if (cell.isBlocked) return '#4d4d4d';
    if (cell.fixed) return '#66a3e0';
    if (cell.placed) return '#4d99cc';
    return 'rgba(77, 102, 153, 0.5)';
  };

  const getBackgroundColor = () => {
    if (cell.hasFlow) return 'rgba(58, 141, 213, 0.3)';
    if (cell.isBlocked) return '#262626';
    if (cell.fixed) return '#1a2638';
    return '#0d1420';
  };

  return (
    <button
      onClick={onPress}
      onDoubleClick={onRotate}
      style={{
        width: '70px',
        height: '70px',
        backgroundColor: getBackgroundColor(),
        border: \`2px solid \${getBorderColor()}\`,
        borderRadius: '6px',
        cursor: cell.fixed || cell.isBlocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        padding: 0
      }}
      disabled={cell.fixed || cell.isBlocked}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {renderPipe()}
      </svg>
    </button>
  );
};

export default PipeCell;
