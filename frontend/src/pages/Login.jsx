import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
  { key: 'student',     emoji: '🎓', label: 'Student' },
  { key: 'mentor',      emoji: '🧑‍🏫', label: 'Mentor' },
  { key: 'coordinator', emoji: '⚡', label: 'Coordinator' },
];

const Login = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', {
        email,
        password,
        role,
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card animate-in">
        <div className="auth-logo">🚀</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Mentrix account</p>

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
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
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
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
