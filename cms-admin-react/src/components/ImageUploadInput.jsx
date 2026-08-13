import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Loader } from 'lucide-react';
import { Auth } from '../services/auth';
import { CMS_CONFIG } from '../services/config';
import ImageCropperModal from './ImageCropperModal';

const ImageUploadInput = ({ name, value, onChange, label, required, enableCrop = false, cropAspectRatio = 1 }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [originalFileParams, setOriginalFileParams] = useState(null);

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
      processFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFileSelection(e.target.files[0]);
    }
  };

  const processFileSelection = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (enableCrop) {
      // Read file to show in cropper
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result);
        setOriginalFileParams({ type: file.type, name: file.name });
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      handleFile(file);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);
    setTempImageSrc(null);
    
    // Convert blob to File object to maintain compatibility with upload service
    const file = new File([croppedBlob], originalFileParams.name || 'cropped_image.jpg', {
      type: originalFileParams.type || 'image/jpeg',
    });
    
    await handleFile(file);
  };

  const handleFile = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = Auth.getToken();
      const response = await fetch(`${CMS_CONFIG.API_URL}/api/admin/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || result.message || 'Upload failed');
      }

      onChange({
        target: {
          name: name,
          value: result.data.url,
          type: 'text'
        }
      });
    } catch (error) {
      console.error("Image upload error:", error);
      alert(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
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
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.7 : 1
                  }}
                  onClick={() => { if(!isUploading) inputRef.current?.click(); }}
                >
                  {isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Loader size={36} className="animate-spin" style={{ color: 'var(--color-accent-blue)', margin: '0 auto' }} />
                      <p style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                      <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Drag & drop your image here</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>or click to browse your files</p>
                    </>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={isUploading}
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
      
      {showCropper && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setTempImageSrc(null);
          }}
          aspectRatio={cropAspectRatio}
        />
      )}
    </div>
  );
};

export default ImageUploadInput;
