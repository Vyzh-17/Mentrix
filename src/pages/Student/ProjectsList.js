import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsList = ({ currentUser, projects, tasks, getProjectProgress }) => {
  const navigate = useNavigate();

  const studentProjects = projects.filter(project => {
     return project.students.includes(currentUser.email);
  });

  const totalProjects = studentProjects.length;
  const userPendingTasks = tasks.filter(task => {
    const isAssignedToMe = task.assignee === currentUser.email;
    const isNotDone = task.status !== 'Completed';
    return isAssignedToMe && isNotDone;
  }).length;
  
  const delayedProjects = studentProjects.filter(project => project.status === 'Delayed').length;

  const getStatusBadge = (status) => {
    if (status === 'Delayed') return 'badge-danger'; 
    if (status === 'Pending') return 'badge-warning'; 
    if (status === 'Completed') return 'badge-success'; 
    return 'badge-info'; 
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Student Dashboard</h2>
        <button className="btn btn-primary" onClick={() => navigate('/student/project/create')}>+ New Project</button>
      </div>

      <div className="hero-banner mb-4">
        <div className="hero-stats-grid">
           <div className="hero-stat-card">
             <div className="hero-stat-title">Total Projects</div>
             <div className="hero-stat-value">{totalProjects}</div>
           </div>
           
           <div className="hero-stat-card">
             <div className="hero-stat-title">My Pending Tasks</div>
             <div className="hero-stat-value">{userPendingTasks}</div>
           </div>
           
           <div className="hero-stat-card" style={delayedProjects > 0 ? { borderLeft: '4px solid #fca5a5' } : {}}>
             <div className="hero-stat-title">Projects Delayed</div>
             <div className="hero-stat-value" style={delayedProjects > 0 ? { color: '#fca5a5' } : {}}>
                {delayedProjects}
             </div>
           </div>
        </div>
      </div>

      <div className="grid-3 mt-4">
        {studentProjects.map(project => {
          const progressPercent = getProjectProgress(project.id);
          
          return (
            <div 
              key={project.id} 
              className="card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border-color)' }}
              onClick={() => navigate(`/student/project/${project.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-title">{project.title}</div>
              <p className="text-sm text-muted mb-4">
                Status: <span className={`badge ${getStatusBadge(project.status)}`}>{project.status}</span>
              </p>
              
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm">
                 <span className="text-muted">Phase: {project.milestone}</span>
                 <span className="font-bold">{progressPercent}% Complete</span>
              </div>
            </div>
          );
        })}
        
        {studentProjects.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p className="text-muted mb-4">You have no active projects.</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/project/create')}>Initialize One</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
