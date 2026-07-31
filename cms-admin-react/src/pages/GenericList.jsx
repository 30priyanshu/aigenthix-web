import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCHEMAS } from '../schemas';
import { StatsContainer } from '../components/StatCard';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Auth } from '../services/auth';

const GenericList = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[type] || SCHEMAS.blogs;
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const userRole = Auth.getUser()?.role;
  const canEdit = userRole === 'super_admin' || userRole === 'sub_admin' || userRole === 'editor';

  useEffect(() => {
    loadItems();
  }, [type]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await schema.api.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${schema.title}?`)) return;
    try {
      await schema.api.delete(id);
      loadItems();
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  const stats = {
    total: items.length,
    published: items.filter(i => i.status === 'published' || (i.status === undefined && i.published === true)).length,
    draft: items.filter(i => i.status === 'draft' || (i.status === undefined && (i.published === false || i.published === undefined))).length,
    pending: items.filter(i => i.status === 'pending_approval').length,
    featured: items.filter(i => i.is_featured).length,
  };

  const filteredItems = items.filter(item => {
    const isPending = item.status === 'pending_approval';
    const isPublished = item.status === 'published' || (item.status === undefined && item.published === true);
    const isDraft = item.status === 'draft' || (item.status === undefined && (item.published === false || item.published === undefined));

    if (filter === 'all') return true;
    if (filter === 'published') return isPublished;
    if (filter === 'draft') return isDraft;
    if (filter === 'pending') return isPending;
    return true;
  });

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <p>Loading {schema.title}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3 className="text-red">Failed to load {schema.title}</h3>
        <p>{error}</p>
        <button onClick={loadItems} className="btn btn-primary mt-md">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{schema.title}</h2>
        {canEdit && (
          <button onClick={() => navigate('new')} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add {schema.title}
          </button>
        )}
      </div>

      <StatsContainer stats={stats} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <button onClick={() => setFilter('all')} style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: filter === 'all' ? 'bold' : 'normal', color: filter === 'all' ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)', borderBottom: filter === 'all' ? '2px solid var(--color-accent-blue)' : 'none' }}>All</button>
        <button onClick={() => setFilter('published')} style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: filter === 'published' ? 'bold' : 'normal', color: filter === 'published' ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)', borderBottom: filter === 'published' ? '2px solid var(--color-accent-blue)' : 'none' }}>Published ({stats.published})</button>
        <button onClick={() => setFilter('draft')} style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: filter === 'draft' ? 'bold' : 'normal', color: filter === 'draft' ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)', borderBottom: filter === 'draft' ? '2px solid var(--color-accent-blue)' : 'none' }}>Drafts ({stats.draft})</button>
        <button onClick={() => setFilter('pending')} style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: filter === 'pending' ? 'bold' : 'normal', color: filter === 'pending' ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)', borderBottom: filter === 'pending' ? '2px solid var(--color-accent-blue)' : 'none' }}>Pending Verification ({stats.pending})</button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <h3>No {schema.title} yet</h3>
          {canEdit ? (
            <>
              <p>Create your first item to get started</p>
              <button onClick={() => navigate('new')} className="btn btn-primary mt-md">
                Create First {schema.title}
              </button>
            </>
          ) : (
            <p>There are no items available right now.</p>
          )}
        </div>
      ) : (
        <div className="blog-list">
          {filteredItems.map((item) => (
            <div key={item.id} className="blog-row" style={{ gridTemplateColumns: '1fr 120px 100px' }}>
              <div>
                <h3 className="title font-bold">{item.title || item.name || item.project_name}</h3>
                <p className="meta">{item.slug}</p>
                {(item.created_at || item.date) && (
                  <p className="meta" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Posted: {new Date(item.created_at || item.date).toLocaleString()}
                  </p>
                )}
                {item.updated_at && (
                  <p className="meta" style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Updated: {new Date(item.updated_at).toLocaleString()}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {item.status === 'pending_approval' ? (
                  <span className="badge" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>Pending Approval</span>
                ) : (
                  <span className={`badge ${item.published || item.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                    {item.published || item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                )}
                {item.is_featured && (
                  <span className="badge badge-purple">Featured</span>
                )}
              </div>
              {canEdit && (
                <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                  {schema.id === 'blogs' && item.slug && (
                    <a href={`http://localhost:5173/blog/${item.slug}?preview=true`} target="_blank" rel="noopener noreferrer" className="action-btn preview" title="Preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '4px', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Eye size={18} />
                    </a>
                  )}
                  <button onClick={() => navigate(`edit/${item.id}`)} className="action-btn edit" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="action-btn delete" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenericList;
