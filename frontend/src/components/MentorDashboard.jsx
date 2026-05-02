import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';

const MentorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [updates, setUpdates]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [projRes, updateRes] = await Promise.all([
        axios.get('http://localhost:5000/api/projects', config),
        axios.get('http://localhost:5000/api/updates', config),
      ]);
      setProjects(projRes.data || []);
      setUpdates(updateRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]);

  const handleFeedback = async (updateId, status) => {
    let feedback = '';
    if (status === 'rejected') {
      feedback = window.prompt("Please provide feedback for what needs correction:");
      if (feedback === null) return; // cancelled
    } else {
      feedback = window.prompt("Optional feedback (or leave blank):") || '';
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/updates/${updateId}/feedback`, { status, feedback }, config);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Failed to submit feedback', err);
      alert('Failed to submit feedback');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /><span>Loading mentor hub...</span></div>;

  const pendingUpdates = updates.filter(u => u.status === 'submitted');
  const totalMentees = new Set(projects.flatMap(p => p.students?.map(s => s._id) || [])).size;

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: '📂', color: 'var(--primary)' },
    { label: 'Total Mentees',   value: totalMentees,     icon: '👥', color: 'var(--accent)' },
    { label: 'Pending Reviews', value: pendingUpdates.length, icon: '⏳', color: 'var(--warning)' },
  ];

  return (
    <div className="animate-in">
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">Mentor Hub</h1>
          <p className="section-subtitle">Manage your mentees and review their progress</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ color: s.color, background: `${s.color}15` }}>{s.icon}</div>
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn-ghost ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')} style={{ width: 'auto' }}>My Projects</button>
        <button className={`btn-ghost ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')} style={{ width: 'auto' }}>Pending Reviews ({pendingUpdates.length})</button>
      </div>

      {activeTab === 'projects' ? (
        <div className="glass-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Completion</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/project/${p._id}`)}>
                    <td style={{ fontWeight: '700' }}>{p.title}</td>
                    <td>{p.students?.length || 0} students</td>
                    <td><span className="badge badge-blue">{p.status}</span></td>
                    <td style={{ width: '180px' }}>
                      <ProgressBar progress={p.progress || 0} height="6px" showLabel={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {pendingUpdates.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>All clear! No pending reviews. 🚀</p>
            </div>
          ) : (
            pendingUpdates.map(u => (
              <div key={u._id} className="glass-card">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="avatar">{u.student?.name?.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight: '700' }}>{u.student?.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.project?.title}</p>
                    </div>
                  </div>
                  <span className="badge badge-yellow">v{updates.filter(up => up.project?._id === u.project?._id).length}</span>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{u.description}</p>
                {u.fileLinks && u.fileLinks.length > 0 && (
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    {u.fileLinks.map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline' }}>View File {idx+1}</a>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleFeedback(u._id, 'approved')} className="btn-primary" style={{ width: 'auto' }}>Approve</button>
                  <button onClick={() => handleFeedback(u._id, 'rejected')} className="btn-ghost" style={{ width: 'auto', color: 'var(--danger)' }}>Needs Correction</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
