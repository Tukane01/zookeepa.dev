import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageUpload({
  onImageUploaded,
  currentImageId = null,
  currentImageUrl = null,
  altText = '',
  onAltTextChange,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);
      if (altText) {
        formData.append('altText', altText);
      }

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to server
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Call the callback with the uploaded image info
      if (onImageUploaded) {
        onImageUploaded(result);
      }

      // Clean up object URL after a delay to allow for preview
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(currentImageUrl); // Reset to original
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageUploaded) {
      onImageUploaded(null);
    }
  };

  const getImageUrl = (imageId) => {
    return imageId ? `/api/images/${imageId}` : null;
  };

  const displayUrl = previewUrl || (currentImageId ? getImageUrl(currentImageId) : null);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Alt Text Input */}
      {onAltTextChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text (Optional)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltTextChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the image for accessibility"
          />
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : displayUrl
            ? 'border-gray-300'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {displayUrl ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={displayUrl}
                alt={altText || 'Uploaded image'}
                className="max-w-full max-h-48 object-contain rounded"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-600">Image uploaded successfully</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              {isUploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              ) : (
                <ImageIcon size={48} />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isUploading ? 'Uploading...' : 'Drop an image here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload size={16} className="mr-2" />
              Select File
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}