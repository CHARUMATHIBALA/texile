import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Footer from './Footer';

export default function DesignYourBedsheet() {
  const { addToCart } = useCart();
  
  const [customization, setCustomization] = useState({
    bedSize: 'Double',
    fabricType: 'cotton',
    color: '#F5F5DC',
    printPattern: 'solid',
    pillowMatching: true,
    pillowColor: '#F5F5DC',
    threadCount: '250'
  });

  const [price, setPrice] = useState(2799);
  const [showRoomPreview, setShowRoomPreview] = useState(true);
  const [zoomedFabric, setZoomedFabric] = useState(null);

  const basePrice = 2000;
  const sizePrices = {
    'Single': 0,
    'Double': 500,
    'Queen': 800,
    'King': 1200
  };
  const fabricPrices = {
    'cotton': 0,
    'premium': 500,
    'silk': 1500
  };
  const threadCountPrices = {
    '200': 0,
    '250': 300,
    '300': 600,
    '400': 1000
  };

  const bedSizes = [
    { value: 'Single', label: 'Single', dimensions: '90cm × 190cm', icon: '🛏️' },
    { value: 'Double', label: 'Double', dimensions: '135cm × 190cm', icon: '🛏️' },
    { value: 'Queen', label: 'Queen', dimensions: '150cm × 200cm', icon: '🛏️' },
    { value: 'King', label: 'King', dimensions: '180cm × 200cm', icon: '🛏️' }
  ];

  const fabricTypes = [
    { value: 'cotton', label: 'Standard Cotton', description: '100% Pure Cotton', price: 0 },
    { value: 'premium', label: 'Premium Cotton', description: 'Extra Soft & Durable', price: 500 },
    { value: 'silk', label: 'Silk Blend', description: 'Luxury Silk-Cotton Mix', price: 1500 }
  ];

  const colorOptions = [
    { color: '#F5F5DC', name: 'Cream', category: 'neutral' },
    { color: '#FFF8DC', name: 'Cornsilk', category: 'neutral' },
    { color: '#DEB887', name: 'Burlywood', category: 'warm' },
    { color: '#D2B48C', name: 'Tan', category: 'warm' },
    { color: '#8B4513', name: 'Saddle Brown', category: 'warm' },
    { color: '#F0E68C', name: 'Khaki', category: 'neutral' },
    { color: '#E6E6FA', name: 'Lavender', category: 'cool' },
    { color: '#DDA0DD', name: 'Plum', category: 'cool' },
    { color: '#98D8C8', name: 'Mint', category: 'cool' },
    { color: '#F5DEB3', name: 'Wheat', category: 'warm' },
    { color: '#FFE4B5', name: 'Moccasin', category: 'warm' },
    { color: '#FAEBD7', name: 'Antique White', category: 'neutral' }
  ];

  const printPatterns = [
    { value: 'solid', label: 'Solid', description: 'Clean solid color', preview: 'solid' },
    { value: 'floral', label: 'Floral', description: 'Elegant flower patterns', preview: 'floral' },
    { value: 'geometric', label: 'Geometric', description: 'Modern geometric shapes', preview: 'geometric' },
    { value: 'striped', label: 'Striped', description: 'Classic stripes', preview: 'striped' },
    { value: 'paisley', label: 'Paisley', description: 'Traditional paisley', preview: 'paisley' },
    { value: 'damask', label: 'Damask', description: 'Luxury damask weave', preview: 'damask' }
  ];

  const threadCounts = [
    { value: '200', label: '200 TC', description: 'Standard', price: 0 },
    { value: '250', label: '250 TC', description: 'Premium', price: 300 },
    { value: '300', label: '300 TC', description: 'Luxury', price: 600 },
    { value: '400', label: '400 TC', description: 'Ultra Luxury', price: 1000 }
  ];

  // Calculate price
  useEffect(() => {
    let total = basePrice;
    total += sizePrices[customization.bedSize] || 0;
    total += fabricPrices[customization.fabricType] || 0;
    total += threadCountPrices[customization.threadCount] || 0;
    setPrice(total);
  }, [customization]);

  const handleChange = (field, value) => {
    // Auto-match pillow color when bedsheet color changes
    if (field === 'color' && customization.pillowMatching) {
      setCustomization(prev => ({
        ...prev,
        color: value,
        pillowColor: value
      }));
    } else {
      setCustomization(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddToCart = () => {
    const product = {
      id: `bedsheet-custom-${Date.now()}`,
      name: `Custom ${customization.bedSize} Bedsheet Set`,
      price: price,
      image: '/1.jpg',
      category: 'bedsheets',
      customization: { ...customization }
    };

    addToCart(product, customization.bedSize, customization.color, 1);
    alert('Custom bedsheet set added to cart!');
  };

  const selectedFabric = fabricTypes.find(f => f.value === customization.fabricType);
  const selectedPattern = printPatterns.find(p => p.value === customization.printPattern);

  return (
    <>
      <div className="design-bedsheet-container">
        <div className="design-bedsheet-hero">
          <h1 className="design-bedsheet-title">Design Your Bedsheet</h1>
          <p className="design-bedsheet-subtitle">Create the perfect bedroom aesthetic with custom bedsheets</p>
        </div>

        <div className="design-bedsheet-content">
          {/* Customization Panel */}
          <div className="bedsheet-customization-panel">
            <h2 className="panel-title">Customize Your Bedsheet</h2>

            {/* Bed Size */}
            <div className="customization-section">
              <h3 className="section-title">Bed Size</h3>
              <div className="bed-size-grid">
                {bedSizes.map(size => (
                  <button
                    key={size.value}
                    className={`bed-size-card ${customization.bedSize === size.value ? 'active' : ''}`}
                    onClick={() => handleChange('bedSize', size.value)}
                  >
                    <span className="size-icon">{size.icon}</span>
                    <div className="size-label">{size.label}</div>
                    <div className="size-dimensions">{size.dimensions}</div>
                    {sizePrices[size.value] > 0 && (
                      <div className="size-price">+₹{sizePrices[size.value]}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="customization-section">
              <h3 className="section-title">Color</h3>
              <div className="color-swatches-grid">
                {colorOptions.map((swatch, idx) => (
                  <button
                    key={idx}
                    className={`color-swatch ${customization.color === swatch.color ? 'active' : ''}`}
                    onClick={() => handleChange('color', swatch.color)}
                    style={{ backgroundColor: swatch.color }}
                    title={swatch.name}
                    onMouseEnter={() => setZoomedFabric(swatch)}
                    onMouseLeave={() => setZoomedFabric(null)}
                  >
                    {customization.color === swatch.color && (
                      <span className="swatch-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="form-group">
                <label>Custom Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={customization.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={customization.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="color-text"
                  />
                </div>
              </div>
            </div>

            {/* Print Pattern */}
            <div className="customization-section">
              <h3 className="section-title">Print Pattern</h3>
              <div className="pattern-options-grid">
                {printPatterns.map(pattern => (
                  <button
                    key={pattern.value}
                    className={`pattern-option-card ${customization.printPattern === pattern.value ? 'active' : ''}`}
                    onClick={() => handleChange('printPattern', pattern.value)}
                    onMouseEnter={() => setZoomedFabric({ color: customization.color, pattern: pattern.value })}
                    onMouseLeave={() => setZoomedFabric(null)}
                  >
                    <div 
                      className="pattern-preview-card"
                      style={{ backgroundColor: customization.color }}
                      data-pattern={pattern.value}
                    >
                      <div className="pattern-card-inner"></div>
                    </div>
                    <div className="pattern-card-info">
                      <span className="pattern-card-label">{pattern.label}</span>
                      <small className="pattern-card-desc">{pattern.description}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Type */}
            <div className="customization-section">
              <h3 className="section-title">Fabric Type</h3>
              <div className="fabric-type-options">
                {fabricTypes.map(fabric => (
                  <label
                    key={fabric.value}
                    className={`fabric-type-card ${customization.fabricType === fabric.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="fabricType"
                      value={fabric.value}
                      checked={customization.fabricType === fabric.value}
                      onChange={(e) => handleChange('fabricType', e.target.value)}
                    />
                    <div className="fabric-type-content">
                      <span className="fabric-type-label">{fabric.label}</span>
                      <span className="fabric-type-desc">{fabric.description}</span>
                      {fabric.price > 0 && (
                        <span className="fabric-type-price">+₹{fabric.price}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Thread Count */}
            <div className="customization-section">
              <h3 className="section-title">Thread Count</h3>
              <div className="thread-count-options">
                {threadCounts.map(tc => (
                  <label
                    key={tc.value}
                    className={`thread-count-card ${customization.threadCount === tc.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="threadCount"
                      value={tc.value}
                      checked={customization.threadCount === tc.value}
                      onChange={(e) => handleChange('threadCount', e.target.value)}
                    />
                    <div className="thread-count-content">
                      <span className="thread-count-label">{tc.label}</span>
                      <span className="thread-count-desc">{tc.description}</span>
                      {tc.price > 0 && (
                        <span className="thread-count-price">+₹{tc.price}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Pillow Cover Matching */}
            <div className="customization-section">
              <h3 className="section-title">Pillow Covers</h3>
              <div className="pillow-matching-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={customization.pillowMatching}
                    onChange={(e) => {
                      const matching = e.target.checked;
                      handleChange('pillowMatching', matching);
                      if (matching) {
                        handleChange('pillowColor', customization.color);
                      }
                    }}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">Match Bedsheet Color</span>
                </label>
              </div>
              {!customization.pillowMatching && (
                <div className="form-group">
                  <label>Pillow Cover Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={customization.pillowColor}
                      onChange={(e) => handleChange('pillowColor', e.target.value)}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={customization.pillowColor}
                      onChange={(e) => handleChange('pillowColor', e.target.value)}
                      className="color-text"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview Toggle */}
            <div className="customization-section">
              <div className="preview-toggle-group">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showRoomPreview}
                    onChange={(e) => setShowRoomPreview(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">Preview in Room</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                Add to Cart - ₹{price.toLocaleString('en-IN')}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bedsheet-preview-panel">
            <h2 className="panel-title">Live Preview</h2>
            
            <div className={`bedsheet-preview-container ${showRoomPreview ? 'room-mode' : 'isolated-mode'}`}>
              {showRoomPreview ? (
                <div className="bedroom-environment">
                  <div className="bedroom-background">
                    <div className="bedroom-wall"></div>
                    <div className="bedroom-floor"></div>
                    <div className="bedroom-window"></div>
                    <div className="bedroom-furniture">
                      <div className="furniture nightstand left"></div>
                      <div className="furniture nightstand right"></div>
                      <div className="furniture lamp left"></div>
                      <div className="furniture lamp right"></div>
                    </div>
                  </div>
                  
                  <div className="bed-frame">
                    <div 
                      key={`bedsheet-room-${customization.color}-${customization.bedSize}-${customization.printPattern}`}
                      className="bedsheet-preview"
                      style={{
                        backgroundColor: customization.color,
                        width: customization.bedSize === 'Single' ? '35%' : 
                               customization.bedSize === 'Double' ? '45%' : 
                               customization.bedSize === 'Queen' ? '55%' : '65%'
                      }}
                      data-pattern={customization.printPattern}
                      data-fabric={customization.fabricType}
                      data-thread={customization.threadCount}
                    >
                      <div className="bedsheet-texture"></div>
                      <div className="bedsheet-pattern"></div>
                      <div className="bedsheet-folds"></div>
                    </div>
                    
                    {customization.pillowMatching && (
                      <div 
                        className="pillow-preview matching"
                        style={{ backgroundColor: customization.color }}
                        data-pattern={customization.printPattern}
                      >
                        <div className="pillow-texture"></div>
                        <div className="pillow-pattern"></div>
                      </div>
                    )}
                    {!customization.pillowMatching && (
                      <div 
                        className="pillow-preview custom"
                        style={{ backgroundColor: customization.pillowColor }}
                      >
                        <div className="pillow-texture"></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="isolated-bedsheet-view">
                  <div 
                    key={`bedsheet-flat-${customization.color}-${customization.bedSize}-${customization.printPattern}`}
                    className="bedsheet-flat-preview"
                    style={{ backgroundColor: customization.color }}
                    data-pattern={customization.printPattern}
                    data-fabric={customization.fabricType}
                  >
                    <div className="bedsheet-texture"></div>
                    <div className="bedsheet-pattern"></div>
                    <div className="bedsheet-shadow"></div>
                  </div>
                  {customization.pillowMatching && (
                    <div 
                      className="pillow-flat-preview matching"
                      style={{ backgroundColor: customization.color }}
                      data-pattern={customization.printPattern}
                    >
                      <div className="pillow-texture"></div>
                      <div className="pillow-pattern"></div>
                    </div>
                  )}
                </div>
              )}

              {/* Fabric Zoom Effect */}
              {zoomedFabric && (
                <div className="fabric-zoom-overlay">
                  <div 
                    className="zoomed-fabric-preview"
                    style={{ backgroundColor: zoomedFabric.color }}
                    data-pattern={zoomedFabric.pattern || customization.printPattern}
                  >
                    <div className="zoomed-texture"></div>
                    <div className="zoomed-pattern"></div>
                  </div>
                  <p className="zoom-fabric-name">{zoomedFabric.name || selectedPattern?.label}</p>
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="price-display">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Base Price</span>
                  <span>₹{basePrice}</span>
                </div>
                {sizePrices[customization.bedSize] > 0 && (
                  <div className="price-item">
                    <span>Size ({customization.bedSize})</span>
                    <span>+₹{sizePrices[customization.bedSize]}</span>
                  </div>
                )}
                {fabricPrices[customization.fabricType] > 0 && (
                  <div className="price-item">
                    <span>Fabric Upgrade</span>
                    <span>+₹{fabricPrices[customization.fabricType]}</span>
                  </div>
                )}
                {threadCountPrices[customization.threadCount] > 0 && (
                  <div className="price-item">
                    <span>Thread Count ({customization.threadCount} TC)</span>
                    <span>+₹{threadCountPrices[customization.threadCount]}</span>
                  </div>
                )}
                <div className="price-item">
                  <span>Pillow Covers (2 pcs)</span>
                  <span>Included</span>
                </div>
                <div className="price-total">
                  <span>Total</span>
                  <span>₹{price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
