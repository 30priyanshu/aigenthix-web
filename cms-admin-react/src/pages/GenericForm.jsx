import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCHEMAS } from '../schemas';
import ImageUploadInput from '../components/ImageUploadInput';
import RichTextEditor from '../components/RichTextEditor';

const GenericForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[type] || SCHEMAS.blogs;
  const isEditing = !!id;

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      loadItem();
    }
  }, [type, id]);

  const loadItem = async () => {
    try {
      const data = await schema.api.getById(id);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...formData };
      if (payload.content_data && typeof payload.content_data === 'string') {
        try {
          payload.content_data = JSON.parse(payload.content_data);
        } catch(err) {
          throw new Error("Advanced Content Data must be valid JSON");
        }
      } else if (!payload.content_data) {
        payload.content_data = {};
      }

      if (isEditing) {
        await schema.api.update(id, payload);
      } else {
        await schema.api.create(payload);
      }
      navigate(`/admin/${type}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && isEditing && !Object.keys(formData).length) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <p>Loading {schema.title}...</p>
      </div>
    );
  }

  return (
    <div className="card p-xl">
      <h2 style={{ marginBottom: '2rem' }}>{isEditing ? 'Edit' : 'Create'} {schema.title}</h2>
      
      {error && (
        <div className="empty-state text-red" style={{ padding: '1rem', border: '1px solid red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-lg">
          {schema.fields.map(field => {
            if (field.name.includes('image') || field.name.includes('icon')) {
              return (
                <ImageUploadInput
                  key={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  label={field.label}
                  required={field.required}
                />
              );
            }
            return (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    required={field.required}
                  />
                ) : field.type === 'richtext' ? (
                  <RichTextEditor
                    value={formData[field.name] || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}
                  />
                ) : field.type === 'faq_list' ? (
                  <div className="faq-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(formData[field.name] || []).map((faq, index) => (
                      <div key={index} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', position: 'relative', backgroundColor: '#f8fafc' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = [...(formData[field.name] || [])];
                            newFaqs.splice(index, 1);
                            setFormData(prev => ({ ...prev, [field.name]: newFaqs }));
                          }}
                          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                          title="Remove FAQ"
                        >
                          ✕
                        </button>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label className="form-label" style={{ fontSize: '0.875rem' }}>Question</label>
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => {
                              const newFaqs = [...(formData[field.name] || [])];
                              newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                              setFormData(prev => ({ ...prev, [field.name]: newFaqs }));
                            }}
                            className="form-input"
                            placeholder="Enter question"
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.875rem' }}>Answer</label>
                          <textarea
                            value={faq.answer || ''}
                            onChange={(e) => {
                              const newFaqs = [...(formData[field.name] || [])];
                              newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                              setFormData(prev => ({ ...prev, [field.name]: newFaqs }));
                            }}
                            className="form-input form-textarea"
                            style={{ minHeight: '80px' }}
                            placeholder="Enter answer"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = [...(formData[field.name] || []), { question: '', answer: '' }];
                        setFormData(prev => ({ ...prev, [field.name]: newFaqs }));
                      }}
                      className="btn btn-outline"
                      style={{ width: '100%', border: '2px dashed #cbd5e1', color: '#2563eb', padding: '0.75rem' }}
                    >
                      + Add FAQ
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="form-input"
                    required={field.required}
                  />
                )}
              </div>
            );
          })}
          
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name={schema.id === 'blogs' ? 'published' : 'status'}
              value={formData.published || formData.status === 'published' ? 'published' : 'draft'}
              onChange={(e) => {
                if (schema.id === 'blogs') {
                  setFormData(p => ({ ...p, published: e.target.value === 'published' }));
                } else {
                  setFormData(p => ({ ...p, status: e.target.value }));
                }
              }}
              className="form-input form-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured || false}
              onChange={handleChange}
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            <label htmlFor="is_featured" className="form-label" style={{ marginBottom: 0 }}>
              Feature this item on the homepage
            </label>
          </div>
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate(`/admin/${type}`)} className="btn btn-ghost" disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenericForm;
