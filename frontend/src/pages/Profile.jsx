import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <p className="page-greeting">Account Settings</p>
          <h1 className="page-title">My Profile</h1>
        </div>

        <div className="glass-card animate-in" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
            <div className="user-avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
              {initials}
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dark)' }}>{user.name}</h2>
              <p style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                {user.role}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={user.name} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" value={user.email} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Account Role</label>
              <input className="form-input" value={user.role} style={{ textTransform: 'capitalize' }} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <input className="form-input" value={user._id} readOnly style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ width: 'auto' }}>Update Profile</button>
            <button className="btn-ghost" style={{ width: 'auto' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
