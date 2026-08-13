import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCw } from 'lucide-react';

export const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Avoid CORS issues
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Calculate bounding box of the rotated image
  const rotRad = (rotation * Math.PI) / 180;
  const boundingBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const boundingBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  canvas.width = boundingBoxWidth;
  canvas.height = boundingBoxHeight;

  // Translate to center, rotate, translate back
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  
  ctx.drawImage(image, 0, 0);

  // cropped data
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated crop image in canvas
  ctx.putImageData(data, 0, 0);

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
};

const ImageCropperModal = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }} onClick={onCancel}></div>
      <div style={{ position: 'relative', width: '90%', maxWidth: '600px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Edit Image</h3>
          <button onClick={onCancel} className="action-btn" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ position: 'relative', width: '100%', height: '400px', background: 'rgba(0,0,0,0.9)' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio || undefined}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', width: '70px', color: 'var(--color-text-primary)' }}>Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(e.target.value)}
              style={{ flexGrow: 1, accentColor: 'var(--color-accent-blue)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', width: '70px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-primary)' }}>
              <RotateCw size={16} /> Rotate
            </label>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(e) => setRotation(e.target.value)}
              style={{ flexGrow: 1, accentColor: 'var(--color-accent-blue)' }}
            />
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--color-bg-primary)' }}>
          <button className="btn btn-secondary" onClick={onCancel} disabled={isProcessing}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isProcessing} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={18} /> {isProcessing ? 'Processing...' : 'Apply Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
