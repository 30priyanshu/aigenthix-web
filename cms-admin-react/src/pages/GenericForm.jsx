import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCHEMAS } from '../schemas';
import ImageUploadInput from '../components/ImageUploadInput';
import RichTextEditor from '../components/RichTextEditor';
import { Plus, X, Trash2, AlertTriangle, Edit2, User } from 'lucide-react';
import { Auth } from '../services/auth';
import { AuthorsApi, BlogsApi, FactCheckersApi } from '../services/api';

const GenericForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[type] || SCHEMAS.blogs;
  const isEditing = !!id;

  const getPreviewUrl = () => {
    if (!formData.slug) return '';
    const base = 'http://localhost:5173';
    switch (schema.id) {
      case 'blogs':
        return `${base}/blog/${formData.slug}?preview=true`;
      case 'products':
        return `${base}/products/${formData.slug}?preview=true`;
      case 'services':
        return `${base}/services/${formData.slug}?preview=true`;
      case 'industries':
        return `${base}/industries/${formData.slug}?preview=true`;
      case 'rd':
        return `${base}/research-development/${formData.slug}?preview=true`;
      default:
        return '';
    }
  };

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [factCheckers, setFactCheckers] = useState([]);
  const [slugError, setSlugError] = useState('');
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [activeMultiSelectField, setActiveMultiSelectField] = useState(null);
  const [newAuthor, setNewAuthor] = useState({ name: '', bio: '', avatar_url: '', twitter: '', linkedin: '' });

  useEffect(() => {
    if (schema.id === 'blogs') {
      AuthorsApi.getAll().then(setAuthors).catch(console.error);
      FactCheckersApi.getAll().then(setFactCheckers).catch(console.error);
    }
  }, [schema.id]);

  useEffect(() => {
    if (schema.id === 'blogs' && formData.title && !isEditing) {
      const generatedSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 55);
      if (!formData.slug || (formData.slug !== generatedSlug && !formData._slug_manually_edited)) {
          setFormData(prev => ({...prev, slug: generatedSlug}));
      }
    }
  }, [formData.title, isEditing, schema.id]);

  useEffect(() => {
    if (schema.id === 'blogs' && formData.slug) {
       const check = async () => {
          try {
            const available = await BlogsApi.checkSlug(formData.slug);
            setSlugError(available ? '' : 'Warning: This slug is already in use!');
          } catch(e) {}
       }
       const timer = setTimeout(check, 500);
       return () => clearTimeout(timer);
    } else {
       setSlugError('');
    }
  }, [formData.slug, schema.id]);

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

  const getFieldValue = (field) => {
    if (field.isContentData) {
      if (!formData.content_data) return field.type === 'cards_grid' || field.type === 'extra_details_list' ? [] : '';
      let cd = formData.content_data;
      if (typeof cd === 'string') {
        try { cd = JSON.parse(cd); } catch(e) { cd = {}; }
      }
      return cd[field.name] || (field.type === 'cards_grid' || field.type === 'extra_details_list' ? [] : '');
    }
    return formData[field.name] || '';
  };

  const handleFieldChange = (field, value) => {
    if (field.isContentData) {
      setFormData(prev => {
        let cd = prev.content_data || {};
        if (typeof cd === 'string') {
          try { cd = JSON.parse(cd); } catch(e) { cd = {}; }
        }
        return {
          ...prev,
          content_data: { ...cd, [field.name]: value }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field.name]: value }));
    }
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

      if (schema.id === 'blogs') {
        if (!payload.meta_title) payload.meta_title = payload.title;
        if (!payload.meta_description) payload.meta_description = payload.excerpt;
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
    <div className="form-container" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '1.5rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), 0 0 10px rgba(0,0,0,0.02)', border: '1px solid rgba(226, 232, 240, 0.8)', position: 'relative' }}>
      
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '3rem', padding: '1.75rem 2rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(168,85,247,0.06) 100%)', borderRadius: '1.25rem', border: '1px solid rgba(226,232,240,0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            {isEditing ? 'Edit' : 'Create'} {schema.title}
          </h2>
          <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '1rem', fontWeight: '500' }}>
            Fill in the details below to {isEditing ? 'update' : 'create'} this {schema.title.toLowerCase()}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           {formData.slug && (
             <button type="button" onClick={() => window.open(getPreviewUrl(), '_blank')} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Preview Page
             </button>
           )}
           <button type="submit" form="generic-form" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)', transition: 'all 0.2s ease' }} disabled={loading}>
             {loading ? 'Saving...' : 'Save Changes'}
           </button>
           <button type="button" onClick={() => navigate(`/admin/${type}`)} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600' }} disabled={loading}>
             Cancel
           </button>
        </div>
      </div>
      
      {error && (
        <div style={{ padding: '1.25rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0.5rem', color: '#b91c1c', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500' }}>
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      <form id="generic-form" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-cols-1 gap-lg">
          {schema.fields.map(field => {
            const fieldValue = getFieldValue(field);
            
            if (field.type === 'cards_grid') {
              const cards = Array.isArray(fieldValue) ? fieldValue : [];
              return (
                <div key={field.name} className="form-group" style={{ padding: '2rem', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '1.25rem', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{field.label}</label>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Create beautiful grid cards for this section. Max 6 cards.</p>
                    </div>
                    {cards.length < 6 && (
                      <button type="button" onClick={() => handleFieldChange(field, [...cards, { title: '', desc: '', icon: '' }])} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                        <Plus size={16} /> Add Card
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cards.map((card, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'; }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                           <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>Card {index + 1}</span>
                           <button type="button" onClick={() => {
                             const newCards = [...cards];
                             newCards.splice(index, 1);
                             handleFieldChange(field, newCards);
                           }} className="btn btn-icon" style={{ color: '#ef4444', background: '#fef2f2', padding: '0.4rem' }}>
                             <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="mb-3">
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Title</label>
                          <input type="text" value={card.title || ''} onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index].title = e.target.value;
                            handleFieldChange(field, newCards);
                          }} className="form-input" style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} placeholder="e.g. Innovative Solutions" />
                        </div>
                        <div className="mb-3">
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Description</label>
                          <textarea value={card.desc || ''} onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index].desc = e.target.value;
                            handleFieldChange(field, newCards);
                          }} className="form-input form-textarea" style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem', minHeight: '80px', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} placeholder="Brief description of the feature..." />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>Icon (React Icon Name)</label>
                          <input type="text" value={card.icon || ''} onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index].icon = e.target.value;
                            handleFieldChange(field, newCards);
                          }} className="form-input" style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} placeholder="e.g. FaBrain, FaRocket" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {cards.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '1rem', border: '2px dashed #cbd5e1' }}>
                       <p style={{ color: '#64748b', marginBottom: '1rem' }}>No cards added yet.</p>
                       <button type="button" onClick={() => handleFieldChange(field, [...cards, { title: '', desc: '', icon: '' }])} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Plus size={16} /> Add First Card
                       </button>
                    </div>
                  )}
                </div>
              );
            }

            if (field.type === 'extra_details_list') {
              const sections = Array.isArray(fieldValue) ? fieldValue : [];
              return (
                <div key={field.name} className="form-group" style={{ padding: '2rem', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '1.25rem', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{field.label}</label>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Add rich content sections (alternating image & text). Max 8 sections.</p>
                    </div>
                    {sections.length < 8 && (
                      <button type="button" onClick={() => handleFieldChange(field, [...sections, { title: '', description: '', image_url: '', tools: [] }])} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                        <Plus size={16} /> Add Section
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {sections.map((section, index) => (
                      <div key={index} style={{ padding: '2rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '2rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(59,130,246,0.3)' }}>
                          Section {index + 1}
                        </div>
                        <button type="button" onClick={() => {
                          const newSections = [...sections];
                          newSections.splice(index, 1);
                          handleFieldChange(field, newSections);
                        }} className="btn btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', background: '#fef2f2', borderRadius: '50%' }}>
                          <Trash2 size={18} />
                        </button>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Section Title</label>
                              <input type="text" value={section.title || ''} onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].title = e.target.value;
                                handleFieldChange(field, newSections);
                              }} className="form-input" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} placeholder="e.g. Advanced AI Integration" />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Description</label>
                              <textarea value={section.description || ''} onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].description = e.target.value;
                                handleFieldChange(field, newSections);
                              }} className="form-input form-textarea" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', minHeight: '120px' }} placeholder="Explain the details of this section..." />
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed #cbd5e1' }}>
                              <ImageUploadInput
                                name={`section_image_${index}`}
                                label="Featured Image URL"
                                value={section.image_url || ''}
                                onChange={(e) => {
                                  const newSections = [...sections];
                                  newSections[index].image_url = e.target.value;
                                  handleFieldChange(field, newSections);
                                }}
                              />
                            </div>
                            
                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem' }}>Tags / Highlights (e.g. Python, NLP)</label>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {(section.tools || []).map((tool, toolIndex) => (
                                  <span key={toolIndex} style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 1px 2px rgba(67,56,202,0.1)' }}>
                                    {tool}
                                    <button type="button" onClick={() => {
                                      const newSections = [...sections];
                                      newSections[index].tools.splice(toolIndex, 1);
                                      handleFieldChange(field, newSections);
                                    }} style={{ color: '#6366f1', display: 'flex' }}><X size={14}/></button>
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input type="text" id={`tool_input_${index}`} className="form-input" style={{ backgroundColor: '#ffffff', fontSize: '0.9rem' }} placeholder="Add a new tag..." onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.target.value.trim();
                                    if (val) {
                                      const newSections = [...sections];
                                      if (!newSections[index].tools) newSections[index].tools = [];
                                      newSections[index].tools.push(val);
                                      handleFieldChange(field, newSections);
                                      e.target.value = '';
                                    }
                                  }
                                }}/>
                                <button type="button" onClick={() => {
                                  const input = document.getElementById(`tool_input_${index}`);
                                  const val = input.value.trim();
                                  if (val) {
                                    const newSections = [...sections];
                                    if (!newSections[index].tools) newSections[index].tools = [];
                                    newSections[index].tools.push(val);
                                    handleFieldChange(field, newSections);
                                    input.value = '';
                                  }
                                }} className="btn btn-primary" style={{ padding: '0 1rem', borderRadius: '0.5rem' }}><Plus size={18}/></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {sections.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '1rem', border: '2px dashed #cbd5e1' }}>
                       <p style={{ color: '#64748b', marginBottom: '1rem' }}>No sections added yet.</p>
                       <button type="button" onClick={() => handleFieldChange(field, [...sections, { title: '', description: '', image_url: '', tools: [] }])} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Plus size={16} /> Add First Section
                       </button>
                    </div>
                  )}
                </div>
              );
            }

            if (field.name.includes('image') || field.name.includes('icon')) {
              return (
                <ImageUploadInput
                  key={field.name}
                  name={field.name}
                  value={fieldValue}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  label={field.label}
                  required={field.required}
                  enableCrop={true}
                  cropAspectRatio={field.name.includes('avatar') ? 1 : null} // Free crop for general images
                />
              );
            }
            return (
              <div key={field.name} className="form-group" style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={fieldValue}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="form-input form-textarea"
                    style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}
                    required={field.required}
                  />
                ) : field.type === 'richtext' ? (
                  <RichTextEditor
                    value={fieldValue}
                    onChange={(value) => handleFieldChange(field, value)}
                  />
                ) : field.type === 'faq_list' ? (
                  <div className="faq-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {(fieldValue || []).map((faq, index) => (
                      <div key={index} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '1rem', position: 'relative', background: '#f8fafc', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#93c5fd'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                        <div style={{ position: 'absolute', top: '-10px', left: '1.5rem', background: '#3b82f6', color: 'white', padding: '0.1rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>FAQ {index + 1}</div>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = [...(fieldValue || [])];
                            newFaqs.splice(index, 1);
                            handleFieldChange(field, newFaqs);
                          }}
                          style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', background: '#fef2f2', border: 'none', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '50%' }}
                          title="Remove FAQ"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                          <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Question</label>
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => {
                              const newFaqs = [...(fieldValue || [])];
                              newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                              handleFieldChange(field, newFaqs);
                            }}
                            className="form-input"
                            style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                            placeholder="e.g. How does this work?"
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Answer</label>
                          <textarea
                            value={faq.answer || ''}
                            onChange={(e) => {
                              const newFaqs = [...(fieldValue || [])];
                              newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                              handleFieldChange(field, newFaqs);
                            }}
                            className="form-input form-textarea"
                            style={{ minHeight: '80px', backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                            placeholder="Provide a detailed answer..."
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = [...(fieldValue || []), { question: '', answer: '' }];
                        handleFieldChange(field, newFaqs);
                      }}
                      className="btn btn-outline"
                      style={{ width: '100%', border: '2px dashed #94a3b8', color: '#3b82f6', padding: '1rem', borderRadius: '1rem', background: 'transparent', fontWeight: '600', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.target.style.background = '#eff6ff'; e.target.style.borderColor = '#3b82f6'; }}
                      onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#94a3b8'; }}
                    >
                      <Plus size={18} style={{ display: 'inline', marginRight: '0.5rem' }}/> Add New FAQ
                    </button>
                  </div>
                ) : field.type === 'authors_multi_select' || field.type === 'fact_checkers_multi_select' ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                      <select
                        onChange={(e) => {
                           if (!e.target.value) return;
                           const current = Array.isArray(fieldValue) ? fieldValue : [];
                           const valInt = parseInt(e.target.value);
                           if (!current.includes(e.target.value) && !current.includes(valInt)) {
                              handleFieldChange(field, [...current, valInt]);
                           }
                           e.target.value = ""; // Reset
                        }}
                        className="form-input form-select flex-1"
                        style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}
                      >
                        <option value="">-- Add {field.label.replace('Select ', '')} --</option>
                        {(field.type === 'fact_checkers_multi_select' ? factCheckers : authors).filter(a => !(fieldValue || []).some(id => id.toString() === a.id.toString())).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                      <button type="button" onClick={() => {
                        setEditingAuthorId(null);
                        setNewAuthor({name: '', bio: '', avatar_url: '', twitter: '', linkedin: ''});
                        setActiveMultiSelectField(field.name);
                        setShowAuthorModal(true);
                      }} className="btn btn-outline whitespace-nowrap" style={{ borderRadius: '0.75rem' }}>
                        + New
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                      {(fieldValue || []).map((selectedId, idx) => {
                        const targetList = field.type === 'fact_checkers_multi_select' ? factCheckers : authors;
                        const targetApi = field.type === 'fact_checkers_multi_select' ? FactCheckersApi : AuthorsApi;
                        const targetStateSetter = field.type === 'fact_checkers_multi_select' ? setFactCheckers : setAuthors;
                        const entityName = field.type === 'fact_checkers_multi_select' ? 'Fact Checker' : 'Author';
                        
                        const entity = targetList.find(a => a.id.toString() === selectedId.toString());
                        return entity ? (
                          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'all 0.2s' }}>
                            {entity.avatar_url ? (
                              <img src={entity.avatar_url} alt={entity.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <User size={16} />
                              </div>
                            )}
                            <span style={{ marginRight: '0.25rem' }}>{entity.name}</span>
                            
                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                              <button type="button" onClick={() => {
                                setEditingAuthorId(entity.id);
                                setNewAuthor(entity);
                                setActiveMultiSelectField(field.name);
                                setShowAuthorModal(true);
                              }} style={{ padding: '0.25rem 0.5rem', color: '#2563eb', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }} title={`Edit ${entityName}`}>
                                <Edit2 size={14}/>
                              </button>
                              <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }}></div>
                              <button type="button" onClick={async () => {
                                if (window.confirm(`Are you sure you want to permanently delete this ${entityName.toLowerCase()}?`)) {
                                  try {
                                    await targetApi.delete(entity.id);
                                    targetStateSetter(prev => prev.filter(a => a.id !== entity.id));
                                    const newVal = [...(fieldValue || [])].filter(id => id.toString() !== entity.id.toString());
                                    handleFieldChange(field, newVal);
                                  } catch(e) {
                                    alert(e.message);
                                  }
                                }
                              }} style={{ padding: '0.25rem 0.5rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }} title={`Delete ${entityName}`}>
                                <Trash2 size={14}/>
                              </button>
                            </div>
                            
                            <div style={{ width: '1px', height: '24px', margin: '0 0.25rem', background: '#cbd5e1' }}></div>
                            
                            <button type="button" onClick={() => {
                              const newVal = [...(fieldValue || [])];
                              newVal.splice(idx, 1);
                              handleFieldChange(field, newVal);
                            }} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer' }} title="Remove from list"><X size={14}/></button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : field.type === 'author_single_select' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select
                        value={fieldValue || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value ? parseInt(e.target.value) : null)}
                        className="form-input form-select"
                        required={field.required}
                        style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', flex: 1 }}
                      >
                        <option value="">-- {field.label} --</option>
                        {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                      <button type="button" onClick={() => {
                        setEditingAuthorId(null);
                        setNewAuthor({name: '', bio: '', avatar_url: '', twitter: '', linkedin: ''});
                        setActiveMultiSelectField(field.name);
                        setShowAuthorModal(true);
                      }} className="btn btn-outline whitespace-nowrap" style={{ borderRadius: '0.75rem' }}>
                        + New
                      </button>
                    </div>
                    {fieldValue && (() => {
                      const entity = authors.find(a => a.id.toString() === fieldValue.toString());
                      if (!entity) return null;
                      return (
                          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b', width: 'max-content', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', marginTop: '0.25rem' }}>
                            {entity.avatar_url ? (
                              <img src={entity.avatar_url} alt={entity.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <User size={16} />
                              </div>
                            )}
                            <span style={{ marginRight: '0.25rem' }}>{entity.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                              <button type="button" onClick={() => {
                                setEditingAuthorId(entity.id);
                                setNewAuthor(entity);
                                setActiveMultiSelectField(field.name);
                                setShowAuthorModal(true);
                              }} style={{ padding: '0.25rem 0.5rem', color: '#2563eb', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }} title="Edit Author">
                                <Edit2 size={14}/>
                              </button>
                              <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }}></div>
                              <button type="button" onClick={async () => {
                                if (window.confirm("Are you sure you want to permanently delete this author?")) {
                                  try {
                                    await AuthorsApi.delete(entity.id);
                                    setAuthors(prev => prev.filter(a => a.id !== entity.id));
                                    handleFieldChange(field, null);
                                  } catch(e) {
                                    alert(e.message);
                                  }
                                }
                              }} style={{ padding: '0.25rem 0.5rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }} title="Delete Author">
                                <Trash2 size={14}/>
                              </button>
                            </div>
                          </div>
                      );
                    })()}
                  </div>
                ) : field.type === 'schema_select' ? (
                  <select
                    name={field.name}
                    value={fieldValue || 'Article'}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="Article">Article</option>
                    <option value="BlogPosting">BlogPosting</option>
                    <option value="FAQ">FAQ</option>
                    <option value="Table">Table</option>
                    <option value="WebPage">WebPage</option>
                    <option value="ItemPage">ItemPage</option>
                  </select>
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={fieldValue || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="form-input form-select"
                  >
                    {field.options?.map((opt, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'toggle' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={fieldValue || false}
                      onChange={(e) => handleFieldChange(field, e.target.checked)}
                      style={{ width: '1.5rem', height: '1.5rem' }}
                    />
                    <span className="text-gray-600">Enable</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type={field.type}
                      name={field.name}
                      value={fieldValue}
                      onChange={(e) => {
                         if (field.name === 'slug') {
                             setFormData(prev => ({...prev, _slug_manually_edited: true}));
                         }
                         handleFieldChange(field, e.target.value);
                      }}
                      className="form-input"
                      style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}
                      required={field.required}
                    />
                    {field.name === 'slug' && slugError && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle size={14} /> {slugError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="form-group" style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>Status</label>
            <select
              name={schema.id === 'blogs' ? 'published' : 'status'}
              value={schema.id === 'blogs' ? (formData.status === 'published' || formData.published === true ? 'published' : 'draft') : (formData.status || 'draft')}
              onChange={(e) => {
                if (schema.id === 'blogs') {
                  setFormData(p => ({ 
                    ...p, 
                    published: e.target.value === 'published',
                    status: e.target.value 
                  }));
                } else {
                  setFormData(p => ({ ...p, status: e.target.value }));
                }
              }}
              className="form-input form-select"
              style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', fontWeight: '600' }}
              disabled={Auth.getUser()?.role === 'editor'}
            >
              <option value="draft">
                {Auth.getUser()?.role === 'editor' ? 'Submit for Approval' : 'Draft'}
              </option>
              {Auth.getUser()?.role !== 'editor' && (
                <option value="published">Published</option>
              )}
            </select>
          </div>


        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem', padding: '1.5rem 2rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
          {formData.slug && (
            <button type="button" onClick={() => window.open(getPreviewUrl(), '_blank')} className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Preview Page
            </button>
          )}
          <button type="button" onClick={() => navigate(`/admin/${type}`)} className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600' }} disabled={loading}>
            Discard Changes
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '0.75rem', fontWeight: '600', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', border: 'none' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Author Creation/Edit Modal */}
      {showAuthorModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-xl" style={{ width: '90%', maxWidth: '600px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-2xl)', padding: '2rem', border: '1px solid var(--color-border)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              {editingAuthorId ? (activeMultiSelectField === 'fact_checker_ids' ? 'Edit Fact Checker' : 'Edit Author') : (activeMultiSelectField === 'fact_checker_ids' ? 'Create New Fact Checker' : 'Create New Author')}
            </h3>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" className="form-input" value={newAuthor.name || ''} onChange={e => setNewAuthor({...newAuthor, name: e.target.value})} />
            </div>
            <ImageUploadInput
              name="avatar_url"
              label="Avatar Image"
              value={newAuthor.avatar_url || ''}
              onChange={e => setNewAuthor({...newAuthor, avatar_url: e.target.value})}
              enableCrop={true}
              cropAspectRatio={1}
            />
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input form-textarea" value={newAuthor.bio || ''} onChange={e => setNewAuthor({...newAuthor, bio: e.target.value})}></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Twitter URL</label>
              <input type="text" className="form-input" value={newAuthor.twitter || ''} onChange={e => setNewAuthor({...newAuthor, twitter: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input type="text" className="form-input" value={newAuthor.linkedin || ''} onChange={e => setNewAuthor({...newAuthor, linkedin: e.target.value})} />
            </div>
            <div className="flex gap-4 mt-6">
              <button className="btn btn-primary" onClick={async () => {
                if (!newAuthor.name) return;
                const isFactChecker = activeMultiSelectField === 'fact_checker_ids';
                const targetApi = isFactChecker ? FactCheckersApi : AuthorsApi;
                const targetStateSetter = isFactChecker ? setFactCheckers : setAuthors;

                try {
                  if (editingAuthorId) {
                    const updated = await targetApi.update(editingAuthorId, newAuthor);
                    targetStateSetter(prev => prev.map(a => a.id === editingAuthorId ? updated : a));
                  } else {
                    const author = await targetApi.create(newAuthor);
                    targetStateSetter(prev => [...prev, author]);
                    setFormData(prev => {
                       const targetField = activeMultiSelectField || 'author_ids';
                       if (targetField === 'author_id') {
                           return {...prev, [targetField]: author.id};
                       } else {
                           const current = Array.isArray(prev[targetField]) ? prev[targetField] : [];
                           return {...prev, [targetField]: [...current, author.id]};
                       }
                    });
                  }
                  setShowAuthorModal(false);
                  setNewAuthor({name: '', bio: '', avatar_url: '', twitter: '', linkedin: ''});
                  setEditingAuthorId(null);
                  setActiveMultiSelectField(null);
                } catch(e) {
                  alert(e.message);
                }
              }}>{editingAuthorId ? 'Save Changes' : (activeMultiSelectField === 'fact_checker_ids' ? 'Save Fact Checker' : 'Save Author')}</button>
              <button className="btn btn-ghost" onClick={() => {
                setShowAuthorModal(false);
                setEditingAuthorId(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GenericForm;
