import React from 'react';

const MentorReview = ({ currentUser, projects, setProjects, submissions, setSubmissions }) => {
  const activeProjects = projects.filter(p => p.mentor === currentUser.email && p.status !== 'Pending');

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
                      <div>
                        <span className="text-sm font-bold">{s.filename}</span>
                        <span className={`badge ml-2 ${s.status === 'Approved' ? 'badge-success' : s.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {s.status}
                        </span>
                      </div>
                      
                      {s.status === 'Pending Review' && (
                        <div className="flex gap-2">
                          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--success)', color: 'var(--success)' }} onClick={() => {
                            setSubmissions(submissions.map(sub => sub.id === s.id ? { ...sub, status: 'Approved' } : sub));
                          }}>Approve</button>
                          
                          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => {
                            setSubmissions(submissions.map(sub => sub.id === s.id ? { ...sub, status: 'Rejected' } : sub));
                          }}>Reject</button>
                        </div>
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
};

export default MentorReview;
