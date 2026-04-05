import React, { useState } from 'react';
import { IconMenu } from '../../components/Icons';
import { INITIAL_USERS } from '../../data/mockData';

const LoginModule = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = {
      role: formData.get('role'),
      name: formData.get('name'),
      email: formData.get('email'),
      department: formData.get('department'),
      year: formData.get('year'),
      section: formData.get('section'),
    };
    onLogin(user);
  };

  const handleQuickLogin = (user) => {
    onLogin(user);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header" style={{ marginBottom: '1rem' }}>
          <IconMenu /> Mentrix Log In
        </div>

        {/* Quick Login Section */}
        <div style={{ backgroundColor: 'var(--secondary-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div className="text-sm font-bold text-muted mb-4 text-center">Quick Login (Mock Users)</div>
          <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {INITIAL_USERS.map((user, idx) => (
              <button 
                key={idx} 
                type="button" 
                className="btn btn-outline" 
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'white' }}
                onClick={() => handleQuickLogin(user)}
              >
                {user.name} ({user.role})
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-muted mb-4">--- OR CUSTOM LOGIN ---</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Role</label>
            <select name="role" className="form-control" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="coordinator">Project Coordinator</option>
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="e.g. Alice Johnson" required />
            </div>
            <div className="form-group">
              <label>Institutional Email</label>
              <input type="email" name="email" className="form-control" placeholder="e.g. alice@uni.edu" required />
            </div>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select name="department" className="form-control" required>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Year</label>
              <select name="year" className="form-control" defaultValue="Senior">
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
              </select>
            </div>
            <div className="form-group">
              <label>Section</label>
              <input type="text" name="section" className="form-control" defaultValue="A" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem', padding: '0.75rem' }}>
            Enter Custom Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModule;
