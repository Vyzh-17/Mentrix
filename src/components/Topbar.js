import React from 'react';
import { IconLogOut } from './Icons';

const Topbar = ({ currentUser, onLogout }) => {
  return (
    <header className="topbar">
      <div className="text-muted text-sm font-medium">Session Active • 2023-2024</div>
      <div className="user-profile">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
          <div className="text-sm text-muted" style={{ textTransform: 'capitalize' }}>{currentUser.role}</div>
        </div>
        <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={onLogout} title="Log Out">
          <IconLogOut />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
