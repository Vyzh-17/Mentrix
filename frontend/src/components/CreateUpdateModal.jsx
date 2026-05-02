import React, { useState } from 'react';
import axios from 'axios';

const CreateUpdateModal = ({ project, tasks, user, onClose, onCreated }) => {
  const [description, setDescription] = useState('');
  const [fileLinks, setFileLinks] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      setError('Please provide a description of the work submitted.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Convert comma-separated links to array and trim whitespace
      const linksArray = fileLinks.split(',').map(link => link.trim()).filter(link => link);
      
      const payload = {
        project: project._id,
        description,
        fileLinks: linksArray
      };
      if (selectedTask) payload.task = selectedTask;

      await axios.post('/api/updates', payload, config);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit update.');
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
          <h2 className="section-title" style={{ margin: 0 }}>Submit Work / Update</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>✕</button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Related Task (Optional)</label>
            <select className="form-input" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
              <option value="">-- General Project Update --</option>
              {tasks?.map(t => (
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Notes</label>
            <textarea 
              className="form-input" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows={4}
              placeholder="Describe what you completed, e.g., 'Finished the final presentation draft.'"
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">File Links (Google Drive, GitHub, etc.)</label>
            <input 
              type="text" 
              className="form-input" 
              value={fileLinks} 
              onChange={(e) => setFileLinks(e.target.value)} 
              placeholder="https://drive.google.com/..., https://github.com/..." 
            />
            <small style={{ color: 'var(--text-muted)' }}>Separate multiple links with commas.</small>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateModal;
