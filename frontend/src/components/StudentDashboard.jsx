import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import TaskList from './TaskList';
import ProgressBar from './ProgressBar';
import CreateProjectModal from './CreateProjectModal';

const StudentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [projRes, taskRes] = await Promise.all([
        axios.get('/api/projects', config),
        axios.get('/api/tasks/my-tasks', config)
      ]);
      setProjects(projRes.data || []);
      setTasks(taskRes.data || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]);

  if (loading) return <div className="loading-screen"><div className="spinner" /><span>Loading your space...</span></div>;

  // Simple overall progress calculation for all projects
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="animate-in">
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">My Learning Dashboard</h1>
          <p className="section-subtitle">Manage your projects and track your growth</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setIsCreating(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            + Create Project
          </button>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Progress</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>{overallProgress}%</p>
            </div>
            <div style={{ width: '100px' }}>
              <div className="progress-wrap" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn-ghost ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
          style={{ width: 'auto', border: activeTab === 'overview' ? '2px solid var(--primary)' : '' }}
        >
          Project Overview
        </button>
        <button 
          className={`btn-ghost ${activeTab === 'tasks' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tasks')}
          style={{ width: 'auto', border: activeTab === 'tasks' ? '2px solid var(--primary)' : '' }}
        >
          All My Tasks
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {projects.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📦</p>
              <h3 className="section-title">No projects assigned yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Contact your coordinator to get started.</p>
            </div>
          ) : (
            projects.map(p => (
              <ProjectCard 
                key={p._id} 
                project={{
                  ...p,
                  progress: p.progress || 0 // Use existing progress calculation
                }} 
                onClick={() => navigate(`/project/${p._id}`)}
              />
            ))
          )}
        </div>
      ) : (
        <TaskList tasks={tasks} currentUserId={user._id} />
      )}

      {isCreating && (
        <CreateProjectModal 
          user={user} 
          onClose={() => setIsCreating(false)} 
          onCreated={() => {
            setIsCreating(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
};

export default StudentDashboard;
