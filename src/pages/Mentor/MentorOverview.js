import React from 'react';

const MentorOverview = ({ currentUser, projects, setProjects, getProjectProgress }) => {
  const mentoringProjects = projects.filter(project => {
     return project.mentor === currentUser.email;
  });
  
  const pendingRequests = mentoringProjects.filter(project => {
     return project.status === 'Pending';
  });
  
  const activeProjects = mentoringProjects.filter(project => {
     return project.status !== 'Pending';
  });

  const handleProjectRequest = (projectId, newStatus) => {
    const updatedProjects = projects.map(proj => {
      if (proj.id === projectId) {
        return { ...proj, status: newStatus };
      }
      return proj;
    });
    setProjects(updatedProjects);
  };

  const getStatusColor = (status) => {
    if (status === 'Delayed') {
       return 'badge-danger';
    } 
    return 'badge-info';
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Mentor Dashboard</h2>
      
      {pendingRequests.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="card-title">Project Requests Requires Review</div>
          
          {pendingRequests.map(project => (
            <div key={project.id} className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)'}}>
              <div>
                <strong>{project.title}</strong>
                <p className="text-sm text-muted">Students: {project.students.join(', ')}</p>
                <p className="text-sm">{project.description}</p>
              </div>
              
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={() => handleProjectRequest(project.id, 'In Progress')}>
                  Accept
                </button>
                <button className="btn btn-danger" onClick={() => handleProjectRequest(project.id, 'Rejected')}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid-3 mt-8">
        {activeProjects.map(project => {
          const progressPercent = getProjectProgress(project.id);
          
          return (
            <div key={project.id} className="card">
              <div className="card-title">{project.title}</div>
              <p className="text-sm text-muted mb-4">
                Team: {project.students.join(', ')}
              </p>
              
              <div className="progress-container mb-4">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-sm font-bold">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>
          );
        })}
        
        {activeProjects.length === 0 && (
          <p className="text-muted">No active projects yet.</p>
        )}
      </div>
    </div>
  );
};

export default MentorOverview;
