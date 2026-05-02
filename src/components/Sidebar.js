import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IconMenu } from './Icons';

const Sidebar = ({ navItems }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <IconMenu />
        </div>
        Mentrix
      </div>
      <nav className="nav-menu">
        {navItems.map(item => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'));
          return (
            <Link 
              key={item.id} 
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
