import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Briefcase, FileText, FlaskConical, Users } from 'lucide-react';
import { Auth } from '../services/auth';

const Sidebar = () => {
  const user = Auth.getUser();
  const links = [
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Industries', path: '/admin/industries', icon: LayoutDashboard },
    { name: 'R&D', path: '/admin/rd', icon: FlaskConical },
  ];

  return (
    <aside className="sidebar" style={{ width: '250px', background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {user && user.role === 'super_admin' && (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Administration</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `btn btn-ghost ${isActive ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Users size={18} style={{ marginRight: '8px' }} />
                User Management
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `btn btn-ghost ${isActive ? 'active' : ''}`
                }
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <link.icon size={18} style={{ marginRight: '8px' }} />
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
