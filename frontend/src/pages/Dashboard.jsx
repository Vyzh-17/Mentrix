import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StudentDashboard from '../components/StudentDashboard';
import MentorDashboard from '../components/MentorDashboard';
import CoordinatorDashboard from '../components/CoordinatorDashboard';

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !localStorage.getItem('userInfo')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span style={{ marginTop: '1rem', fontWeight: '600' }}>Initializing session...</span>
      </div>
    );
  }

  const renderDashboard = () => {
    try {
      switch (user.role) {
        case 'student':     return <StudentDashboard user={user} />;
        case 'mentor':      return <MentorDashboard user={user} />;
        case 'coordinator': return <CoordinatorDashboard user={user} />;
        default:            return <div className="glass-card">Role not recognized: {user.role}</div>;
      }
    } catch (err) {
      console.error('Dashboard Render Error:', err);
      return <div className="glass-card">Error loading dashboard features. Please try refreshing.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <p className="page-greeting">{greetingByHour()}</p>
          <h1 className="page-title">Welcome back, {user.name || 'User'} 👋</h1>
        </div>
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
