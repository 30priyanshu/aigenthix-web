import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';

const ImageUploadInput = ({ name, value, onChange, label, required }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Simulate an event for onChange
      onChange({
        target: {
          name: name,
          value: reader.result,
          type: 'text'
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onChange({
      target: {
        name: name,
        value: '',
        type: 'text'
      }
    });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="text-red">*</span>}
      </label>
      
      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{ 
              flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'upload' ? 'var(--color-bg-primary)' : 'transparent',
              fontWeight: activeTab === 'upload' ? '600' : '400',
              borderBottom: activeTab === 'upload' ? '2px solid var(--color-accent-blue)' : '2px solid transparent'
            }}
          >
            <UploadCloud size={18} /> Upload Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{ 
              flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'url' ? 'var(--color-bg-primary)' : 'transparent',
              fontWeight: activeTab === 'url' ? '600' : '400',
              borderBottom: activeTab === 'url' ? '2px solid var(--color-accent-blue)' : '2px solid transparent'
            }}
          >
            <LinkIcon size={18} /> Enter URL
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-primary)' }}>
          {value ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={value} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <button
                  type="button"
                  onClick={clearImage}
                  style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
                    padding: '0.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {activeTab === 'url' ? 'Image loaded from URL' : 'Image ready for upload'}
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'upload' && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${dragActive ? 'var(--color-accent-blue)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    backgroundColor: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => inputRef.current?.click()}
                >
                  <ImageIcon size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Drag & drop your image here</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>or click to browse your files</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
              
              {activeTab === 'url' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadInput;
