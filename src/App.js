import React, { useState, useEffect } from 'react';
import './index.css';

// Data
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_SUBMISSIONS } from './data/mockData';

// Components
import { IconHome, IconFolder, IconCheckSquare, IconPlus } from './components/Icons';
import LoginModule from './modules/Auth/LoginModule';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Modules
import StudentDashboard from './modules/Student/StudentDashboard';
import MentorDashboard from './modules/Mentor/MentorDashboard';
import CoordinatorDashboard from './modules/Coordinator/CoordinatorDashboard';

function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [view, setView] = useState('dashboard');

  // Event Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setView('dashboard');
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

  // View Routing

  if (!currentUser) {
    return <LoginModule onLogin={handleLogin} />;
  }

  const getNavItems = () => {
    switch(currentUser.role) {
      case 'student': return [
        { id: 'dashboard', label: 'Dashboard', icon: <IconHome/> },
        { id: 'tasks', label: 'Task Management', icon: <IconCheckSquare/> },
        { id: 'submissions', label: 'Submissions', icon: <IconFolder/> },
        { id: 'create_project', label: 'Create New Project', icon: <IconPlus/> },
      ];
      case 'mentor': return [
        { id: 'dashboard', label: 'Mentorship Overview', icon: <IconHome/> },
        { id: 'review', label: 'Review & Feedback', icon: <IconCheckSquare/> },
      ];
      case 'coordinator': return [
        { id: 'dashboard', label: 'Monitoring Station', icon: <IconHome/> },
      ];
      default: return [];
    }
  };

  const renderModuleContent = () => {
    switch (currentUser.role) {
      case 'student':
        return (
          <StudentDashboard 
            currentUser={currentUser} projects={projects} setProjects={setProjects}
            tasks={tasks} setTasks={setTasks} submissions={submissions}
            setSubmissions={setSubmissions} view={view} getProjectProgress={getProjectProgress}
            isTaskOverdue={isTaskOverdue}
          />
        );
      case 'mentor':
        return (
          <MentorDashboard 
            currentUser={currentUser} projects={projects} setProjects={setProjects}
            submissions={submissions} setSubmissions={setSubmissions} view={view}
            getProjectProgress={getProjectProgress}
          />
        );
      case 'coordinator':
        return (
          <CoordinatorDashboard 
            currentUser={currentUser} projects={projects} view={view}
            getProjectProgress={getProjectProgress}
          />
        );
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar navItems={getNavItems()} view={view} setView={setView} />
      <main className="main-content">
        <Topbar currentUser={currentUser} onLogout={handleLogout} />
        <div className="page-content">
          {renderModuleContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
