import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import FeedbackThread from '../components/FeedbackThread';
import Timeline from '../components/Timeline';
import ProgressBar from '../components/ProgressBar';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateUpdateModal from '../components/CreateUpdateModal';

const ProjectDetail = () => {
  const { id }   = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingUpdate, setIsCreatingUpdate] = useState(false);
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    if (!user) return; 
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [projRes, taskRes, updateRes] = await Promise.all([
        axios.get(`/api/projects/${id}`, config),
        axios.get(`/api/tasks/${id}`, config),
        axios.get(`/api/updates?projectId=${id}`, config),
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setUpdates(updateRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/tasks/${taskId}/status`, { status: newStatus }, config);
      fetchProjectDetails();
    } catch (err) {
      console.error('Failed to update task status', err);
      alert('Failed to update task status');
    }
  };

  const handlePhaseChange = async (newPhase) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/projects/${id}/phase`, { phase: newPhase }, config);
      fetchProjectDetails();
    } catch (err) {
      console.error('Failed to update phase', err);
      alert('Failed to update phase');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjectDetails();
    }
  }, [id, user]);

  if (!user || loading) return <div className="loading-screen"><div className="spinner" /><span>Loading project details...</span></div>;
  if (!project) return <div className="loading-screen"><span>Project not found.</span></div>;

  const initials = (name) => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const projectProgress = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0;

  
  const isAtRisk = () => {
    if (project.status === 'completed') return false;
    const now = new Date();
    const due = new Date(project.deadline);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return (diffDays <= 7 && projectProgress < 50);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <button className="btn-ghost" onClick={() => navigate(-1)} style={{ width: 'auto', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Back to Dashboard
        </button>

        <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 className="page-title">{project.title}</h1>
              {isAtRisk() && <span className="badge badge-red" style={{ animation: 'pulse 2s infinite' }}>⚠️ At Risk</span>}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
              Reference ID: <code style={{ color: 'var(--text-muted)' }}>{project._id}</code>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {user.role === 'student' ? (
              <span className="badge badge-purple" style={{ padding: '0.5rem 1rem', background: 'var(--accent)20', color: 'var(--accent)' }}>Phase: {project.phase || 'Ideation'}</span>
            ) : (
              <select 
                value={project.phase || 'Ideation'} 
                onChange={(e) => handlePhaseChange(e.target.value)}
                className="badge"
                style={{ padding: '0.5rem 1rem', outline: 'none', cursor: 'pointer', appearance: 'auto', border: 'none', background: 'var(--accent)', color: 'white' }}
              >
                <option value="Ideation">Phase: Ideation</option>
                <option value="Implementation">Phase: Implementation</option>
                <option value="Report">Phase: Report</option>
                <option value="Completed">Phase: Completed</option>
              </select>
            )}
            <span className="badge badge-blue" style={{ padding: '0.5rem 1rem' }}>● {project.status}</span>
            <span className="badge badge-cyan" style={{ padding: '0.5rem 1rem' }}>v{project.activities?.filter(a => a.type === 'update_submitted').length + 1 || 1}.0</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div className="glass-card">
              <h3 className="section-title" style={{ marginBottom: '1rem' }}>Project Overview</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
                {project.description || 'No description provided.'}
              </p>
            </div>

            
            <div className="glass-card">
              <div className="section-header">
                <h3 className="section-title">Task & Contribution Tracking</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="badge badge-blue">{tasks.length} Total</span>
                  <button onClick={() => setIsCreatingTask(true)} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                    + Assign Task
                  </button>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Task Name</th>
                      <th>Assignee</th>
                      <th>Status</th>
                      <th>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(t => (
                      <tr key={t._id}>
                        <td style={{ fontWeight: '600' }}>{t.title}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>{t.assignedTo?.name?.charAt(0)}</div>
                            <span style={{ fontSize: '0.85rem' }}>{t.assignedTo?.name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td>
                          {t.assignedTo?._id === user._id || user.role !== 'student' ? (
                            <select 
                              value={t.status} 
                              onChange={(e) => handleTaskStatusChange(t._id, e.target.value)}
                              className={`badge ${t.status === 'completed' ? 'badge-green' : t.status === 'in-progress' ? 'badge-blue' : 'badge-yellow'}`}
                              style={{ outline: 'none', cursor: 'pointer', appearance: 'auto' }}
                            >
                              <option value="pending">pending</option>
                              <option value="in-progress">in-progress</option>
                              <option value="completed">completed</option>
                            </select>
                          ) : (
                            <span className={`badge ${t.status === 'completed' ? 'badge-green' : t.status === 'in-progress' ? 'badge-blue' : 'badge-yellow'}`}>{t.status}</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(t.deadline).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="glass-card">
              <div className="section-header">
                <h3 className="section-title">Project Submissions</h3>
                {user.role === 'student' && (
                  <button onClick={() => setIsCreatingUpdate(true)} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                    + Submit Work
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {updates.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No work submitted yet.</p>
                ) : (
                  updates.map(u => (
                    <div key={u._id} style={{ padding: '1rem', background: 'var(--bg-soft)', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{u.student?.name}</span>
                        <span className={`badge ${u.status === 'approved' ? 'badge-green' : u.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>{u.status}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{u.description}</p>
                      {u.fileLinks && u.fileLinks.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          {u.fileLinks.map((link, idx) => (
                            <a key={idx} href={link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline' }}>
                              Attachment {idx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                      {u.feedback && (
                        <div style={{ padding: '0.5rem', background: 'var(--bg-main)', borderRadius: '4px', borderLeft: '3px solid var(--accent)' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}><strong>Mentor Feedback:</strong> {u.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            
            <FeedbackThread 
              projectId={project._id} 
              comments={project.comments} 
              user={user} 
              onCommentAdded={(updatedProject) => setProject(updatedProject)} 
            />
          </div>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div className="glass-card" style={{ borderLeft: `4px solid ${isAtRisk() ? 'var(--danger)' : 'var(--primary)'}` }}>
              <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Current Progress</h3>
              <ProgressBar progress={projectProgress} height="12px" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{tasks.filter(t => t.status === 'completed').length}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</p>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{tasks.filter(t => t.status !== 'completed').length}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</p>
                </div>
              </div>
            </div>

            
            <Timeline activities={project.activities || []} />

            
            <div className="glass-card">
              <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Project Team</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.mentor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-soft)', borderRadius: 'var(--radius-md)' }}>
                    <div className="avatar" style={{ background: 'var(--primary)' }}>{initials(project.mentor.name)}</div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '700' }}>{project.mentor.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>Mentor</p>
                    </div>
                  </div>
                )}
                {(project.students || []).map(s => (
                  <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem' }}>
                    <div className="avatar">{initials(s.name)}</div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{s.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Student</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isCreatingTask && (
        <CreateTaskModal 
          project={project} 
          user={user} 
          onClose={() => setIsCreatingTask(false)} 
          onCreated={() => {
            setIsCreatingTask(false);
            fetchProjectDetails();
          }} 
        />
      )}

      {isCreatingUpdate && (
        <CreateUpdateModal 
          project={project} 
          tasks={tasks}
          user={user} 
          onClose={() => setIsCreatingUpdate(false)} 
          onCreated={() => {
            setIsCreatingUpdate(false);
            fetchProjectDetails();
          }} 
        />
      )}
    </div>
  );
};

export default ProjectDetail;
