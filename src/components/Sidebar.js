import React from 'react';
import { IconMenu } from './Icons';

const Sidebar = ({ navItems, view, setView }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <IconMenu />
        </div>
        Mentrix
      </div>
      <nav className="nav-menu">
        {navItems.map(item => (
          <div 
            key={item.id} 
            className={`nav-item ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
