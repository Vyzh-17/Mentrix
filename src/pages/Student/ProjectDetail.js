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
  const activeProject = projects.find(p => p.id === parseInt(id));

  if (!activeProject) {
    return <div>Project not found.</div>;
  }

  const projectTasks = tasks.filter(t => t.projectId === activeProject.id);
  const progress = getProjectProgress(activeProject.id);
  const mySubmissions = submissions.filter(s => s.projectId === activeProject.id);

  const getTabClass = (path) => {
    // Determine active class based on current path
    const isExactOverview = location.pathname.endsWith(`/student/project/${id}`) && path === '';
    const isTabActive = location.pathname.includes(path) && path !== '';
    return isExactOverview || isTabActive ? 'badge badge-primary' : 'badge badge-neutral';
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="btn btn-outline" onClick={() => navigate('/student')}>← Back to Projects</button>
      </div>

      <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
           <h2 className="text-2xl m-0">{activeProject.title}</h2>
           <span className={`badge mt-2 ${activeProject.status === 'Pending' ? 'badge-warning' : 'badge-info'}`}>
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

      {/* Local Navigation Tabs */}
      <div className="flex gap-4 mb-8" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <Link to={`/student/project/${id}`} className={getTabClass('')} style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Overview
        </Link>
        <Link to={`/student/project/${id}/tasks`} className={getTabClass('tasks')} style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Tasks
        </Link>
        <Link to={`/student/project/${id}/submissions`} className={getTabClass('submissions')} style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Submissions
        </Link>
      </div>

      {/* Sub-Routes */}
      <Routes>
        <Route path="/" element={
          <ProjectOverview 
            activeProject={activeProject} 
            projectTasks={projectTasks} 
            progress={progress} 
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
