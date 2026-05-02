import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
  { key: 'student',     emoji: '🎓', label: 'Student' },
  { key: 'mentor',      emoji: '🧑‍🏫', label: 'Mentor' },
  { key: 'coordinator', emoji: '⚡', label: 'Coordinator' },
];

const Signup = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('student');
  const [section, setSection] = useState('');
  const [year, setYear]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role, section, year
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card animate-in">
        <div className="auth-logo">✨</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the P‑Track platform today</p>

        {/* Role Tabs - Simplified buttons for maximum robustness */}
        <div className="role-tabs">
          {ROLES.map(r => (
            <button
              key={r.key}
              type="button"
              className={`role-tab${role === r.key ? ' active' : ''}`}
              onClick={() => setRole(r.key)}
              style={{ cursor: 'pointer', zIndex: 5 }}
            >
              {r.emoji} {r.label}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="signup-name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="signup-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="signup-password"
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {(role === 'student' || role === 'coordinator') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Class Section</label>
                  <input
                    id="signup-section"
                    type="text"
                    className="form-input"
                    placeholder="e.g. A"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Class Year</label>
                  <input
                    id="signup-year"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2024"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    required
                  />
                </div>
            </div>
          )}

          <button
            id="signup-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Creating account…' : 'Get Started →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
