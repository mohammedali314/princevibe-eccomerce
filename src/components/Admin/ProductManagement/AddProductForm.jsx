import React, { useState } from 'react';
import AdminApi from '../../../services/adminApi';
import './AddProductForm.scss';

// Custom SVG Icons
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const PhotoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <path d="M7 7h.01" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const AddProductForm = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'luxury',
    price: '',
    originalPrice: '',
    description: '',
    shortDescription: '',
    rating: 0,
    reviews: 0,
    specifications: {
      movement: '',
      caseMaterial: '',
      waterResistance: '',
      crystal: '',
      bezel: '',
      bracelet: '',
      display: '',
      customFields: []
    },
    features: [''],
    images: [],
    badge: '',
    quantity: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'mm'
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [''],
      slug: ''
    },
    isFeatured: false,
    tags: ['']
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Categories and badges options
  const categoryOptions = [
    { value: 'luxury', label: 'Luxury' },
    { value: 'smart', label: 'Smart Watch' },
    { value: 'sport', label: 'Sport' },
    { value: 'classic', label: 'Classic' }
  ];

  const badgeOptions = [
    { value: '', label: 'No Badge' },
    { value: 'Bestseller', label: 'Bestseller' },
    { value: 'New', label: 'New' },
    { value: 'Limited', label: 'Limited Edition' },
    { value: 'Popular', label: 'Popular' },
    { value: 'Exclusive', label: 'Exclusive' },
    { value: 'Value', label: 'Best Value' },
    { value: 'Racing', label: 'Racing' },
    { value: 'Tough', label: 'Tough' },
    { value: 'Heritage', label: 'Heritage' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Dive', label: 'Dive' },
    { value: 'Iconic', label: 'Iconic' }
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: TagIcon },
    { id: 2, title: 'Images', icon: PhotoIcon },
    { id: 3, title: 'Specifications', icon: BoxIcon },
    { id: 4, title: 'Features & SEO', icon: StarIcon }
  ];

  // Handle input changes
  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle array fields (features, tags, keywords)
  const handleArrayChange = (field, index, value, nested = null) => {
    if (nested) {
      const newArray = [...formData[nested][field]];
      newArray[index] = value;
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: newArray
        }
      }));
    } else {
      const newArray = [...formData[field]];
      newArray[index] = value;
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const addArrayField = (field, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: [...prev[nested][field], '']
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  };

  const removeArrayField = (field, index, nested = null) => {
    if (nested) {
      const newArray = formData[nested][field].filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: newArray
        }
      }));
    } else {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  // Handle custom specification fields
  const addCustomSpecField = () => {
    const newCustomFields = [...formData.specifications.customFields, { key: '', value: '' }];
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        customFields: newCustomFields
      }
    }));
  };

  const handleCustomSpecChange = (index, field, value) => {
    const newCustomFields = [...formData.specifications.customFields];
    newCustomFields[index][field] = value;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        customFields: newCustomFields
      }
    }));
  };

  const removeCustomSpecField = (index) => {
    const newCustomFields = formData.specifications.customFields.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        customFields: newCustomFields
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            url: e.target.result,
            file: file,
            isMain: prev.images.length === 0,
            alt: file.name
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const setMainImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isMain: i === index
      }))
    }));
  };

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle name change and auto-generate SEO fields
  const handleNameChange = (value) => {
    handleInputChange('name', value);
    
    if (value) {
      const slug = generateSlug(value);
      handleInputChange('slug', slug, 'seo');
      
      if (!formData.seo.metaTitle) {
        handleInputChange('metaTitle', value, 'seo');
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add product data
      const productData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim()),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.filter(k => k.trim())
        }
      };
      
      delete productData.images; // Remove images from JSON data
      
      submitData.append('productData', JSON.stringify(productData));
      
      // Add image files
      imageFiles.forEach((file, index) => {
        submitData.append('images', file);
        if (formData.images[index]?.isMain) {
          submitData.append('mainImageIndex', index.toString());
        }
      });
      
      await AdminApi.createProduct(submitData);
      
      // Reset form
      setFormData({
        name: '',
        category: 'luxury',
        price: '',
        originalPrice: '',
        description: '',
        shortDescription: '',
        rating: 0,
        reviews: 0,
        specifications: {
          movement: '',
          caseMaterial: '',
          waterResistance: '',
          crystal: '',
          bezel: '',
          bracelet: '',
          display: '',
          customFields: []
        },
        features: [''],
        images: [],
        badge: '',
        quantity: '',
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: '',
          unit: 'mm'
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [''],
          slug: ''
        },
        isFeatured: false,
        tags: ['']
      });
      setImageFiles([]);
      setErrors({});
      setCurrentStep(1);
      
      onProductAdded && onProductAdded();
      onClose();
      
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({ submit: 'Failed to create product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="add-product-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        {/* Header with Steps */}
        <div className="modal-header">
          <div className="header-content">
            <h2>Add New Product</h2>
            <div className="step-indicator">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={step.id} 
                    className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="step-icon">
                      <IconComponent />
                    </div>
                    <span className="step-title">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="form-step active">
              <div className="step-header">
                <TagIcon />
                <h3>Basic Information</h3>
                <p>Enter the essential details about your product</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (PKR) *</label>
                  <div className="input-with-icon">
                    <DollarIcon />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0"
                      className={errors.price ? 'error' : ''}
                    />
                  </div>
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label>Original Price (PKR)</label>
                  <div className="input-with-icon">
                    <DollarIcon />
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                  >
                    {badgeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <div className="input-with-icon">
                    <BoxIcon />
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="0"
                      className={errors.quantity ? 'error' : ''}
                    />
                  </div>
                  {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                </div>

                <div className="form-group">
                  <label>Product Rating</label>
                  <div className="input-with-icon">
                    <StarIcon />
                    <input
                      type="number"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)))}
                      placeholder="0.0"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  <small className="form-help">Rating from 0 to 5 stars (e.g., 4.5)</small>
                </div>

                <div className="form-group">
                  <label>Number of Reviews</label>
                  <div className="input-with-icon">
                    <StarIcon />
                    <input
                      type="number"
                      value={formData.reviews}
                      onChange={(e) => handleInputChange('reviews', Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <small className="form-help">Total number of customer reviews (e.g., 25)</small>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief product description (max 500 characters)"
                  maxLength={500}
                />
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description"
                  rows={5}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Featured Product
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <div className="form-step active">
              <div className="step-header">
                <PhotoIcon />
                <h3>Product Images</h3>
                <p>Upload high-quality images of your product</p>
              </div>

              <div className="image-upload-section">
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="upload-label">
                    <div className="upload-icon">
                      <PhotoIcon />
                    </div>
                    <h4>Upload Product Images</h4>
                    <p>Drag & drop images here or click to browse</p>
                    <small>Supports PNG, JPG, WebP up to 10MB each</small>
                  </label>
                </div>
                
                {errors.images && <span className="error-text">{errors.images}</span>}
                
                {formData.images.length > 0 && (
                  <div className="image-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className={`image-item ${image.isMain ? 'main' : ''}`}>
                        <div className="image-container">
                          <img src={image.url} alt={image.alt} />
                          <div className="image-overlay">
                            <button
                              type="button"
                              onClick={() => setMainImage(index)}
                              className={`main-btn ${image.isMain ? 'active' : ''}`}
                            >
                              {image.isMain ? 'Main Image' : 'Set as Main'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="remove-btn"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                        {image.isMain && <div className="main-badge">Main</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Specifications */}
          {currentStep === 3 && (
            <div className="form-step active">
              <div className="step-header">
                <BoxIcon />
                <h3>Specifications</h3>
                <p>Add technical specifications and details</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Movement</label>
                  <input
                    type="text"
                    value={formData.specifications.movement}
                    onChange={(e) => handleInputChange('movement', e.target.value, 'specifications')}
                    placeholder="e.g., Automatic, Quartz"
                  />
                </div>

                <div className="form-group">
                  <label>Case Material</label>
                  <input
                    type="text"
                    value={formData.specifications.caseMaterial}
                    onChange={(e) => handleInputChange('caseMaterial', e.target.value, 'specifications')}
                    placeholder="e.g., Stainless Steel, Gold"
                  />
                </div>

                <div className="form-group">
                  <label>Water Resistance</label>
                  <input
                    type="text"
                    value={formData.specifications.waterResistance}
                    onChange={(e) => handleInputChange('waterResistance', e.target.value, 'specifications')}
                    placeholder="e.g., 100m, 30ATM"
                  />
                </div>

                <div className="form-group">
                  <label>Crystal</label>
                  <input
                    type="text"
                    value={formData.specifications.crystal}
                    onChange={(e) => handleInputChange('crystal', e.target.value, 'specifications')}
                    placeholder="e.g., Sapphire, Mineral"
                  />
                </div>

                <div className="form-group">
                  <label>Bezel</label>
                  <input
                    type="text"
                    value={formData.specifications.bezel}
                    onChange={(e) => handleInputChange('bezel', e.target.value, 'specifications')}
                    placeholder="e.g., Unidirectional, Fixed"
                  />
                </div>

                <div className="form-group">
                  <label>Bracelet/Strap</label>
                  <input
                    type="text"
                    value={formData.specifications.bracelet}
                    onChange={(e) => handleInputChange('bracelet', e.target.value, 'specifications')}
                    placeholder="e.g., Leather, Steel"
                  />
                </div>
              </div>

              {/* Custom Specifications */}
              <div className="custom-specs">
                <h4>Additional Specifications</h4>
                {formData.specifications.customFields.map((field, index) => (
                  <div key={index} className="custom-spec-row">
                    <input
                      type="text"
                      placeholder="Property name"
                      value={field.key}
                      onChange={(e) => handleCustomSpecChange(index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => handleCustomSpecChange(index, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomSpecField(index)}
                      className="remove-btn"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCustomSpecField}
                  className="add-spec-btn"
                >
                  <PlusIcon />
                  Add Specification
                </button>
              </div>

              {/* Dimensions & Weight */}
              <div className="dimensions-section">
                <h4>Physical Properties</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Weight (grams)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Length (mm)</label>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('length', e.target.value, 'dimensions')}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Width (mm)</label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('width', e.target.value, 'dimensions')}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Height (mm)</label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('height', e.target.value, 'dimensions')}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Features & SEO */}
          {currentStep === 4 && (
            <div className="form-step active">
              <div className="step-header">
                <StarIcon />
                <h3>Features & SEO</h3>
                <p>Add product features and optimize for search engines</p>
              </div>

              {/* Features */}
              <div className="features-section">
                <h4>Product Features</h4>
                <div className="array-fields">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="array-field">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                        placeholder="Enter a feature"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('features', index)}
                          className="remove-btn"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('features')}
                    className="add-field-btn"
                  >
                    <PlusIcon />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="tags-section">
                <h4>Product Tags</h4>
                <div className="array-fields">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="array-field">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        placeholder="Enter a tag"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('tags', index)}
                          className="remove-btn"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('tags')}
                    className="add-field-btn"
                  >
                    <PlusIcon />
                    Add Tag
                  </button>
                </div>
              </div>

              {/* SEO */}
              <div className="seo-section">
                <h4>SEO Optimization</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>SEO Title</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value, 'seo')}
                      placeholder="SEO optimized title"
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Slug</label>
                    <input
                      type="text"
                      value={formData.seo.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value, 'seo')}
                      placeholder="product-url-slug"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Meta Description</label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value, 'seo')}
                    placeholder="SEO meta description"
                    rows={3}
                  />
                </div>

                <div className="form-group full-width">
                  <label>SEO Keywords</label>
                  <div className="array-fields">
                    {formData.seo.keywords.map((keyword, index) => (
                      <div key={index} className="array-field">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => handleArrayChange('keywords', index, e.target.value, 'seo')}
                          placeholder="Enter a keyword"
                        />
                        {formData.seo.keywords.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField('keywords', index, 'seo')}
                            className="remove-btn"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('keywords', 'seo')}
                      className="add-field-btn"
                    >
                      <PlusIcon />
                      Add Keyword
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation & Submit */}
          <div className="form-navigation">
            <div className="nav-buttons">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="nav-btn prev">
                  Previous
                </button>
              )}
              {currentStep < 4 && (
                <button type="button" onClick={nextStep} className="nav-btn next">
                  Next
                </button>
              )}
            </div>

            {currentStep === 4 && (
              <div className="form-actions">
                {errors.submit && <div className="error-text">{errors.submit}</div>}
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <PlusIcon />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm; 