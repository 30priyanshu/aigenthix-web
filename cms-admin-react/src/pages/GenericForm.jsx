import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCHEMAS } from '../schemas';
import ImageUploadInput from '../components/ImageUploadInput';
import RichTextEditor from '../components/RichTextEditor';
import { Plus, X, Trash2 } from 'lucide-react';

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
            const fieldValue = getFieldValue(field);
            
            if (field.type === 'cards_grid') {
              const cards = Array.isArray(fieldValue) ? fieldValue : [];
              return (
                <div key={field.name} className="form-group" style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', background: '#f8fafc' }}>
                  <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{field.label}</label>
                  <p className="text-gray-500 text-sm mb-4">Add up to 6 cards for your grid layout.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, index) => (
                      <div key={index} style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                        <button type="button" onClick={() => {
                          const newCards = [...cards];
                          newCards.splice(index, 1);
                          handleFieldChange(field, newCards);
                        }} className="btn btn-icon" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                        <div className="mb-2">
                          <label className="text-xs font-semibold">Title</label>
                          <input type="text" value={card.title || ''} onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index].title = e.target.value;
                            handleFieldChange(field, newCards);
                          }} className="form-input" style={{ padding: '0.4rem', fontSize: '0.875rem' }} placeholder="Card Title" />
                        </div>
                        <div className="mb-2">
                          <label className="text-xs font-semibold">Description</label>
                          <textarea value={card.desc || ''} onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index].desc = e.target.value;
                            handleFieldChange(field, newCards);
                          }} className="form-input form-textarea" style={{ padding: '0.4rem', fontSize: '0.875rem', minHeight: '60px' }} placeholder="Card Description" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold">Icon (Optional React-Icon name like 'FaBrain')</label>
                          <input type="text" value={card.icon || ''} onChange={(e) => {
                            const newCards = [...cards];
                            newCards[index].icon = e.target.value;
                            handleFieldChange(field, newCards);
                          }} className="form-input" style={{ padding: '0.4rem', fontSize: '0.875rem' }} placeholder="e.g. FaBrain, FaChartBar" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {cards.length < 6 && (
                    <button type="button" onClick={() => handleFieldChange(field, [...cards, { title: '', desc: '', icon: '' }])} className="btn btn-outline mt-4" style={{ width: '100%', borderStyle: 'dashed' }}>
                      <Plus size={16} className="mr-2" /> Add Card ({cards.length}/6)
                    </button>
                  )}
                </div>
              );
            }

            if (field.type === 'extra_details_list') {
              const sections = Array.isArray(fieldValue) ? fieldValue : [];
              return (
                <div key={field.name} className="form-group" style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', background: '#f8fafc' }}>
                  <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{field.label}</label>
                  <p className="text-gray-500 text-sm mb-4">Add up to 8 advanced sections (e.g., Strategy, Business). These will alternate left/right.</p>
                  
                  <div className="flex flex-col gap-6">
                    {sections.map((section, index) => (
                      <div key={index} style={{ padding: '1.5rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                        <button type="button" onClick={() => {
                          const newSections = [...sections];
                          newSections.splice(index, 1);
                          handleFieldChange(field, newSections);
                        }} className="btn btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444' }}>
                          <Trash2 size={20} />
                        </button>
                        
                        <h4 className="font-bold mb-4">Section {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-xs font-semibold">Section Name / Title</label>
                            <input type="text" value={section.title || ''} onChange={(e) => {
                              const newSections = [...sections];
                              newSections[index].title = e.target.value;
                              handleFieldChange(field, newSections);
                            }} className="form-input" placeholder="e.g. End-to-End Generative AI" />
                          </div>
                          <div>
                            <ImageUploadInput
                              name={`section_image_${index}`}
                              label="Section Image URL"
                              value={section.image_url || ''}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].image_url = e.target.value;
                                handleFieldChange(field, newSections);
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="text-xs font-semibold">Description</label>
                          <textarea value={section.description || ''} onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].description = e.target.value;
                            handleFieldChange(field, newSections);
                          }} className="form-input form-textarea" style={{ minHeight: '80px' }} placeholder="Section Description" />
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <label className="text-xs font-semibold mb-2 block">Tools / Tags (e.g. LLM Fine-Tuning)</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(section.tools || []).map((tool, toolIndex) => (
                              <span key={toolIndex} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {tool}
                                <button type="button" onClick={() => {
                                  const newSections = [...sections];
                                  newSections[index].tools.splice(toolIndex, 1);
                                  handleFieldChange(field, newSections);
                                }} className="text-blue-500 hover:text-blue-900"><X size={14}/></button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input type="text" id={`tool_input_${index}`} className="form-input" placeholder="Add a tool/tag..." onKeyDown={(e) => {
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
                            }} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}><Plus size={18}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {sections.length < 8 && (
                    <button type="button" onClick={() => handleFieldChange(field, [...sections, { title: '', description: '', image_url: '', tools: [] }])} className="btn btn-outline mt-4" style={{ width: '100%', borderStyle: 'dashed' }}>
                      <Plus size={16} className="mr-2" /> Add Section ({sections.length}/8)
                    </button>
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
                />
              );
            }
            return (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={fieldValue}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="form-input form-textarea"
                    required={field.required}
                  />
                ) : field.type === 'richtext' ? (
                  <RichTextEditor
                    value={fieldValue}
                    onChange={(value) => handleFieldChange(field, value)}
                  />
                ) : field.type === 'faq_list' ? (
                  <div className="faq-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(fieldValue || []).map((faq, index) => (
                      <div key={index} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', position: 'relative', backgroundColor: '#f8fafc' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = [...(fieldValue || [])];
                            newFaqs.splice(index, 1);
                            handleFieldChange(field, newFaqs);
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
                              const newFaqs = [...(fieldValue || [])];
                              newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                              handleFieldChange(field, newFaqs);
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
                              const newFaqs = [...(fieldValue || [])];
                              newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                              handleFieldChange(field, newFaqs);
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
                        const newFaqs = [...(fieldValue || []), { question: '', answer: '' }];
                        handleFieldChange(field, newFaqs);
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
                    value={fieldValue}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
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
