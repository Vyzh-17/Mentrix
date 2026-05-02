import { useState } from 'react';
import axios from 'axios';

const Discussion = ({ type, id, comments, user, onCommentAdded }) => {
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`/api/${type}/${id}/comment`, { text }, config);
      setText('');
      onCommentAdded(data);
    } catch {
      alert('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const initials = (name) => (name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h3 className="section-title">💬 Discussion & Feedback</h3>
          <p className="section-subtitle">{(comments || []).length} message{(comments || []).length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Comment list */}
      <div style={{ marginBottom: '1.5rem', maxHeight: '360px', overflowY: 'auto' }}>
        {!comments || comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: 'var(--text-muted)',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--glass-border)',
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💭</p>
            <p style={{ fontSize: '0.875rem' }}>No discussions yet. Be the first to start!</p>
          </div>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-avatar">{initials(c.name)}</div>
              <div className="comment-bubble">
                <div className="comment-meta">
                  <span className="comment-author">{c.name}</span>
                  <span className="comment-date">{new Date(c.date).toLocaleString()}</span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="comment-avatar" style={{ marginBottom: '2px', flexShrink: 0 }}>
            {initials(user?.name)}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              className="form-input"
              placeholder="Write a message or feedback…"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
              style={{ resize: 'vertical', minHeight: '60px' }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !text.trim()}
            style={{ width: 'auto', padding: '0.7rem 1.25rem', fontSize: '0.875rem', alignSelf: 'flex-end' }}
          >
            {loading ? '…' : 'Send ↑'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Discussion;
