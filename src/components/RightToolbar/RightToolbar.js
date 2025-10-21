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
}) => {
  const [activeTab, setActiveTab] = useState('Insert');
  
  // Sliding highlight indicator state
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

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
      <div className="background-container">
        <div className="background-controls">
          <div className="background-column">
            <div className="background-row">
              <input
                type="color"
                value={currentSlide?.backgroundColor || '#ffffff'}
                onChange={(e) => {
                  updateSlide && updateSlide({ 
                    backgroundColor: e.target.value,
                    backgroundImage: null,
                    backgroundSize: null,
                    backgroundPosition: null,
                    backgroundRepeat: null
                  });
                }}
                className="color-input-square"
              />
              <button
                className="background-action-button"
                onClick={() => {
                  updateSlide && updateSlide({ 
                    backgroundColor: undefined,
                    backgroundImage: null,
                    backgroundSize: null,
                    backgroundPosition: null,
                    backgroundRepeat: null
                  });
                }}
                title="Remove background color"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
          <div className="background-separator"></div>
          <div className="background-column">
            <div className="background-row">
              <button
                className="background-action-button"
                onClick={() => {
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
                title="Upload background image"
              >
                <FiImage />
              </button>
              {currentSlide?.backgroundImage && (
                <button
                  className="background-action-button"
                  onClick={() => updateSlide && updateSlide({ backgroundImage: null })}
                  title="Remove background image"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input
                type="color"
                value={selectedElement.backgroundColor || '#ffffff'}
                onChange={(e) => {
                  e.stopPropagation();
                  updateSlideElement(selectedElement.id, { backgroundColor: e.target.value });
                }}
                className="color-input"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="action-button danger"
                onClick={(e) => {
                  e.stopPropagation();
                  updateSlideElement(selectedElement.id, { backgroundColor: undefined });
                }}
              >
                Remove
              </button>
            </div>
            
            {/* Preset colors for textbox backgrounds */}
            <div className="section-title" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
              Quick Colors
            </div>
            <div className="color-palette">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#ffffff' }}
                onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#ffffff' }); }}
                title="White"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#f8f9fa' }}
                onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#f8f9fa' }); }}
                title="Light Gray"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#0ea5e9' }}
                onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#0ea5e9' }); }}
                title="Sky Blue"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#8b5cf6' }}
                onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#8b5cf6' }); }}
                title="Purple"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#10b981' }}
                onClick={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { backgroundColor: '#10b981' }); }}
                title="Emerald"
              >              </div>
            </div>
          </div>

          <div className="section-title">
            <FiDroplet style={{ marginRight: 8 }} />
            Border color
          </div>
          <div className="option-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              value={selectedElement.borderColor || '#e5e7eb'}
              onChange={(e) => {
                e.stopPropagation();
                updateSlideElement(selectedElement.id, { borderColor: e.target.value });
              }}
              className="color-input"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="action-button danger"
              onClick={(e) => {
                e.stopPropagation();
                updateSlideElement(selectedElement.id, { borderColor: undefined });
              }}
            >
              Remove
            </button>
          </div>

          <div className="section-title">Border width</div>
          <div className="option-group">
            <input
              type="range"
              onClick={(e) => e.stopPropagation()}
              min="0"
              max="10"
              value={selectedElement.borderWidth || 0}
              onChange={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) }); }}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: 4, fontSize: '12px', color: '#6b7280' }}>
              {selectedElement.borderWidth || 0}px
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
          <div className="option-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              value={selectedElement.fillColor || '#3b82f6'}
              onChange={(e) => updateSlideElement(selectedElement.id, { fillColor: e.target.value })}
              className="color-input"
            />
            <button
              className="action-button danger"
              onClick={() => updateSlideElement(selectedElement.id, { fillColor: '#3b82f6' })}
            >
              Reset
            </button>
          </div>

          <div className="section-title">
            <FiDroplet style={{ marginRight: 8 }} />
            Border color
          </div>
          <div className="option-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              value={selectedElement.borderColor || '#1e40af'}
              onChange={(e) => updateSlideElement(selectedElement.id, { borderColor: e.target.value })}
              className="color-input"
            />
            <button
              className="action-button danger"
              onClick={() => updateSlideElement(selectedElement.id, { borderColor: '#1e40af' })}
            >
              Reset
            </button>
          </div>

          <div className="section-title">Border width</div>
          <div className="option-group">
            <input
              type="range"
              onClick={(e) => e.stopPropagation()}
              min="0"
              max="10"
              value={selectedElement.borderWidth || 0}
              onChange={(e) => { e.stopPropagation(); updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) }); }}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: 4, fontSize: '12px', color: '#6b7280' }}>
              {selectedElement.borderWidth || 0}px
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
          <div style={{ display: 'flex', gap: 8, marginBottom: '16px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Chart name here"
              value={selectedElement.chartName || ''}
              onChange={(e) => updateSlideElement(selectedElement.id, { chartName: e.target.value })}
              style={{
                flex: 1,
                padding: '6px 10px',
                border: '2px solid #9ca3af',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
                height: '32px'
              }}
            />
            <input
              type="color"
              value={selectedElement.chartNameColor || '#111827'}
              onChange={(e) => updateSlideElement(selectedElement.id, { chartNameColor: e.target.value })}
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid #ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              title="Chart name color"
            />
          </div>

          <div className="section-title">Data points</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(selectedElement.labels || []).map((label, index) => {
              const value = (selectedElement.values || [])[index] ?? 0;
              return (
                <div key={index} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(50px, 60px) 28px 28px', 
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
                      height: 28,
                      width: 28,
                      borderRadius: 4,
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      padding: 0
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


          <div className="section-title">Chart Options</div>
          <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* First Row: Labels and Background */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Labels Color */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Labels</label>
                <input
                  type="color"
                  value={selectedElement.labelsColor || '#374151'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { labelsColor: e.target.value })}
                  style={{
                    width: '32px',
                    height: '24px',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.1s ease',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>

              {/* Chart Background */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Background</label>
                <input
                  type="color"
                  value={selectedElement.backgroundColor || '#ffffff'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { backgroundColor: e.target.value })}
                  style={{
                    width: '32px',
                    height: '24px',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.1s ease',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>
            </div>

            {/* Second Row: Y-Axis and Axis Lines (only for bar/line charts) */}
            {(selectedElement.chartType === 'bar' || selectedElement.chartType === 'line') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Y-Axis Values Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Y-Axis</label>
                  <input
                    type="color"
                    value={selectedElement.yAxisColor || '#6b7280'}
                    onChange={(e) => updateSlideElement(selectedElement.id, { yAxisColor: e.target.value })}
                    style={{
                      width: '32px',
                      height: '24px',
                      border: '2px solid #ffffff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                      transition: 'transform 0.1s ease',
                      padding: 0
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
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
          </div>


          {selectedElement.chartType === 'line' && (
            <>
              <div className="section-title">Chart color</div>
              <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="color"
                  value={selectedElement.color || '#0ea5e9'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { color: e.target.value })}
                  className="color-input"
                />
              </div>
            </>
          )}

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
          {/* Sliding highlight */}
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
          {['Design', 'Insert'].map((tab) => (
            <button
              key={tab}
              ref={(el) => { tabRefs.current[tab] = el; }}
              className={`right-toolbar-tab ${activeTab === tab ? 'active' : ''}`}
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


