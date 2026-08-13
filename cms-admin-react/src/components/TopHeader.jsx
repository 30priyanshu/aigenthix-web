import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Plus, RefreshCw, Key, X, Eye, EyeOff, Bell } from 'lucide-react';
import { Auth } from '../services/auth';
import { AuthApi, ActivitiesApi } from '../services/api';

const TopHeader = ({ title = 'CMS', onRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = Auth.getUser() || { email: 'Admin' };
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Fetch every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
      try {
          const data = await ActivitiesApi.getRecent();
          setActivities(data || []);
      } catch (e) {
          console.error("Failed to fetch activities", e);
      }
  };

  const markAllRead = async () => {
      try {
          await ActivitiesApi.markAllRead();
          setActivities(activities.map(a => ({...a, is_read: true})));
      } catch (e) {
          console.error(e);
      }
  };

  const handleLogout = () => {
    Auth.logout();
    navigate('/login');
  };

  const unreadCount = activities.filter(a => !a.is_read).length;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(passwordForm.new_password)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and a special character (@$!%*?&).');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await AuthApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      setPasswordSuccess('Password successfully updated!');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setIsPasswordModalOpen(false), 2000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <h1 className="header-title" style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>AiGENThix {title} Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-md" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button onClick={onRefresh} className="btn btn-icon btn-ghost" title="Refresh" style={{ color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <RefreshCw size={20} />
        </button>
        
            <div style={{ position: 'relative' }}>
                <button 
                    onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileDropdownOpen(false); }}
                    className="btn btn-icon btn-ghost" 
                    title="Notifications" 
                    style={{ position: 'relative', color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {unreadCount}
                        </span>
                    )}
                </button>

                {isNotificationOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '320px', zIndex: 50, overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--color-accent-blue)', fontSize: '0.75rem', cursor: 'pointer' }}>Mark all read</button>
                            )}
                        </div>
                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {activities.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No recent activity</div>
                            ) : (
                                activities.map(act => (
                                    <div key={act.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', background: act.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.05)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: act.is_read ? 400 : 600 }}>
                                                <strong style={{ color: 'var(--color-accent-blue)' }}>{act.user_name}</strong> {act.action.replace(/_/g, ' ')} {act.entity_type} <strong style={{ color: 'var(--color-text-primary)' }}>{act.entity_title}</strong>
                                            </span>
                                            {!act.is_read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: '4px' }}></div>}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                                            {new Date(act.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        
        {/* User Profile Info with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => { setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsNotificationOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--color-border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{user.name || user.email}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple)', textTransform: 'capitalize', fontWeight: 600 }}>
                {(user.role || 'Admin').replace('_', ' ')}
              </span>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-purple)', fontWeight: 'bold' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {isProfileDropdownOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minWidth: '180px', zIndex: 50, overflow: 'hidden' }}>
              <button 
                onClick={() => { setIsPasswordModalOpen(true); setIsProfileDropdownOpen(false); }}
                style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', textAlign: 'left' }}
              >
                <Key size={16} />
                Change Password
              </button>
              <button 
                onClick={() => { handleLogout(); setIsProfileDropdownOpen(false); }}
                style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    {isPasswordModalOpen && (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px', padding: '0' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={24} style={{ color: 'var(--color-accent-blue)' }} />
              Change Password
            </h2>
            <button onClick={() => setIsPasswordModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleChangePassword} style={{ padding: '2rem' }}>
            {passwordError && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{passwordSuccess}</div>}
            
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Old Password</label>
              <input type={showPasswords ? "text" : "password"} required className="form-input" value={passwordForm.old_password} onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})} style={{ paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">New Password</label>
              <input type={showPasswords ? "text" : "password"} required className="form-input" value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} style={{ paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.4 }}>
                Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.
              </p>
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Confirm New Password</label>
              <input type={showPasswords ? "text" : "password"} required className="form-input" value={passwordForm.confirm_password} onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})} style={{ paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default TopHeader;
