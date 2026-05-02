import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProjectModal = ({ user, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [selectedTeammates, setSelectedTeammates] = useState([]);

  const [mentors, setMentors] = useState([]);
  const [teammates, setTeammates] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Fetch mentors
        const mentorsRes = await axios.get('/api/auth/users?role=mentor', config);
        setMentors(mentorsRes.data || []);
        
        // Fetch section teammates
        if (user.section && user.year) {
            const teamRes = await axios.get(`/api/auth/users?role=student&section=${user.section}&year=${user.year}`, config);
            // Filter out the current user
            setTeammates(teamRes.data.filter(u => u._id !== user._id) || []);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
        setError('Failed to load mentors and teammates.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mentorId) {
      setError('Please select a mentor.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/projects', {
        title,
        description,
        mentor: mentorId,
        students: selectedTeammates,
        deadline
      }, config);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeammateToggle = (id) => {
    if (selectedTeammates.includes(id)) {
      setSelectedTeammates(selectedTeammates.filter(t => t !== id));
    } else {
      setSelectedTeammates([...selectedTeammates, id]);
    }
  };

  return (
    <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="glass-card animate-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Create New Project</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>✕</button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        {loadingData ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading required data...</div>
        ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input type="date" className="form-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Mentor</label>
                <select className="form-input" value={mentorId} onChange={(e) => setMentorId(e.target.value)} required>
                  <option value="">-- Select a Mentor --</option>
                  {mentors.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {teammates.length > 0 ? (
                  <div className="form-group">
                    <label className="form-label">Add Teammates (Section {user.section}, Year {user.year})</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {teammates.map(t => (
                            <label key={t._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedTeammates.includes(t._id)}
                                    onChange={() => handleTeammateToggle(t._id)}
                                />
                                {t.name}
                            </label>
                        ))}
                    </div>
                  </div>
              ) : (
                  <div className="form-group">
                      <label className="form-label">Add Teammates</label>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem', background: 'var(--bg-soft)', borderRadius: '4px' }}>
                          {(!user.section || !user.year)
                              ? "⚠️ You need a Class Section and Year to add teammates. If your account is older, you may need to sign up again."
                              : `ℹ️ No other students found in Section ${user.section} (${user.year}). Have your teammates sign up first to add them here.`}
                      </div>
                  </div>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default CreateProjectModal;
