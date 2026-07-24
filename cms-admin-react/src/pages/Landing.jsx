import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, ChevronRight, LayoutTemplate, Settings2, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-blue)', color: 'white', borderRadius: '0.5rem' }}>
            <LayoutDashboard size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>AiGENThix CMS</span>
        </div>
        <div>
          <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogIn size={18} />
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '0.25rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-accent-blue)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '2rem' }}>
          ✨ Version 2.0 Now Available
        </div>
        
        <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', maxWidth: '800px', letterSpacing: '-0.02em' }}>
          Manage your content with <span style={{ color: 'var(--color-accent-blue)' }}>unmatched elegance</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '3rem', maxWidth: '600px', lineHeight: '1.6' }}>
          A premium, professional, and lightning-fast headless CMS designed for modern teams. Take control of your websites and applications with ease.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
            Get Started <ChevronRight size={20} />
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '5rem 2rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Everything you need to scale</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Powerful features packed into a beautifully simple interface.</p>
          </div>

          <div className="grid grid-4 gap-lg">
            <div className="card card-hover" style={{ padding: '2rem' }}>
              <LayoutTemplate size={32} style={{ color: 'var(--color-accent-blue)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Dynamic Schemas</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Instantly adaptable forms tailored to your exact data models.</p>
            </div>
            <div className="card card-hover" style={{ padding: '2rem' }}>
              <Settings2 size={32} style={{ color: 'var(--color-accent-green)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Easy Management</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Drag and drop media, rich text editing, and powerful filtering.</p>
            </div>
            <div className="card card-hover" style={{ padding: '2rem' }}>
              <ShieldCheck size={32} style={{ color: 'var(--color-accent-purple)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Secure & Fast</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Built on modern web technologies ensuring your data is safe and fast.</p>
            </div>
             <div className="card card-hover" style={{ padding: '2rem' }}>
              <LayoutDashboard size={32} style={{ color: 'var(--color-accent-yellow)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Beautiful UI</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>A light, refreshing theme that looks professional and clean.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
