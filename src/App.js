import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Data
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_SUBMISSIONS } from './data/mockData';

// Components
import { IconHome, IconCheckSquare, IconPlus } from './components/Icons';
import LoginModule from './modules/Auth/LoginModule';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import ProjectsList from './pages/Student/ProjectsList';
import ProjectDetail from './pages/Student/ProjectDetail';
import CreateProject from './pages/Student/CreateProject';

import MentorOverview from './pages/Mentor/MentorOverview';
import MentorReview from './pages/Mentor/MentorReview';

import CoordinatorDashboard from './pages/Coordinator/CoordinatorDashboard';

function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);

  // Event Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Business Logic
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(t => t.status === 'Completed').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const isTaskOverdue = (task) => {
    if (task.status === 'Completed') return false;
    const today = new Date('2023-11-01'); // Fixed simulated date
    const deadline = new Date(task.deadline);
    return deadline < today;
  };

  // Real-time status update monitor
  useEffect(() => {
    const updatedProjects = projects.map(p => {
      if (p.status === 'Pending') return p;
      const pTasks = tasks.filter(t => t.projectId === p.id);
      const hasOverdue = pTasks.some(isTaskOverdue);
      if (hasOverdue && p.status !== 'Delayed') {
        return { ...p, status: 'Delayed' };
      } else if (!hasOverdue && p.status === 'Delayed') {
        return { ...p, status: 'In Progress' };
      }
      return p;
    });
    
    const hasChanges = projects.some((p, i) => p.status !== updatedProjects[i].status);
    if (hasChanges) setProjects(updatedProjects);
  }, [tasks, projects]);

  if (!currentUser) {
    return <LoginModule onLogin={handleLogin} />;
  }

  const getNavItems = () => {
    switch(currentUser.role) {
      case 'student': return [
        { id: 'projects', path: '/student', label: 'Projects', icon: <IconHome/> },
        { id: 'create_project', path: '/student/project/create', label: 'Create New Project', icon: <IconPlus/> },
      ];
      case 'mentor': return [
        { id: 'dashboard', path: '/mentor', label: 'Mentorship Overview', icon: <IconHome/> },
        { id: 'review', path: '/mentor/review', label: 'Review & Feedback', icon: <IconCheckSquare/> },
      ];
      case 'coordinator': return [
        { id: 'dashboard', path: '/coordinator', label: 'Monitoring Station', icon: <IconHome/> },
      ];
      default: return [];
    }
  };

  return (
    <div className="app-container">
      <Sidebar navItems={getNavItems()} />
      <main className="main-content">
        <Topbar currentUser={currentUser} onLogout={handleLogout} />
        <div className="page-content">
          <Routes>
            {currentUser.role === 'student' && (
              <>
                <Route path="/student" element={
                  <ProjectsList 
                    currentUser={currentUser} 
                    projects={projects} 
                    tasks={tasks}
                    getProjectProgress={getProjectProgress} 
                  />
                } />
                <Route path="/student/project/create" element={
                  <CreateProject 
                    currentUser={currentUser} 
                    projects={projects} 
                    setProjects={setProjects} 
                  />
                } />
                <Route path="/student/project/:id/*" element={
                  <ProjectDetail 
                    currentUser={currentUser} 
                    projects={projects} 
                    tasks={tasks}
                    setTasks={setTasks}
                    submissions={submissions}
                    setSubmissions={setSubmissions}
                    getProjectProgress={getProjectProgress}
                    isTaskOverdue={isTaskOverdue}
                  />
                } />
                <Route path="*" element={<Navigate to="/student" replace />} />
              </>
            )}

            {currentUser.role === 'mentor' && (
              <>
                <Route path="/mentor" element={
                  <MentorOverview 
                    currentUser={currentUser} 
                    projects={projects} 
                    setProjects={setProjects} 
                    getProjectProgress={getProjectProgress} 
                  />
                } />
                <Route path="/mentor/review" element={
                  <MentorReview 
                    currentUser={currentUser} 
                    projects={projects} 
                    setProjects={setProjects} 
                    submissions={submissions}
                    setSubmissions={setSubmissions}
                  />
                } />
                <Route path="*" element={<Navigate to="/mentor" replace />} />
              </>
            )}

            {currentUser.role === 'coordinator' && (
              <>
                <Route path="/coordinator" element={
                  <CoordinatorDashboard 
                    currentUser={currentUser} 
                    projects={projects} 
                    getProjectProgress={getProjectProgress} 
                  />
                } />
                <Route path="*" element={<Navigate to="/coordinator" replace />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
