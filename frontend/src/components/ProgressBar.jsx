import React from 'react';

const ProgressBar = ({ progress, height = '8px', showLabel = true, color = 'var(--primary)' }) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        {showLabel && <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Progress</span>}
        {showLabel && <span style={{ fontSize: '0.8rem', fontWeight: '700', color: color }}>{progress}%</span>}
      </div>
      <div className="progress-wrap" style={{ height, background: 'var(--bg-soft)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div 
          className="progress-fill" 
          style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: color,
            transition: 'width 0.5s ease-out'
          }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;
