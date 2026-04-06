import React from 'react';
import { useNavigate } from 'react-router-dom';

const MentorOverview = ({ currentUser, projects, setProjects, getProjectProgress }) => {
  const mentoringProjects = projects.filter(p => p.mentor === currentUser.email);
  const pendingRequests = mentoringProjects.filter(p => p.status === 'Pending');
  const activeProjects = mentoringProjects.filter(p => p.status !== 'Pending');

  return (
    <div>
      <h2 className="text-2xl mb-4">Mentor Dashboard</h2>
      
      {pendingRequests.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="card-title">Project Requests Requires Review</div>
          {pendingRequests.map(p => (
            <div key={p.id} className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)'}}>
              <div>
                <strong>{p.title}</strong>
                <p className="text-sm text-muted">Students: {p.students.join(', ')}</p>
                <p className="text-sm">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={() => {
                  setProjects(projects.map(proj => proj.id === p.id ? { ...proj, status: 'In Progress' } : proj));
                }}>Accept</button>
                <button className="btn btn-danger">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid-3">
        {activeProjects.map(project => {
          const progress = getProjectProgress(project.id);
          return (
            <div key={project.id} className="card">
              <div className="card-title">{project.title}</div>
              <p className="text-sm text-muted mb-4">Team: {project.students.join(', ')}</p>
              <div className="progress-container mb-4">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`badge ${project.status === 'Delayed' ? 'badge-danger' : 'badge-info'}`}>{project.status}</span>
                <span className="text-sm font-bold">{progress}% Complete</span>
              </div>
            </div>
          );
        })}
        {activeProjects.length === 0 && <p className="text-muted">No active projects yet.</p>}
      </div>
    </div>
  );
};

export default MentorOverview;
