import React, { useEffect, useState } from 'react';
import { AuthorsApi, FactCheckersApi } from '../services/api';
import { Edit2, Trash2, X, Plus, User, Search, Link, Globe } from 'lucide-react';
import ImageUploadInput from '../components/ImageUploadInput';

const AuthorsPage = ({ type = 'Authors' }) => {
  const singularType = type.endsWith('s') ? type.slice(0, -1) : type;
  const api = type === 'Fact Checkers' ? FactCheckersApi : AuthorsApi;
  
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = {
    name: '', title: '', bio: '', avatar_url: '', 
    twitter: '', linkedin: '', facebook: '', instagram: '', github: '', website: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadAuthors();
  }, [type]);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setAuthors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author.id);
    setFormData({
      ...initialFormState,
      ...author,
      twitter: author.twitter || '',
      linkedin: author.linkedin || '',
      facebook: author.facebook || '',
      instagram: author.instagram || '',
      github: author.github || '',
      website: author.website || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${singularType.toLowerCase()}?`)) return;
    try {
      await api.delete(id);
      loadAuthors();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    
    try {
      if (editingAuthor) {
        await api.update(editingAuthor, formData);
      } else {
        await api.create(formData);
      }
      setShowModal(false);
      setEditingAuthor(null);
      setFormData(initialFormState);
      loadAuthors();
    } catch (err) {
      alert(err.message);
    }
  };

  const openNewModal = () => {
    setEditingAuthor(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && authors.length === 0) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }}></div>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading {type}...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-accent-red)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
      <span className="font-semibold">Error:</span> {error}
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', background: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--color-text-primary)' }}>
            Manage {type}
          </h2>
          <p className="text-sm text-muted" style={{ margin: 0 }}>Add, edit, or remove {type.toLowerCase()} from your system.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ minWidth: '250px' }}>
            <Search className="icon" size={16} />
            <input 
              type="text" 
              placeholder={`Search ${type.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={openNewModal} className="btn btn-primary">
            <Plus size={18} />
            New {singularType}
          </button>
        </div>
      </div>

      {/* Grid Layout for Authors */}
      <div className="grid grid-4" style={{ gap: '1.5rem' }}>
        {filteredAuthors.map((author) => (
          <div key={author.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.2s ease', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {author.avatar_url ? (
                  <img src={author.avatar_url} alt={author.name} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} />
                ) : (
                  <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg" style={{ margin: '0 0 0.125rem 0' }}>{author.name}</h3>
                  {author.title && <p className="text-sm font-medium text-blue" style={{ margin: 0 }}>{author.title}</p>}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-secondary line-clamp-2" style={{ flexGrow: 1, margin: '0 0 1rem 0' }}>
              {author.bio || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No biography provided.</span>}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 {author.twitter && <a href={author.twitter} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }}><Link size={14} /></a>}
                 {author.linkedin && <a href={author.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }}><Link size={14} /></a>}
                 {author.website && <a href={author.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }}><Globe size={14} /></a>}
               </div>
               <div style={{ display: 'flex', gap: '0.25rem' }}>
                 <button onClick={() => handleEdit(author)} className="action-btn edit" title="Edit">
                   <Edit2 size={16} />
                 </button>
                 <button onClick={() => handleDelete(author.id)} className="action-btn delete" title="Delete">
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAuthors.length === 0 && !loading && (
        <div className="empty-state card">
          <User className="icon" />
          <h3>No {type.toLowerCase()} found</h3>
          <p>There are currently no records matching your search. Add a new {singularType.toLowerCase()} to get started.</p>
          <button onClick={openNewModal} className="btn btn-primary">
            <Plus size={18} /> New {singularType}
          </button>
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}></div>
          
          <div style={{ position: 'relative', background: 'var(--color-bg-secondary)', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editingAuthor ? <Edit2 className="text-blue" size={20} /> : <Plus className="text-green" size={20} />}
                {editingAuthor ? `Edit ${singularType}` : `Create New ${singularType}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="action-btn" style={{ padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Basic Info Section */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent-blue)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', paddingBottom: '0.5rem' }}>Basic Information</h4>
                <div className="grid grid-2 gap-md">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dr. Sarah Connor" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Professional Title</label>
                    <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Lead AI Researcher" />
                  </div>
                </div>
              </div>
              
              <div>
                <ImageUploadInput
                  name="avatar_url"
                  label="Avatar Image"
                  value={formData.avatar_url || ''}
                  onChange={e => setFormData({...formData, avatar_url: e.target.value})}
                  enableCrop={true}
                  cropAspectRatio={1}
                />
              </div>

              <div>
                <label className="form-label">Biography</label>
                <textarea className="form-input form-textarea" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder={`Write a short biography for this ${singularType.toLowerCase()}...`}></textarea>
              </div>

              {/* Social Links Section */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent-blue)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', paddingBottom: '0.5rem' }}>Social & Web Links</h4>
                <div className="grid grid-2 gap-md">
                  <div className="form-input-icon">
                    <Link className="icon" size={16} />
                    <input type="text" className="form-input" placeholder="Twitter Profile URL" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
                  </div>
                  <div className="form-input-icon">
                    <Link className="icon" size={16} />
                    <input type="text" className="form-input" placeholder="LinkedIn Profile URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                  </div>
                  <div className="form-input-icon">
                    <Link className="icon" size={16} />
                    <input type="text" className="form-input" placeholder="GitHub Profile URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
                  </div>
                  <div className="form-input-icon">
                    <Globe className="icon" size={16} />
                    <input type="text" className="form-input" placeholder="Personal Website URL" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                  </div>
                  <div className="form-input-icon">
                    <Link className="icon" size={16} />
                    <input type="text" className="form-input" placeholder="Facebook Profile URL" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
                  </div>
                  <div className="form-input-icon">
                    <Link className="icon" size={16} />
                    <input type="text" className="form-input" placeholder="Instagram Profile URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                  </div>
                </div>
              </div>

            </div>
            
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save {singularType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorsPage;
