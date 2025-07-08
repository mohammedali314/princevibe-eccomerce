import React, { useState, useEffect } from 'react';
import './VariantSelector.scss';

const VariantSelector = ({ variants = [], selectedVariant, onVariantChange, productName = '' }) => {
  const [localSelectedVariant, setLocalSelectedVariant] = useState(null);

  // Filter out invalid variants
  const validVariants = variants.filter(variant => 
    variant && 
    variant.colorName && 
    variant.colorName.trim() !== '' && 
    variant.id
  );

  useEffect(() => {
    if (validVariants.length > 0) {
      // Only set default variant if no variant is currently selected
      if (!selectedVariant && !localSelectedVariant) {
        const defaultVariant = validVariants.find(v => v.isDefault) || validVariants[0];
        setLocalSelectedVariant(defaultVariant);
        onVariantChange(defaultVariant);
      } else if (selectedVariant && selectedVariant.id !== localSelectedVariant?.id) {
        // Update local state if parent component changed the selected variant
        setLocalSelectedVariant(selectedVariant);
      }
    }
  }, [variants]); // Remove selectedVariant and onVariantChange from dependencies

  const handleVariantSelect = (variant) => {
    console.log('🎯 Selecting variant:', variant);
    console.log('🖼️ Variant images:', variant.images);
    setLocalSelectedVariant(variant);
    onVariantChange(variant);
  };

  // Calculate total stock and urgency
  const getTotalStock = () => {
    return validVariants.reduce((total, variant) => total + (variant.stock || 0), 0);
  };

  const getStockUrgency = () => {
    const totalStock = getTotalStock();
    const inStockVariants = validVariants.filter(v => v.stock > 0).length;
    
    if (totalStock === 0) {
      return { type: 'out', message: '🚨 All variants sold out!', urgent: true };
    } else if (totalStock <= 5) {
      return { type: 'low', message: ` Only ${totalStock} left in stock!`, urgent: true };
    } else if (inStockVariants <= 2) {
      return { type: 'low', message: `⚡ Limited colors available!`, urgent: true };
    } else {
      return { type: 'good', message: 'In Stock', urgent: false };
    }
  };

  const getVariantStockClass = (stock) => {
    if (stock === 0) return 'out';
    if (stock <= 2) return 'low';
    return 'good';
  };

  const getVariantStockText = (stock) => {
    if (stock === 0) return 'Sold Out';
    if (stock === 1) return 'Last One!';
    if (stock <= 2) return `${stock} Left`;
    return 'In Stock';
  };

  // Find most popular variant (highest stock initially, could be based on sales data)
  const getMostPopularVariant = () => {
    if (validVariants.length === 0) return null;
    return validVariants.reduce((prev, current) => 
      (current.stock > prev.stock) ? current : prev
    );
  };

  if (!variants || variants.length === 0 || validVariants.length === 0) {
    return null;
  }

  const stockUrgency = getStockUrgency();
  const popularVariant = getMostPopularVariant();

  return (
    <div className="variant-selector-compact">
      <div className="variant-label">
        <span>Color: <strong>{localSelectedVariant?.colorName || 'Select'}</strong></span>
        <div className={`stock-urgency ${stockUrgency.type} ${stockUrgency.urgent ? 'urgent' : ''}`}>
          <span className="fire-icon">{stockUrgency.urgent ? '🔥' : '✅'}</span>
          <span>{stockUrgency.message}</span>
        </div>
      </div>

      <div className="variant-options-compact">
        {validVariants.map((variant, index) => {
          const isSelected = localSelectedVariant && localSelectedVariant.id === variant.id;
          const isOutOfStock = variant.stock === 0;
          const isLowStock = variant.stock > 0 && variant.stock <= 2;
          const isPopular = popularVariant && variant.id === popularVariant.id && variant.stock > 0;
          
          // Get the first image from the variant
          let imageUrl = null;
          if (variant.images && variant.images.length > 0) {
            imageUrl = variant.images[0];
          }

          return (
            <div
              key={variant.id}
              className={`variant-option-compact ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''} ${isLowStock ? 'low-stock' : ''}`}
              onClick={() => !isOutOfStock && handleVariantSelect(variant)}
              title={`${variant.colorName || 'Unknown'} - ${getVariantStockText(variant.stock)}`}
            >
              <div className="variant-image-compact">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={`${productName} - ${variant.colorName || 'Unknown'}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-image-compact">
                    <span>{variant.colorName?.charAt(0).toUpperCase() || 'N/A'}</span>
                  </div>
                )}
                
                {isOutOfStock && (
                  <div className="out-of-stock-badge">
                    <span>✗</span>
                  </div>
                )}
                
                {isSelected && !isOutOfStock && (
                  <div className="selected-badge">
                    <span>✓</span>
                  </div>
                )}

                {isPopular && !isSelected && !isOutOfStock && (
                  <div className="popular-badge">
                    HOT
                  </div>
                )}
              </div>
              
              <div className="variant-name-compact">
                <span>{variant.colorName || 'Unknown'}</span>
              </div>
              
              <div className={`stock-indicator-mini ${getVariantStockClass(variant.stock)}`}>
                {getVariantStockText(variant.stock)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector; 