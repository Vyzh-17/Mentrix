import React from 'react';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ project, onClick }) => {
  const { title, description, status, progress, deadline } = project;
  
  
  const isAtRisk = () => {
    if (status === 'completed') return false;
    
    const now = new Date();
    const due = new Date(deadline);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    
    return (diffDays <= 7 && progress < 50);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':    return 'var(--success)';
      case 'proposed':  return 'var(--warning)';
      case 'delayed':   return 'var(--danger)';
      case 'completed': return 'var(--primary)';
      default:          return 'var(--text-muted)';
    }
  };

  return (
    <div className="glass-card animate-in" onClick={onClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="flex-between">
        <span 
          className="badge" 
          style={{ 
            background: `${getStatusColor()}15`, 
            color: getStatusColor(),
            border: `1px solid ${getStatusColor()}30` 
          }}
        >
          ● {status}
        </span>
        {isAtRisk() && (
          <span className="badge badge-red" style={{ animation: 'pulse 2s infinite' }}>
            ⚠️ At Risk
          </span>
        )}
      </div>

      <div>
        <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
          {description}
        </p>
      </div>

      <ProgressBar progress={progress} height="6px" />

      <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline</p>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
            {new Date(deadline).toLocaleDateString()}
          </p>
        </div>
        <button className="btn-ghost" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
          Details →
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
