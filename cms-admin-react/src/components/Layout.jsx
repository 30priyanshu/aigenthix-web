import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { Auth } from '../services/auth';

const Layout = () => {
  const location = useLocation();
  const isAuthenticated = Auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine current section for header
  const getSectionName = () => {
    const path = location.pathname;
    if (path.includes('products')) return 'Products';
    if (path.includes('services')) return 'Services';
    if (path.includes('industries')) return 'Industries';
    if (path.includes('rd')) return 'R&D';
    if (path.includes('blogs')) return 'Blogs';
    return 'Universal CMS';
  };

  return (
    <div id="main-content">
      <TopHeader title={getSectionName()} onRefresh={() => window.location.reload()} />
      <main className="page-content" style={{ display: 'flex', gap: '2rem' }}>
        <Sidebar />
        <div style={{ flex: 1, paddingRight: '2rem', paddingBottom: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
