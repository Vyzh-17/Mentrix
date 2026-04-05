import React from 'react';

const MentorDashboard = ({ currentUser, projects, setProjects, submissions, setSubmissions, view, getProjectProgress }) => {
  const mentoringProjects = projects.filter(p => p.mentor === currentUser.email);
  const pendingRequests = mentoringProjects.filter(p => p.status === 'Pending');
  const activeProjects = mentoringProjects.filter(p => p.status !== 'Pending');

  if (view === 'dashboard') {
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
                <div className="card-title">
                  {project.title}
                </div>
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
  }

  if (view === 'review') {
    return (
      <div>
        <h2 className="text-2xl mb-4">Review & Feedback Module</h2>
        {activeProjects.length === 0 && <p className="text-muted">No active projects available for review.</p>}
        {activeProjects.map(project => (
          <div key={project.id} className="card">
            <div className="card-title">Project: {project.title} | Current Phase: {project.milestone}</div>
            
            <div className="grid-2">
              <div>
                <h4 className="mb-4">Recent Submissions</h4>
                {submissions.filter(s => s.projectId === project.id).length === 0 && (
                   <p className="text-sm text-muted">No submissions available.</p>
                )}
                 <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {submissions.filter(s => s.projectId === project.id).map(s => (
                     <li key={s.id} className="flex justify-between items-center mb-4 bg-main" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)'}}>
                        <span className="text-sm">{s.filename} ({s.status})</span>
                        {s.status === 'Pending Review' && (
                          <button className="btn btn-outline" style={{ padding: '0.25rem', fontSize: '0.75rem' }} onClick={() => {
                             setSubmissions(submissions.map(sub => sub.id === s.id ? { ...sub, status: 'Approved' } : sub));
                          }}>Approve</button>
                        )}
                     </li>
                  ))}
                 </ul>
              </div>
              
              <div>
                <h4 className="mb-4">Provide Feedback</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fb = new FormData(e.target).get('feedback');
                  const ms = new FormData(e.target).get('milestone');
                  setProjects(projects.map(p => p.id === project.id ? { ...p, feedback: fb, milestone: ms } : p));
                  alert("Feedback sent to students!");
                }}>
                  <div className="form-group">
                    <label>Update Milestone</label>
                    <select name="milestone" className="form-control" defaultValue={project.milestone}>
                      <option>Ideation & Planning</option>
                      <option>Implementation</option>
                      <option>Report & Documentation</option>
                      <option>Final Submission</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comments / Feedback</label>
                    <textarea name="feedback" className="form-control" rows="3" defaultValue={project.feedback} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Submit Evaluation</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default MentorDashboard;
