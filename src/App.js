import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_SUBMISSIONS } from './data/mockData';

import { IconHome, IconCheckSquare, IconPlus } from './components/Icons';
import LoginModule from './modules/Auth/LoginModule';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import ProjectsList from './pages/Student/ProjectsList';
import ProjectDetail from './pages/Student/ProjectDetail';
import CreateProject from './pages/Student/CreateProject';
import MentorOverview from './pages/Mentor/MentorOverview';
import MentorReview from './pages/Mentor/MentorReview';
import CoordinatorDashboard from './pages/Coordinator/CoordinatorDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    
    if (projectTasks.length === 0) {
      return 0;
    }
    
    const completedTasks = projectTasks.filter(task => task.status === 'Completed').length;
    const percentage = (completedTasks / projectTasks.length) * 100;
    return Math.round(percentage);
  };

  const isTaskOverdue = (task) => {
    if (task.status === 'Completed') {
      return false;
    }
    
    const todayDate = new Date('2023-11-01'); 
    const taskDeadline = new Date(task.deadline);
    return taskDeadline < todayDate;
  };

  const getSidebarLinks = () => {
    if (currentUser.role === 'student') {
      return [
        { id: 'projects', path: '/student', label: 'Projects', icon: <IconHome/> },
        { id: 'create_project', path: '/student/project/create', label: 'Create New Project', icon: <IconPlus/> },
      ];
    } 
    
    if (currentUser.role === 'mentor') {
      return [
        { id: 'dashboard', path: '/mentor', label: 'Mentorship Overview', icon: <IconHome/> },
        { id: 'review', path: '/mentor/review', label: 'Review & Feedback', icon: <IconCheckSquare/> },
      ];
    } 
    
    if (currentUser.role === 'coordinator') {
      return [
        { id: 'dashboard', path: '/coordinator', label: 'Monitoring Station', icon: <IconHome/> },
      ];
    }
    
    return [];
  };

  useEffect(() => {
    const updatedProjects = projects.map(project => {
      if (project.status === 'Pending') {
         return project;
      }
      
      const thisProjectTasks = tasks.filter(t => t.projectId === project.id);
      const hasOverdueTask = thisProjectTasks.some(isTaskOverdue);
      
      if (hasOverdueTask && project.status !== 'Delayed') {
        return { ...project, status: 'Delayed' };
      } else if (!hasOverdueTask && project.status === 'Delayed') {
        return { ...project, status: 'In Progress' };
      }
      
      return project;
    });
    
    const hasChanges = projects.some((p, i) => p.status !== updatedProjects[i].status);
    if (hasChanges) {
       setProjects(updatedProjects);
    }
  }, [tasks, projects]);

  if (!currentUser) {
    return <LoginModule onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar navItems={getSidebarLinks()} />
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
