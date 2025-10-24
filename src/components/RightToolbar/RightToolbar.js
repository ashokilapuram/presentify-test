import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './RightToolbar.css';
import { 
  FiType, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight,
  FiAlignJustify,
  FiBold,
  FiItalic,
  FiUnderline,
  FiRotateCw,
  FiRotateCcw,
  FiCopy,
  FiTrash2,
  FiLayers,
  FiTrash,
  FiSquare,
  FiCircle,
  FiTriangle,
  FiImage,
  FiVideo,
  FiMusic,
  FiBarChart2,
  FiPieChart,
  FiTable,
  FiCalendar,
  FiMap,
  FiStar,
  FiHeart,
  FiSmile,
  FiDroplet,
  FiUpload,
  FiTrendingUp,
  FiZap,
  FiSun,
  FiMoon,
  FiFeather,
  FiDownload,
  FiFolderOpen
} from 'react-icons/fi';

const RightToolbar = ({ 
  selectedElement, 
  textFormatting,
  setTextFormatting, 
  updateSlideElement,
  updateSlide,
  currentSlide,
  addTextBox,
  addShape,
  addImage,
  addChart,
  deselectElement,
  onTabChange,
  slides,
  forceTab,
  onTabForced,
}) => {
  const [activeTab, setActiveTab] = useState('Insert');
  
  // Sliding highlight indicator state
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Handle forced tab changes from parent
  useEffect(() => {
    if (forceTab) {
      setActiveTab(forceTab);
      if (onTabForced) {
        onTabForced();
      }
    }
  }, [forceTab, onTabForced]);

  const updateIndicator = () => {
    const container = tabsContainerRef.current;
    const el = tabRefs.current[activeTab];
    if (!container || !el) return;
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    const left = tRect.left - cRect.left;
    const width = tRect.width;
    setIndicator({ left, width });
  };

  useEffect(() => {
    updateIndicator();
    const handle = () => updateIndicator();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Call the parent tab change handler to deselect element
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  const handleFormatChange = (property, value) => {
    const newFormatting = { ...textFormatting, [property]: value };
    setTextFormatting(newFormatting);
    
    if (selectedElement) {
      updateSlideElement(selectedElement.id, { [property]: value });
    }
  };

  const toggleFormat = (property) => {
    const currentValue = textFormatting[property];
    let newValue;
    
    switch (property) {
      case 'fontWeight':
        newValue = currentValue === 'bold' ? 'normal' : 'bold';
        break;
      case 'fontStyle':
        newValue = currentValue === 'italic' ? 'normal' : 'italic';
        break;
      case 'textDecoration':
        newValue = currentValue === 'underline' ? 'none' : 'underline';
        break;
      default:
        newValue = currentValue;
    }
    
    handleFormatChange(property, newValue);
  };

  const renderDesignOptions = () => (
    <div className="right-toolbar-section">

      <div className="section-title">Themes</div>
      <div className="theme-images-grid">
        <div 
          className="theme-image-placeholder"
          onClick={() => updateSlide && updateSlide({ 
            backgroundImage: '/images/themes/theme1.jpg',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })}
        >
          <img 
            src="/images/themes/theme1.jpg" 
            alt="Theme 1" 
            className="theme-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="theme-fallback" style={{ display: 'none' }}>
            <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
          </div>
        </div>
        <div 
          className="theme-image-placeholder"
          onClick={() => updateSlide && updateSlide({ 
            backgroundImage: '/images/themes/theme2.jpg',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })}
        >
          <img 
            src="/images/themes/theme2.jpg" 
            alt="Theme 2" 
            className="theme-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="theme-fallback" style={{ display: 'none' }}>
            <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
          </div>
        </div>
        <div 
          className="theme-image-placeholder"
          onClick={() => updateSlide && updateSlide({ 
            backgroundImage: '/images/themes/theme3.jpg',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })}
        >
          <img 
            src="/images/themes/theme3.jpg" 
            alt="Theme 3" 
            className="theme-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="theme-fallback" style={{ display: 'none' }}>
            <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
          </div>
        </div>
        <div 
          className="theme-image-placeholder"
          onClick={() => updateSlide && updateSlide({ 
            backgroundImage: '/images/themes/theme4.jpg',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })}
        >
          <img 
            src="/images/themes/theme4.jpg" 
            alt="Theme 4" 
            className="theme-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="theme-fallback" style={{ display: 'none' }}>
            <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
          </div>
        </div>
        <div 
          className="theme-image-placeholder"
          onClick={() => updateSlide && updateSlide({ 
            backgroundImage: '/images/themes/theme5.jpg',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })}
        >
          <img 
            src="/images/themes/theme5.jpg" 
            alt="Theme 5" 
            className="theme-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="theme-fallback" style={{ display: 'none' }}>
            <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
          </div>
        </div>
        <div 
          className="theme-image-placeholder"
          onClick={() => updateSlide && updateSlide({ 
            backgroundImage: '/images/themes/theme6.jpg',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })}
        >
          <img 
            src="/images/themes/theme6.jpg" 
            alt="Theme 6" 
            className="theme-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="theme-fallback" style={{ display: 'none' }}>
            <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
          </div>
        </div>
      </div>


      <div className="section-title">
        <FiDroplet style={{ marginRight: 8 }} />
        Background
      </div>
      <div className="option-group">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* First Column: Quick Colors - 2 rows, 4 colors each */}
          <div className="quick-colors-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#ffffff', border: '1.5px solid #e5e7eb' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#ffffff',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="White"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#f3f4f6' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#f3f4f6',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Light Gray"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#0ea5e9' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#0ea5e9',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Sky Blue"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#1e293b' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#1e293b',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Dark Slate"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#8b5cf6' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#8b5cf6',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Purple"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#10b981' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#10b981',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Emerald"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#f59e0b' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#f59e0b',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Amber"
            ></div>
            <div 
              className="color-swatch-small" 
              style={{ backgroundColor: '#f43f5e' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                updateSlide && updateSlide({ 
                  backgroundColor: '#f43f5e',
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                }); 
              }}
              title="Rose"
            ></div>
          </div>

          {/* Second Column: Color Picker, Image Upload, and Delete Button in a row */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px' }}>
              <input
                type="color"
                value={currentSlide?.backgroundColor || '#ffffff'}
                onChange={(e) => {
                  e.stopPropagation();
                  updateSlide && updateSlide({ 
                    backgroundColor: e.target.value,
                    backgroundImage: null,
                    backgroundSize: null,
                    backgroundPosition: null,
                    backgroundRepeat: null
                  });
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2
                }}
                title="Pick custom color"
              />
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    updateSlide && updateSlide({ backgroundImage: ev.target.result });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
              style={{
                width: '36px',
                height: '36px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
              title="Upload background image"
            >
              <FiImage />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateSlide && updateSlide({ 
                  backgroundColor: undefined,
                  backgroundImage: null,
                  backgroundSize: null,
                  backgroundPosition: null,
                  backgroundRepeat: null
                });
              }}
              style={{
                width: '36px',
                height: '36px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
              title="Remove background"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

    </div>
  );


  const renderInsertOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Text elements</div>
      <div className="text-elements-row">
        <button className="text-element-button" onClick={() => addTextBox('title')}>
          <FiType />
          <span>Title</span>
        </button>
        <button className="text-element-button" onClick={() => addTextBox('subtitle')}>
          <FiType />
          <span>Subtitle</span>
        </button>
        <button className="text-element-button" onClick={() => addTextBox('content')}>
          <FiType />
          <span>Content</span>
        </button>
      </div>

      <div className="section-title">Shapes</div>
      <div className="shapes-row">
        <button className="shape-icon-button" onClick={() => addShape('square')} title="Square (resizable)">
          <FiSquare />
        </button>
        <button className="shape-icon-button" onClick={() => addShape('circle')}>
          <FiCircle />
        </button>
        <button className="shape-icon-button" onClick={() => addShape('triangle')}>
          <FiTriangle />
        </button>
        <button className="shape-icon-button" onClick={() => addShape('star')}>
          <FiStar />
        </button>
      </div>

      <div className="section-title">Charts</div>
      <div className="charts-row">
        <button className="chart-element-button" onClick={() => addChart('bar')}>
          <FiBarChart2 />
          <span>Bar</span>
        </button>
        <button className="chart-element-button" onClick={() => addChart('line')}>
          <FiTrendingUp />
          <span>Line</span>
        </button>
        <button className="chart-element-button" onClick={() => addChart('pie')}>
          <FiPieChart />
          <span>Pie</span>
        </button>
      </div>

      <div className="section-title">Media</div>
      <div className="media-row">
        <button className="media-element-button" onClick={addImage}>
          <FiImage />
          <span>Image</span>
        </button>
      </div>



    </div>
  );


  const renderDefaultOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Quick actions</div>
      <div className="option-group">
        <button className="quick-button" onClick={() => addTextBox('content')}>
          <FiType />
          <span>Add Text</span>
        </button>
        <button className="quick-button" onClick={() => addShape('square')}>
          <FiSquare />
          <span>Add Shape</span>
        </button>
        <button className="quick-button" onClick={addImage}>
          <FiImage />
          <span>Add Image</span>
        </button>
      </div>

      <div className="section-title">Properties</div>
      <div className="option-group">
        {selectedElement ? (
          <div className="element-info">
            <div className="info-row">
              <span>Type:</span>
              <span>{selectedElement.type}</span>
            </div>
            <div className="info-row">
              <span>X:</span>
              <span>{Math.round(selectedElement.x)}px</span>
            </div>
            <div className="info-row">
              <span>Y:</span>
              <span>{Math.round(selectedElement.y)}px</span>
            </div>
            <div className="info-row">
              <span>Width:</span>
              <span>{Math.round(selectedElement.width)}px</span>
            </div>
            <div className="info-row">
              <span>Height:</span>
              <span>{Math.round(selectedElement.height)}px</span>
            </div>
            {selectedElement.type === 'chart' && (
              <>
                <div className="info-row">
                  <span>Chart:</span>
                  <span>{selectedElement.chartType}</span>
                </div>

                <div className="section-title" style={{ marginTop: 10 }}>Chart color</div>
                <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="color"
                    value={selectedElement.color || '#0ea5e9'}
                    onChange={(e) => updateSlideElement(selectedElement.id, { color: e.target.value })}
                    className="color-input"
                  />
                </div>

                <div className="section-title" style={{ marginTop: 10 }}>Data points</div>
                <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedElement.labels || []).map((label, index) => {
                    const value = (selectedElement.values || [])[index] ?? 0;
                    return (
                      <div key={index} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(60px, 80px) minmax(28px, 32px)', 
                        gap: 6, 
                        alignItems: 'center',
                        width: '100%',
                        minWidth: 0
                      }}>
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => {
                            const newLabels = [...(selectedElement.labels || [])];
                            newLabels[index] = e.target.value;
                            updateSlideElement(selectedElement.id, { labels: newLabels });
                          }}
                          placeholder="Label"
                          style={{ 
                            padding: '4px 6px', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: 4,
                            fontSize: '12px',
                            minWidth: 0,
                            width: '100%'
                          }}
                        />
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => {
                            const num = Number(e.target.value);
                            const newValues = [...(selectedElement.values || [])];
                            newValues[index] = isNaN(num) ? 0 : num;
                            updateSlideElement(selectedElement.id, { values: newValues });
                          }}
                          placeholder="Value"
                          style={{ 
                            padding: '4px 6px', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: 4,
                            fontSize: '12px',
                            width: '100%'
                          }}
                        />
                        <button
                          onClick={(e) => {
                e.stopPropagation();
                            const newLabels = [...(selectedElement.labels || [])];
                            const newValues = [...(selectedElement.values || [])];
                            newLabels.splice(index, 1);
                            newValues.splice(index, 1);
                            updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues });
                          }}
                          title="Remove"
                          style={{
                            height: 24,
                            width: 24,
                            borderRadius: 4,
                            border: '1px solid #ef4444',
                            background: '#fff5f5',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 24
                          }}
                        >
                          −
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={(e) => {
                e.stopPropagation();
                      const newLabels = [...(selectedElement.labels || []), `Item ${(selectedElement.labels?.length || 0) + 1}`];
                      const newValues = [...(selectedElement.values || []), 0];
                      updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues });
                    }}
                    style={{
                      marginTop: 4,
                      height: 32,
                      borderRadius: 6,
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Data Point
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="no-selection">
            No element selected
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedElement && selectedElement.type === 'text') {
      return (
        <div className="right-toolbar-section">
          <div className="section-title">
            <FiDroplet style={{ marginRight: 8 }} />
            Textbox Background
          </div>
          <div className="option-group">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* First Column: Quick Colors - 2 rows, responsive */}
              <div className="quick-colors-grid">
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#ffffff', border: '1.5px solid #e5e7eb' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#ffffff' }); }}
                  title="White"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f8f9fa' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#f8f9fa' }); }}
                  title="Light Gray"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#0ea5e9' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#0ea5e9' }); }}
                  title="Sky Blue"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#8b5cf6' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#8b5cf6' }); }}
                  title="Purple"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#10b981' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#10b981' }); }}
                  title="Emerald"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#f59e0b' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#f59e0b' }); }}
                  title="Amber"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f43f5e' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#f43f5e' }); }}
                  title="Rose"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#06b6d4' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#06b6d4' }); }}
                  title="Cyan"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#84cc16' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#84cc16' }); }}
                  title="Lime"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#a855f7' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#a855f7' }); }}
                  title="Violet"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f97316' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#f97316' }); }}
                  title="Orange"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#64748b' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#64748b' }); }}
                  title="Slate"
                ></div>
              </div>

              {/* Second Column: Color Picker and Delete Button in a row */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                  <input
                    type="color"
                    value={selectedElement.backgroundColor || '#ffffff'}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateSlideElement(selectedElement.id, { backgroundColor: e.target.value });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Pick custom color"
                  />
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSlideElement(selectedElement.id, { backgroundColor: undefined });
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#9ca3af',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6b7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#9ca3af';
                  }}
                  title="Remove background color"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>

          <div className="section-title">
            <FiDroplet style={{ marginRight: 8 }} />
            Border color
          </div>
          <div className="option-group">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {/* First Column: Quick Colors - 2 rows, responsive */}
              <div className="quick-colors-grid">
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#000000' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#000000' }); }}
                  title="Black"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#6b7280' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#6b7280' }); }}
                  title="Gray"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#0ea5e9' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#0ea5e9' }); }}
                  title="Sky Blue"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#8b5cf6' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#8b5cf6' }); }}
                  title="Purple"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#10b981' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#10b981' }); }}
                  title="Emerald"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#f59e0b' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#f59e0b' }); }}
                  title="Amber"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f43f5e' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#f43f5e' }); }}
                  title="Rose"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#06b6d4' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#06b6d4' }); }}
                  title="Cyan"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#84cc16' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#84cc16' }); }}
                  title="Lime"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#a855f7' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#a855f7' }); }}
                  title="Violet"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f97316' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#f97316' }); }}
                  title="Orange"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#e5e7eb' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#e5e7eb' }); }}
                  title="Light"
                ></div>
              </div>

              {/* Second Column: Color Picker and Delete Button in a row */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                  <input
                    type="color"
                    value={selectedElement.borderColor || '#e5e7eb'}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateSlideElement(selectedElement.id, { borderColor: e.target.value });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Pick custom color"
                  />
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSlideElement(selectedElement.id, { borderColor: undefined });
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#9ca3af',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6b7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#9ca3af';
                  }}
                  title="Remove border color"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            {/* Border width slider and value in the same row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                onClick={(e) => e.stopPropagation()}
                min="0"
                max="10"
                value={selectedElement.borderWidth || 0}
                onChange={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) }); }}
                style={{ flex: 1 }}
              />
              <div style={{ 
                minWidth: '32px', 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#374151',
                padding: '4px 8px',
                background: '#ffffff',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                {selectedElement.borderWidth || 0}px
              </div>
            </div>
          </div>

          <div className="section-title">Element Actions</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedElement) {
                  const newElement = {
                    ...selectedElement,
                    id: `element_${Date.now()}`,
                    x: selectedElement.x + 20,
                    y: selectedElement.y + 20
                  };
                  const updatedElements = [...(currentSlide?.elements || []), newElement];
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
              style={{ 
                flex: 1, 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <FiLayers />
              Duplicate
            </button>
            <button 
              className="action-button danger"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedElement) {
                  const updatedElements = (currentSlide?.elements || []).filter(
                    element => element.id !== selectedElement.id
                  );
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
              style={{ 
                flex: 1, 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <FiTrash />
              Delete
            </button>
          </div>
        </div>
      );
    }

    if (selectedElement && selectedElement.type === 'shape') {
      return (
        <div className="right-toolbar-section">
          <div className="section-title">
            <FiDroplet style={{ marginRight: 8 }} />
            Fill color
          </div>
          <div className="option-group">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* First Column: Quick Colors - 2 rows, responsive */}
              <div className="quick-colors-grid">
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#3b82f6' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#3b82f6' }); }}
                  title="Blue"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#8b5cf6' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#8b5cf6' }); }}
                  title="Purple"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#10b981' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#10b981' }); }}
                  title="Emerald"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f59e0b' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#f59e0b' }); }}
                  title="Amber"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f43f5e' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#f43f5e' }); }}
                  title="Rose"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#06b6d4' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#06b6d4' }); }}
                  title="Cyan"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#84cc16' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#84cc16' }); }}
                  title="Lime"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#a855f7' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#a855f7' }); }}
                  title="Violet"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f97316' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#f97316' }); }}
                  title="Orange"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#0ea5e9' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#0ea5e9' }); }}
                  title="Sky Blue"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#64748b' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#64748b' }); }}
                  title="Slate"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#ef4444' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { fillColor: '#ef4444' }); }}
                  title="Red"
                ></div>
              </div>

              {/* Second Column: Color Picker and Delete Button in a row */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                  <input
                    type="color"
                    value={selectedElement.fillColor || '#3b82f6'}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateSlideElement(selectedElement.id, { fillColor: e.target.value });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Pick custom color"
                  />
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSlideElement(selectedElement.id, { fillColor: '#3b82f6' });
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#9ca3af',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6b7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#9ca3af';
                  }}
                  title="Reset to default color"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>

          <div className="section-title">
            <FiDroplet style={{ marginRight: 8 }} />
            Border color
          </div>
          <div className="option-group">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {/* First Column: Quick Colors - 2 rows, responsive */}
              <div className="quick-colors-grid">
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#000000' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#000000' }); }}
                  title="Black"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#6b7280' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#6b7280' }); }}
                  title="Gray"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#0ea5e9' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#0ea5e9' }); }}
                  title="Sky Blue"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#8b5cf6' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#8b5cf6' }); }}
                  title="Purple"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#10b981' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#10b981' }); }}
                  title="Emerald"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#f59e0b' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#f59e0b' }); }}
                  title="Amber"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f43f5e' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#f43f5e' }); }}
                  title="Rose"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#06b6d4' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#06b6d4' }); }}
                  title="Cyan"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#84cc16' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#84cc16' }); }}
                  title="Lime"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#a855f7' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#a855f7' }); }}
                  title="Violet"
                ></div>
                <div 
                  className="color-swatch-small" 
                  style={{ backgroundColor: '#f97316' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#f97316' }); }}
                  title="Orange"
                ></div>
                <div 
                  className="color-swatch-small quick-color-extra" 
                  style={{ backgroundColor: '#e5e7eb' }}
                  onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderColor: '#e5e7eb' }); }}
                  title="Light"
                ></div>
              </div>

              {/* Second Column: Color Picker and Delete Button in a row */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                  <input
                    type="color"
                    value={selectedElement.borderColor || '#1e40af'}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateSlideElement(selectedElement.id, { borderColor: e.target.value });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Pick custom color"
                  />
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSlideElement(selectedElement.id, { borderColor: '#1e40af' });
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#9ca3af',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6b7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#9ca3af';
                  }}
                  title="Reset to default color"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            {/* Border width slider and value in the same row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                onClick={(e) => e.stopPropagation()}
                min="0"
                max="10"
                value={selectedElement.borderWidth || 0}
                onChange={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) }); }}
                style={{ flex: 1 }}
              />
              <div style={{ 
                minWidth: '32px', 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#374151',
                padding: '4px 8px',
                background: '#ffffff',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                {selectedElement.borderWidth || 0}px
              </div>
            </div>
          </div>

          <div className="section-title">Element Actions</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedElement) {
                  const newElement = {
                    ...selectedElement,
                    id: `element_${Date.now()}`,
                    x: selectedElement.x + 20,
                    y: selectedElement.y + 20
                  };
                  const updatedElements = [...(currentSlide?.elements || []), newElement];
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
              style={{ 
                flex: 1, 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <FiLayers />
              Duplicate
            </button>
            <button 
              className="action-button danger"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedElement) {
                  const updatedElements = (currentSlide?.elements || []).filter(
                    element => element.id !== selectedElement.id
                  );
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
              style={{ 
                flex: 1, 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <FiTrash />
              Delete
            </button>
          </div>
        </div>
      );
    }

    if (selectedElement && selectedElement.type === 'chart') {
      return (
        <div className="right-toolbar-section">
          <div className="section-title">Data points</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(selectedElement.labels || []).map((label, index) => {
              const value = (selectedElement.values || [])[index] ?? 0;
              return (
                <div key={index} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(50px, 60px) 20px 24px', 
                  gap: 4, 
                  alignItems: 'center',
                  width: '100%',
                  minWidth: 0
                }}>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                      const newLabels = [...(selectedElement.labels || [])];
                      newLabels[index] = e.target.value;
                      updateSlideElement(selectedElement.id, { labels: newLabels });
                    }}
                    placeholder="Label"
                    style={{ 
                      padding: '4px 6px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: 4,
                      fontSize: '12px',
                      minWidth: 0,
                      width: '100%'
                    }}
                  />
                  <input
                    type="number"
                    value={value}
                    min={selectedElement.chartType === 'bar' ? undefined : "0"}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      // For pie and line charts, ensure values are not negative
                      const finalValue = (selectedElement.chartType === 'pie' || selectedElement.chartType === 'line') ? 
                        Math.max(0, isNaN(num) ? 0 : num) : 
                        (isNaN(num) ? 0 : num);
                      const newValues = [...(selectedElement.values || [])];
                      newValues[index] = finalValue;
                      updateSlideElement(selectedElement.id, { values: newValues });
                    }}
                    placeholder="Value"
                    style={{ 
                      padding: '4px 6px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: 4,
                      fontSize: '12px',
                      width: '100%'
                    }}
                  />
                  <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                    <input
                      type="color"
                      value={(() => {
                        // Use the same default colors for bar, pie, and line charts
                        const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
                        return (selectedElement.barColors && selectedElement.barColors[index]) || 
                               defaultColors[index % defaultColors.length];
                      })()}
                      onChange={(e) => {
                        // Always use barColors for bar, pie, and line charts
                        const newBarColors = [...(selectedElement.barColors || [])];
                        // Ensure the array is the right size using the same logic as ChartBox
                        while (newBarColors.length < (selectedElement.labels || []).length) {
                          // For pie and line charts, use diverse colors; for bar charts, use single default color
                          if (selectedElement.chartType === 'pie' || selectedElement.chartType === 'line') {
                            const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
                            newBarColors.push(defaultColors[newBarColors.length % defaultColors.length]);
                          } else {
                            newBarColors.push(selectedElement.color || '#0ea5e9');
                          }
                        }
                        newBarColors[index] = e.target.value;
                        updateSlideElement(selectedElement.id, { barColors: newBarColors });
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                    />
                    <div 
                      className="color-swatch-small"
                      style={{ 
                        backgroundColor: (() => {
                          const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
                          return (selectedElement.barColors && selectedElement.barColors[index]) || 
                                 defaultColors[index % defaultColors.length];
                        })(),
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                e.stopPropagation();
                      const newLabels = [...(selectedElement.labels || [])];
                      const newValues = [...(selectedElement.values || [])];
                      newLabels.splice(index, 1);
                      newValues.splice(index, 1);
                      updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues });
                    }}
                    title="Remove"
                    style={{
                      height: 24,
                      width: 24,
                      borderRadius: 4,
                      border: '1px solid #ef4444',
                      background: '#fff5f5',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 24
                    }}
                  >
                    −
                  </button>
                </div>
              );
            })}

            {/* Chart Name Input, Color Button, and Add Button in a row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'minmax(0, 1fr) minmax(50px, 60px) 20px 24px', 
              gap: 4, 
              alignItems: 'center',
              width: '100%',
              minWidth: 0,
              marginTop: 4
            }}>
              <input
                type="text"
                placeholder="Chart Name"
                value={selectedElement.chartName || ''}
                onChange={(e) => updateSlideElement(selectedElement.id, { chartName: e.target.value })}
                style={{
                  padding: '4px 6px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  fontSize: '12px',
                  outline: 'none',
                  minWidth: 0,
                  width: '100%',
                  gridColumn: 'span 2'
                }}
              />
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <input
                  type="color"
                  value={selectedElement.chartNameColor || '#111827'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { chartNameColor: e.target.value })}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  title="Chart name color"
                />
                <div 
                  className="color-swatch-small"
                  style={{
                    backgroundColor: selectedElement.chartNameColor || '#111827',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    position: 'relative'
                  }} 
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newLabels = [...(selectedElement.labels || []), `Item ${(selectedElement.labels?.length || 0) + 1}`];
                  const newValues = [...(selectedElement.values || []), 0];
                  updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues });
                }}
                title="Add data point"
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 4,
                  border: '1px solid #10b981',
                  background: '#d1fae5',
                  color: '#059669',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 24,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#a7f3d0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#d1fae5';
                }}
              >
                +
              </button>
            </div>
          </div>


          <div className="section-title">Chart Options</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* First Row: Labels and Background */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Labels Color */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Labels</label>
                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                  <input
                    type="color"
                    value={selectedElement.labelsColor || '#374151'}
                    onChange={(e) => updateSlideElement(selectedElement.id, { labelsColor: e.target.value })}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Labels color"
                  />
                  <div 
                    className="color-swatch-small"
                    style={{ 
                      backgroundColor: selectedElement.labelsColor || '#374151',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  />
                </div>
              </div>

              {/* Chart Background */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Background</label>
                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                  <input
                    type="color"
                    value={selectedElement.backgroundColor || '#ffffff'}
                    onChange={(e) => updateSlideElement(selectedElement.id, { backgroundColor: e.target.value })}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Background color"
                  />
                  <div 
                    className="color-swatch-small"
                    style={{ 
                      backgroundColor: selectedElement.backgroundColor || '#ffffff',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Second Row: Y-Axis and Axis Lines (only for bar/line charts) */}
            {(selectedElement.chartType === 'bar' || selectedElement.chartType === 'line') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Y-Axis Values Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Y-Axis</label>
                  <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                    <input
                      type="color"
                      value={selectedElement.yAxisColor || '#6b7280'}
                      onChange={(e) => updateSlideElement(selectedElement.id, { yAxisColor: e.target.value })}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                      title="Y-Axis color"
                    />
                    <div 
                      className="color-swatch-small"
                      style={{ 
                        backgroundColor: selectedElement.yAxisColor || '#6b7280',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    />
                  </div>
                </div>

                {/* Axis Lines */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Lines</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={selectedElement.showXAxis || false}
                        onChange={(e) => updateSlideElement(selectedElement.id, { showXAxis: e.target.checked })}
                        style={{ margin: 0, width: '14px', height: '14px', accentColor: '#3b82f6' }}
                      />
                      X
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={selectedElement.showYAxis || false}
                        onChange={(e) => updateSlideElement(selectedElement.id, { showYAxis: e.target.checked })}
                        style={{ margin: 0, width: '14px', height: '14px', accentColor: '#3b82f6' }}
                      />
                      Y
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Third Row: Chart Color (only for line charts) */}
            {selectedElement.chartType === 'line' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Chart Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Chart Color</label>
                  <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                    <input
                      type="color"
                      value={selectedElement.color || '#0ea5e9'}
                      onChange={(e) => updateSlideElement(selectedElement.id, { color: e.target.value })}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                      title="Chart line color"
                    />
                    <div 
                      className="color-swatch-small"
                      style={{ 
                        backgroundColor: selectedElement.color || '#0ea5e9',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="section-title">Element Actions</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedElement) {
                  const newElement = {
                    ...selectedElement,
                    id: `element_${Date.now()}`,
                    x: selectedElement.x + 20,
                    y: selectedElement.y + 20
                  };
                  const updatedElements = [...(currentSlide?.elements || []), newElement];
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
              style={{ 
                flex: 1, 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <FiLayers />
              Duplicate
            </button>
            <button 
              className="action-button danger"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedElement) {
                  const updatedElements = (currentSlide?.elements || []).filter(
                    element => element.id !== selectedElement.id
                  );
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
              style={{ 
                flex: 1, 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <FiTrash />
              Delete
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Design':
        return renderDesignOptions();
      case 'Insert':
        return renderInsertOptions();
      default:
        return renderDefaultOptions();
    }
  };

  return (
    <div className="right-toolbar">
      <div className="right-toolbar-header">
        <div className="right-toolbar-tabs" ref={tabsContainerRef} style={{ position: 'relative' }}>
          {/* Sliding highlight - only show when no element is selected */}
          {!selectedElement && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: indicator.width,
                height: '2px',
                transform: `translateX(${indicator.left}px)`,
                background: '#000000',
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '1px',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
          )}
          {['Design', 'Insert'].map((tab) => (
            <button
              key={tab}
              ref={(el) => { tabRefs.current[tab] = el; }}
              className={`right-toolbar-tab ${!selectedElement && activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
              style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="right-toolbar-content">
        {renderContent()}
      </div>

    </div>
  );
};

export default RightToolbar;


