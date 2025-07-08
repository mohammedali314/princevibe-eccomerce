import React, { useState, useEffect } from 'react';
import './VariantManager.scss';

// SVG Icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21,15 16,10 5,21"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const VariantManager = ({ variants = [], onChange, productName = '' }) => {
  const [localVariants, setLocalVariants] = useState([]);

  useEffect(() => {
    setLocalVariants(variants.length > 0 ? variants : []);
  }, [variants]);

  const addVariant = () => {
    const newVariant = {
      id: Date.now().toString(),
      colorName: '',
      images: [],
      newImages: [],
      stock: 0,
      isDefault: localVariants.length === 0
    };
    
    const updatedVariants = [...localVariants, newVariant];
    setLocalVariants(updatedVariants);
    onChange(updatedVariants);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = localVariants.map((variant, i) => {
      if (i === index) {
        let processedValue = value;
        
        // Special handling for stock field
        if (field === 'stock') {
          processedValue = Math.max(0, parseInt(value) || 0);
          console.log(`🔧 Updating variant ${variant.colorName} stock to:`, processedValue);
        }
        
        if (field === 'isDefault' && value) {
          // If setting this as default, unset others
          return { ...variant, [field]: processedValue };
        }
        return { ...variant, [field]: processedValue };
      } else if (field === 'isDefault' && value) {
        // Unset default from other variants
        return { ...variant, isDefault: false };
      }
      return variant;
    });
    
    console.log('🔧 Updated variants:', updatedVariants);
    setLocalVariants(updatedVariants);
    onChange(updatedVariants);
  };

  const removeVariant = (index) => {
    const updatedVariants = localVariants.filter((_, i) => i !== index);
    
    // If we removed the default variant, make the first one default
    if (updatedVariants.length > 0 && !updatedVariants.some(v => v.isDefault)) {
      updatedVariants[0].isDefault = true;
    }
    
    setLocalVariants(updatedVariants);
    onChange(updatedVariants);
  };

  const handleImageUpload = (variantIndex, files) => {
    const updatedVariants = localVariants.map((variant, i) => {
      if (i === variantIndex) {
        return {
          ...variant,
          newImages: [...(variant.newImages || []), ...Array.from(files)]
        };
      }
      return variant;
    });
    
    setLocalVariants(updatedVariants);
    onChange(updatedVariants);
  };

  const removeNewImage = (variantIndex, imageIndex) => {
    const updatedVariants = localVariants.map((variant, i) => {
      if (i === variantIndex) {
        return {
          ...variant,
          newImages: variant.newImages.filter((_, imgI) => imgI !== imageIndex)
        };
      }
      return variant;
    });
    
    setLocalVariants(updatedVariants);
    onChange(updatedVariants);
  };

  const removeExistingImage = (variantIndex, imageIndex) => {
    const updatedVariants = localVariants.map((variant, i) => {
      if (i === variantIndex) {
        const updatedImages = variant.images.filter((_, imgI) => imgI !== imageIndex);
        return {
          ...variant,
          images: updatedImages,
          imagesToDelete: [...(variant.imagesToDelete || []), variant.images[imageIndex]?.publicId].filter(Boolean)
        };
      }
      return variant;
    });
    
    setLocalVariants(updatedVariants);
    onChange(updatedVariants);
  };

  return (
    <div className="variant-manager">
      <div className="variant-header">
        <h3>Product Variants</h3>
        <button
          type="button"
          onClick={addVariant}
          className="add-variant-btn"
        >
          <PlusIcon />
          Add Variant
        </button>
      </div>

      {localVariants.length === 0 ? (
        <div className="no-variants">
          <p>No variants added yet. Click "Add Variant" to create color variants for this product.</p>
        </div>
      ) : (
        <div className="variants-list">
          {localVariants.map((variant, index) => (
            <div key={variant.id} className="variant-item">
              <div className="variant-header">
                <h4>Variant {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="remove-variant-btn"
                  title="Remove variant"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="variant-form">
                <div className="variant-basic">
                  <div className="form-group">
                    <label>Color Name *</label>
                    <input
                      type="text"
                      value={variant.colorName}
                      onChange={(e) => updateVariant(index, 'colorName', e.target.value)}
                      placeholder="e.g., Black, Silver, Gold"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={variant.isDefault}
                        onChange={(e) => updateVariant(index, 'isDefault', e.target.checked)}
                      />
                      Default Variant
                    </label>
                  </div>
                </div>

                <div className="variant-images">
                  <label>Variant Images</label>
                  
                  {/* Existing Images */}
                  {variant.images && variant.images.length > 0 && (
                    <div className="existing-images">
                      <h5>Current Images</h5>
                      <div className="image-grid">
                        {variant.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="image-item">
                            <img src={image.url} alt={`${variant.colorName} variant`} />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index, imgIndex)}
                              className="remove-image-btn"
                              title="Remove image"
                            >
                              <TrashIcon />
                            </button>
                            {image.isMain && <span className="main-badge">Main</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {variant.newImages && variant.newImages.length > 0 && (
                    <div className="new-images">
                      <h5>New Images</h5>
                      <div className="image-grid">
                        {variant.newImages.map((file, imgIndex) => (
                          <div key={imgIndex} className="image-item">
                            <img src={URL.createObjectURL(file)} alt={`${variant.colorName} new`} />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index, imgIndex)}
                              className="remove-image-btn"
                              title="Remove image"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="upload-area">
                    <input
                      type="file"
                      id={`variant-images-${index}`}
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(index, e.target.files)}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor={`variant-images-${index}`} className="upload-btn">
                      <ImageIcon />
                      Upload Images
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantManager; 