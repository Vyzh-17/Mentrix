import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import { useNavigate } from 'react-router-dom';

const CoordinatorDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/projects', config);
        setProjects(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user.token]);

  if (loading) return <div className="loading-screen"><div className="spinner" /><span>Analyzing data...</span></div>;

  // Logic: Analytics
  const completed = projects.filter(p => p.status === 'completed').length;
  const active    = projects.filter(p => p.status === 'active').length;
  
  // At Risk Logic
  const atRiskProjects = projects.filter(p => {
    if (p.status === 'completed') return false;
    const now = new Date();
    const due = new Date(p.deadline);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return (diffDays <= 7 && (p.progress || 0) < 50);
  });

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: '📊', color: 'var(--primary)' },
    { label: 'Completed',      value: completed,       icon: '✅', color: 'var(--success)' },
    { label: 'At Risk',         value: atRiskProjects.length, icon: '⚠️', color: 'var(--danger)' },
  ];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in">
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">
            Coordinator Analytics {user.section ? `- Section ${user.section}` : ''}
          </h1>
          <p className="section-subtitle">Real-time overview of your section's academic projects</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ color: s.color, background: `${s.color}15` }}>{s.icon}</div>
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Project Table */}
        <div className="glass-card">
          <div className="section-header">
            <h3 className="section-title">All Projects</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search..." 
                style={{ width: '200px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="form-input" 
                style={{ width: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="proposed">Proposed</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Mentor</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(p => (
                  <tr key={p._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/project/${p._id}`)}>
                    <td style={{ fontWeight: '700' }}>{p.title}</td>
                    <td>{p.mentor?.name}</td>
                    <td>
                      <span className={`badge ${p.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>{p.status}</span>
                    </td>
                    <td style={{ width: '120px' }}>
                      <ProgressBar progress={p.progress || 0} height="4px" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple Chart / Progress Distribution */}
        <div className="glass-card">
          <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Progress Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: '0-25%', count: projects.filter(p => (p.progress || 0) <= 25).length },
              { label: '26-50%', count: projects.filter(p => (p.progress || 0) > 25 && (p.progress || 0) <= 50).length },
              { label: '51-75%', count: projects.filter(p => (p.progress || 0) > 50 && (p.progress || 0) <= 75).length },
              { label: '76-100%', count: projects.filter(p => (p.progress || 0) > 75).length },
            ].map((range, i) => (
              <div key={i}>
                <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{range.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{range.count} projects</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-soft)', borderRadius: '4px' }}>
                  <div style={{ 
                    width: `${projects.length > 0 ? (range.count / projects.length) * 100 : 0}%`, 
                    height: '100%', 
                    background: 'var(--primary)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
