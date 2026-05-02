import React, { useState } from 'react';
import axios from 'axios';

const FeedbackThread = ({ projectId, comments, user, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/projects/${projectId}/comment`, { text: newComment }, config);
      setNewComment('');
      onCommentAdded(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/projects/${projectId}/comment/${commentId}/reply`, { text: replyText[commentId] }, config);
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
      setActiveReplyId(null);
      onCommentAdded(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Discussion Thread</h3>
      
      {/* New Comment Input */}
      <form onSubmit={handleSubmitComment} style={{ marginBottom: '2rem' }}>
        <textarea
          className="form-input"
          placeholder="Share your feedback or ask a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ minHeight: '80px', marginBottom: '0.75rem' }}
        />
        <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Post Comment</button>
      </form>

      {/* Comment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(comments || []).map((comment) => (
          <div key={comment._id} className="comment-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="comment-avatar">{comment.name?.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div className="comment-meta">
                  <span className="comment-author">{comment.name}</span>
                  <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                
                <button 
                  className="btn-ghost" 
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', marginTop: '0.5rem', width: 'auto' }}
                  onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                >
                  Reply
                </button>

                {/* Replies */}
                {(comment.replies || []).length > 0 && (
                  <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--primary-bg2)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comment.replies.map((reply) => (
                      <div key={reply._id} style={{ display: 'flex', gap: '0.5rem' }}>
                        <div className="comment-avatar" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>{reply.name?.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div className="comment-meta">
                            <span className="comment-author" style={{ fontSize: '0.75rem' }}>{reply.name}</span>
                            <span className="comment-date" style={{ fontSize: '0.65rem' }}>{new Date(reply.date).toLocaleDateString()}</span>
                          </div>
                          <p className="comment-text" style={{ fontSize: '0.8rem' }}>{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {activeReplyId === comment._id && (
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      className="form-input"
                      placeholder="Write a reply..."
                      value={replyText[comment._id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [comment._id]: e.target.value }))}
                      style={{ minHeight: '60px', marginBottom: '0.5rem', fontSize: '0.85rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ width: 'auto', padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleSubmitReply(comment._id)}>Reply</button>
                      <button className="btn-ghost" style={{ width: 'auto', padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setActiveReplyId(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackThread;
