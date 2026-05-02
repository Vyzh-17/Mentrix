import React from 'react';
import { useParams, useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

import ProjectOverview from './ProjectOverview';
import ProjectTasks from './ProjectTasks';
import ProjectSubmissions from './ProjectSubmissions';

const ProjectDetail = ({ 
  currentUser, projects, tasks, setTasks, submissions, setSubmissions, getProjectProgress, isTaskOverdue 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const activeProject = projects.find(project => project.id === parseInt(id));

  if (!activeProject) {
    return <div>Project not found.</div>;
  }

  const projectTasks = tasks.filter(task => task.projectId === activeProject.id);
  const mySubmissions = submissions.filter(sub => sub.projectId === activeProject.id);
  const progressPercent = getProjectProgress(activeProject.id);

  const getStatusBadge = (status) => {
    if (status === 'Pending') return 'badge-warning';
    if (status === 'Delayed') return 'badge-danger';
    return 'badge-info';
  };

  const basePath = `/${currentUser.role}`;

  const getTabClass = (tabPath) => {
    const isExactOverview = location.pathname.endsWith(`${basePath}/project/${id}`) && tabPath === '';
    const isSubTabActive = location.pathname.includes(tabPath) && tabPath !== '';
    
    if (isExactOverview || isSubTabActive) {
      return 'badge badge-primary';
    } else {
      return 'badge badge-neutral';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="btn btn-outline" onClick={() => navigate(basePath)}>← Back to Dashboard</button>
      </div>

      <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
           <h2 className="text-2xl m-0">{activeProject.title}</h2>
           <span className={`badge mt-2 ${getStatusBadge(activeProject.status)}`}>
             Status: {activeProject.status}
           </span>
        </div>
        
        {activeProject.gitRepo && (
          <div>
            <a href={activeProject.gitRepo} target="_blank" rel="noreferrer" className="badge badge-neutral" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
              🔗 {activeProject.gitRepo}
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-8" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <Link to={`${basePath}/project/${id}`} className={getTabClass('')} style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Overview
        </Link>
        <Link to={`${basePath}/project/${id}/tasks`} className={getTabClass('tasks')} style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Tasks
        </Link>
        <Link to={`${basePath}/project/${id}/submissions`} className={getTabClass('submissions')} style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Submissions
        </Link>
      </div>

      <Routes>
        <Route path="/" element={
          <ProjectOverview 
            activeProject={activeProject} 
            projectTasks={projectTasks} 
            progress={progressPercent} 
          />
        } />
        
        <Route path="tasks" element={
          <ProjectTasks 
            currentUser={currentUser} 
            activeProject={activeProject} 
            tasks={tasks} 
            setTasks={setTasks} 
            projectTasks={projectTasks} 
            isTaskOverdue={isTaskOverdue} 
          />
        } />
        
        <Route path="submissions" element={
          <ProjectSubmissions 
            currentUser={currentUser}
            activeProject={activeProject} 
            submissions={submissions} 
            setSubmissions={setSubmissions} 
            mySubmissions={mySubmissions} 
          />
        } />
      </Routes>
    </div>
  );
};

export default ProjectDetail;
