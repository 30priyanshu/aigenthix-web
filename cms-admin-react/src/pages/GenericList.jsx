import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCHEMAS } from '../schemas';
import { StatsContainer } from '../components/StatCard';
import { Edit2, Trash2 } from 'lucide-react';
import { Auth } from '../services/auth';

const GenericList = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[type] || SCHEMAS.blogs;
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userRole = Auth.getUser()?.role;
  const canEdit = userRole === 'super_admin' || userRole === 'editor';

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
    published: items.filter(i => i.status === 'published' || i.published).length,
    draft: items.filter(i => i.status === 'draft' || i.published === false).length,
    featured: items.filter(i => i.is_featured).length,
  };

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

      {items.length === 0 ? (
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
          {items.map((item) => (
            <div key={item.id} className="blog-row" style={{ gridTemplateColumns: '1fr 120px 100px' }}>
              <div>
                <h3 className="title font-bold">{item.title || item.name || item.project_name}</h3>
                <p className="meta">{item.slug}</p>
                {(item.created_at || item.updated_at || item.date) && (
                  <p className="meta" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {new Date(item.created_at || item.updated_at || item.date).toLocaleString()}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={`badge ${item.published || item.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                  {item.published || item.status === 'published' ? 'Published' : 'Draft'}
                </span>
                {item.is_featured && (
                  <span className="badge badge-purple">Featured</span>
                )}
              </div>
              {canEdit && (
                <div className="actions">
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
