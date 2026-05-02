import React, { useState } from 'react';
import axios from 'axios';

const CreateTaskModal = ({ project, user, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedTo) {
      setError('Please assign this task to someone.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/tasks', {
        project: project._id,
        title,
        description,
        assignedTo,
        deadline
      }, config);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="glass-card animate-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Assign New Task</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>✕</button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Design Database Schema" />
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
            <label className="form-label">Assign To</label>
            <select className="form-input" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
              <option value="">-- Select Team Member --</option>
              {project.students?.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} {s._id === user._id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
