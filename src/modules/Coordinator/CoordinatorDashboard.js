import React from 'react';
import { IconAlertTriangle } from '../../components/Icons';

const CoordinatorDashboard = ({ currentUser, projects, view, getProjectProgress }) => {
  const scopeProjects = projects.filter(p => p.department === currentUser.department && p.year === currentUser.year && p.section === currentUser.section);

  if (view === 'dashboard') {
    const avgProgress = scopeProjects.length > 0 
      ? scopeProjects.reduce((acc, curr) => acc + getProjectProgress(curr.id), 0) / scopeProjects.length 
      : 0;

    const delayedCount = scopeProjects.filter(p => p.status === 'Delayed').length;

    return (
      <div>
        <h2 className="text-2xl mb-4">Coordinator Overview</h2>
        <p className="text-muted mb-4">Scope: {currentUser.department} | {currentUser.year} | Section {currentUser.section}</p>

        <div className="grid-3">
          <div className="card">
             <div className="card-title">Monitored Projects</div>
             <p className="text-2xl">{scopeProjects.length}</p>
          </div>
          <div className="card">
             <div className="card-title">Average Progress</div>
             <p className="text-2xl">{avgProgress.toFixed(1)}%</p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
             <div className="card-title">Delayed Projects Identified</div>
             <p className="text-2xl text-danger">{delayedCount}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            Project Registry & Delay Detection
            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
               <IconAlertTriangle/> Auto-Scan Active
            </span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title & Mentor</th>
                  <th>Students</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scopeProjects.map(p => {
                  const progress = getProjectProgress(p.id);
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong><br/><span className="text-sm text-muted">{p.mentor}</span></td>
                      <td>{p.students.join(', ')}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <div className="progress-container" style={{ width: '100px', margin: 0 }}>
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-sm">{progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'Delayed' ? 'badge-danger' : p.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {scopeProjects.length === 0 && <tr><td colSpan="4">No projects under your jurisdiction yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CoordinatorDashboard;
