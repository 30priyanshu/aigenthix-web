import React, { useState, useEffect } from 'react';
import { UsersApi } from '../services/api';
import { Auth } from '../services/auth';
import { Shield, Plus, X, User, Mail, ShieldAlert, Check, MailCheck, AlertCircle, Key, Eye, EyeOff, Users, ChevronDown, ChevronRight } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingRoles, setPendingRoles] = useState({});
    const [visiblePasswords, setVisiblePasswords] = useState({});
    
    // Tab State for Super Admin
    const [activeTab, setActiveTab] = useState('management'); // 'management', 'teams'
    
    // Accordion state for grouping
    const [expandedTeams, setExpandedTeams] = useState({});

    // Modal State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'editor'
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await UsersApi.getAll();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleSendAccess = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await UsersApi.sendAccess(formData);
            setSubmitSuccess(true);
            fetchUsers();
            setTimeout(() => {
                setSubmitSuccess(false);
                setIsModalOpen(false);
                setFormData({ name: '', email: '', role: 'editor' });
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to send access');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await UsersApi.delete(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert(err.message || 'Failed to delete user');
        }
    };

    const toggleStatus = async (id, isActive) => {
        try {
            await UsersApi.update(id, { is_active: !isActive });
            setUsers(users.map(u => u.id === id ? { ...u, is_active: !isActive } : u));
        } catch (err) {
            alert(err.message || 'Failed to update status');
        }
    };

    const handleConfirmRoleChange = async (id, newRole) => {
        try {
            await UsersApi.update(id, { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            setPendingRoles(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        } catch (err) {
            alert(err.message || 'Failed to update role');
        }
    };

    const handleCancelRoleChange = (id) => {
        setPendingRoles(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const toggleTeam = (subAdminId) => {
        setExpandedTeams(prev => ({
            ...prev,
            [subAdminId]: !prev[subAdminId]
        }));
    };

    if (loading && users.length === 0) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--color-text-primary)' }}>Loading users...</div>;
    }

    const currentUser = Auth.getUser();
    const isSuperAdmin = currentUser?.role === 'super_admin';
    const isSubAdmin = currentUser?.role === 'sub_admin';

    // Grouping Logic
    const managementUsers = users.filter(u => u.role === 'super_admin' || u.role === 'sub_admin');
    const editors = users.filter(u => u.role === 'editor');
    
    // Group editors by creator
    const editorsByCreator = {};
    editors.forEach(ed => {
        const creatorId = ed.created_by || 'unknown';
        if (!editorsByCreator[creatorId]) editorsByCreator[creatorId] = [];
        editorsByCreator[creatorId].push(ed);
    });

    const getCreatorInfo = (creatorId) => {
        if (creatorId === 'unknown') return { name: 'Unknown / System', role: 'system' };
        const creator = users.find(u => u.id === parseInt(creatorId));
        return creator ? { name: creator.name || 'Unnamed', role: creator.role, id: creator.id } : { name: `User #${creatorId}`, role: 'unknown' };
    };

    // Shared Table Row Renderer
    const renderUserRow = (user) => (
        <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div>
                        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{user.name || 'Unnamed User'}</div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{user.email}</div>
                    </div>
                </div>
            </td>
            <td style={{ padding: '1rem 1.5rem' }}>
                {isSuperAdmin ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select 
                            value={pendingRoles[user.id] || user.role} 
                            onChange={(e) => setPendingRoles({...pendingRoles, [user.id]: e.target.value})}
                            style={{ 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '8px', 
                                border: '1px solid var(--color-border)', 
                                background: 'var(--color-bg-primary)', 
                                color: 'var(--color-text-primary)',
                                fontSize: '0.875rem'
                            }}
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="sub_admin">Sub Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        {pendingRoles[user.id] && pendingRoles[user.id] !== user.role && (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button 
                                    onClick={() => handleConfirmRoleChange(user.id, pendingRoles[user.id])}
                                    style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }}
                                    title="Confirm"
                                >
                                    <Check size={16} />
                                </button>
                                <button 
                                    onClick={() => handleCancelRoleChange(user.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }}
                                    title="Cancel"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: user.role === 'super_admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: user.role === 'super_admin' ? '#c084fc' : '#60a5fa'
                    }}>
                        {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                )}
            </td>
            <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                {isSuperAdmin ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{visiblePasswords[user.id] ? (user.last_password_cleartext || 'Hidden') : '********'}</span>
                        <button 
                            onClick={() => setVisiblePasswords(prev => ({...prev, [user.id]: !prev[user.id]}))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '0', display: 'flex', alignItems: 'center' }}
                            title={visiblePasswords[user.id] ? "Hide Password" : "Show Password"}
                        >
                            {visiblePasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                ) : '********'}
            </td>
            <td style={{ padding: '1rem 1.5rem' }}>
                <button 
                    onClick={() => toggleStatus(user.id, user.is_active)}
                    disabled={isSubAdmin && user.role !== 'editor'}
                    style={{ 
                        background: 'transparent',
                        border: 'none',
                        cursor: (isSubAdmin && user.role !== 'editor') ? 'not-allowed' : 'pointer',
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        backgroundColor: user.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: user.is_active ? '#4ade80' : '#ef4444',
                        opacity: (isSubAdmin && user.role !== 'editor') ? 0.5 : 1
                    }}
                >
                    {user.is_active ? 'Active' : 'Inactive'}
                </button>
            </td>
            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                {currentUser?.sub !== String(user.id) && (isSuperAdmin || (isSubAdmin && user.role === 'editor')) && (
                    <button 
                        onClick={() => handleDelete(user.id)}
                        className="btn"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem' }}
                    >
                        Delete
                    </button>
                )}
            </td>
        </tr>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Shield size={28} style={{ color: 'var(--color-accent-blue)' }} />
                        User Management
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', margin: '0.5rem 0 0 0' }}>
                        {isSuperAdmin ? "Manage administrators and their editor teams." : "Manage your team of editors."}
                    </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', color: 'white' }}
                >
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            {error && !isModalOpen && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {isSuperAdmin ? (
                // SUPER ADMIN DASHBOARD
                <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <button 
                            onClick={() => setActiveTab('management')}
                            style={{
                                background: activeTab === 'management' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: activeTab === 'management' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                border: '1px solid',
                                borderColor: activeTab === 'management' ? 'var(--color-border)' : 'transparent',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <Shield size={18} />
                            Management Team
                        </button>
                        <button 
                            onClick={() => setActiveTab('teams')}
                            style={{
                                background: activeTab === 'teams' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: activeTab === 'teams' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                border: '1px solid',
                                borderColor: activeTab === 'teams' ? 'var(--color-border)' : 'transparent',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <Users size={18} />
                            Editor Teams
                        </button>
                    </div>

                    {activeTab === 'management' && (
                        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Administrator</th>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Role</th>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Current Password</th>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status</th>
                                        <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managementUsers.map(renderUserRow)}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.keys(editorsByCreator).length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)', background: 'var(--color-bg-secondary)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                    No editors found. Sub Admins can start adding their teams!
                                </div>
                            ) : (
                                Object.entries(editorsByCreator).map(([creatorId, teamEditors]) => {
                                    const creator = getCreatorInfo(creatorId);
                                    const isExpanded = expandedTeams[creatorId] !== false; // Default to true

                                    return (
                                        <div key={creatorId} style={{ background: 'var(--color-bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                            <div 
                                                onClick={() => toggleTeam(creatorId)}
                                                style={{ 
                                                    padding: '1rem 1.5rem', 
                                                    background: 'rgba(255,255,255,0.02)', 
                                                    borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    {isExpanded ? <ChevronDown size={20} color="var(--color-text-secondary)" /> : <ChevronRight size={20} color="var(--color-text-secondary)" />}
                                                    <div>
                                                        <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            Team: {creator.name} 
                                                            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '999px', fontWeight: 'normal' }}>
                                                                {creator.role.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        </h3>
                                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{teamEditors.length} {teamEditors.length === 1 ? 'Editor' : 'Editors'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {isExpanded && (
                                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                            <th style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.875rem' }}>Editor</th>
                                                            <th style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.875rem' }}>Role</th>
                                                            <th style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.875rem' }}>Current Password</th>
                                                            <th style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.875rem' }}>Status</th>
                                                            <th style={{ padding: '0.75rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'right', fontSize: '0.875rem' }}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {teamEditors.map(renderUserRow)}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            ) : (
                // SUB ADMIN DASHBOARD (Flat List)
                <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
                        <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>My Team ({editors.length} Editors)</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>User</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Role</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                                                {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                                    {user.name || 'Unnamed User'}
                                                    {currentUser?.sub === String(user.id) && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: 'var(--color-bg-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>(You)</span>}
                                                </div>
                                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ 
                                            padding: '0.25rem 0.75rem', 
                                            borderRadius: '999px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 600,
                                            background: user.role === 'sub_admin' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                            color: user.role === 'sub_admin' ? '#60a5fa' : '#4ade80'
                                        }}>
                                            {user.role.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <button 
                                            onClick={() => toggleStatus(user.id, user.is_active)}
                                            disabled={user.role !== 'editor'}
                                            style={{ 
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: user.role !== 'editor' ? 'not-allowed' : 'pointer',
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: '999px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 600,
                                                backgroundColor: user.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: user.is_active ? '#4ade80' : '#ef4444',
                                                opacity: user.role !== 'editor' ? 0.5 : 1
                                            }}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        {user.role === 'editor' && (
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="btn"
                                                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Send Access Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 50
                }}>
                    <div style={{
                        background: 'var(--color-bg-secondary)',
                        width: '100%', maxWidth: '500px',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={24} style={{ color: 'var(--color-accent-blue)' }} />
                                Send Access
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div style={{ padding: '2rem' }}>
                            {submitSuccess ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <MailCheck size={32} color="#4ade80" />
                                    </div>
                                    <h3 style={{ color: 'var(--color-text-primary)', margin: '0 0 0.5rem 0' }}>Access Sent!</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>An email has been sent to {formData.email} with their login credentials.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSendAccess}>
                                    {error && (
                                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                            {error}
                                        </div>
                                    )}
                                    
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }}>
                                                <User size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                placeholder="John Doe"
                                                style={{ paddingLeft: '40px', width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }}>
                                                <Mail size={18} />
                                            </div>
                                            <input 
                                                type="email" 
                                                className="form-input" 
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                placeholder="john@example.com"
                                                style={{ paddingLeft: '40px', width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Assign Role</label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }}>
                                                <ShieldAlert size={18} />
                                            </div>
                                            <select 
                                                className="form-input" 
                                                value={formData.role}
                                                onChange={e => setFormData({...formData, role: e.target.value})}
                                                style={{ paddingLeft: '40px', width: '100%', appearance: 'auto', backgroundColor: 'var(--color-bg-primary)' }}
                                            >
                                                {isSuperAdmin ? (
                                                    <>
                                                        <option value="super_admin">Super Admin</option>
                                                        <option value="sub_admin">Sub Admin</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="viewer">Viewer</option>
                                                    </>
                                                ) : (
                                                    <option value="editor">Editor</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button 
                                            type="button" 
                                            className="btn" 
                                            style={{ flex: 1 }}
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary" 
                                            style={{ flex: 1, background: 'var(--color-accent-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Sending...' : 'Send Access'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
