import React from 'react';

const TaskList = ({ tasks, currentUserId }) => {
  
  const calculateContribution = () => {
    if (!tasks || tasks.length === 0) return 0;
    const userCompletedTasks = tasks.filter(t => t.assignedTo?._id === currentUserId && t.status === 'completed').length;
    return Math.round((userCompletedTasks / tasks.length) * 100);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':   return <span className="badge badge-green">Done</span>;
      case 'in-progress': return <span className="badge badge-yellow">In Progress</span>;
      default:            return <span className="badge badge-blue">Pending</span>;
    }
  };

  const contribution = calculateContribution();

  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3 className="section-title">Tasks & Tracking</h3>
          <p className="section-subtitle">Real-time contribution analysis</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>Your Contribution</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>{contribution}%</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No tasks assigned yet.
                </td>
              </tr>
            ) : (
              tasks.map(t => (
                <tr key={t._id}>
                  <td style={{ fontWeight: '600' }}>{t.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.65rem' }}>
                        {t.assignedTo?.name?.charAt(0) || '?'}
                      </div>
                      <span style={{ fontSize: '0.85rem' }}>
                        {t.assignedTo?._id === currentUserId ? 'You' : (t.assignedTo?.name || 'Unassigned')}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(t.deadline).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
