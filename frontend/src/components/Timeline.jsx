import React from 'react';

const Timeline = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'task_created':    return '➕';
      case 'task_completed':  return '✅';
      case 'update_submitted': return '📤';
      case 'feedback_added':   return '💬';
      default:               return '🔹';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'task_created':    return 'var(--primary)';
      case 'task_completed':  return 'var(--success)';
      case 'update_submitted': return 'var(--warning)';
      case 'feedback_added':   return 'var(--accent)';
      default:               return 'var(--text-muted)';
    }
  };

  return (
    <div className="glass-card">
      <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Project Activity</h3>
      
      {activities.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No activities recorded yet.</p>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          
          <div style={{ 
            position: 'absolute', 
            left: '7px', 
            top: '0', 
            bottom: '0', 
            width: '2px', 
            background: 'var(--border)',
            zIndex: 0
          }} />

          {activities.map((activity, index) => (
            <div key={index} style={{ position: 'relative', marginBottom: '1.5rem' }}>
              
              <div style={{ 
                position: 'absolute', 
                left: '-2rem', 
                top: '0', 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                background: getColor(activity.type),
                border: '3px solid #fff',
                boxShadow: 'var(--shadow-sm)',
                zIndex: 1
              }} />
              
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                  {getIcon(activity.type)} {activity.description}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {activity.user}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(activity.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
