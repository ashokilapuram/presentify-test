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
  FiFeather
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
  addChart
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
      <div className="option-group">
        <div className="theme-grid">
          <div 
            className="theme-option premium1"
            onClick={() => updateSlide && updateSlide({ 
              backgroundColor: '#ff8008',
              backgroundImage: 'linear-gradient(to right, #ff8008, #ffc837)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            })}
          >
            <div className="theme-preview"></div>
          </div>
          <div 
            className="theme-option premium2"
            onClick={() => updateSlide && updateSlide({ 
              backgroundColor: '#ccccb2',
              backgroundImage: 'linear-gradient(to right, #ccccb2, #757519)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            })}
          >
            <div className="theme-preview"></div>
          </div>
          <div 
            className="theme-option premium3"
            onClick={() => updateSlide && updateSlide({ 
              backgroundColor: '#434343',
              backgroundImage: 'linear-gradient(to right, #434343, #000000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            })}
          >
            <div className="theme-preview"></div>
          </div>
          <div 
            className="theme-option premium4"
            onClick={() => updateSlide && updateSlide({ 
              backgroundColor: '#F0F2F0',
              backgroundImage: 'linear-gradient(to right, #000C40, #F0F2F0)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            })}
          >
            <div className="theme-preview"></div>
          </div>
        </div>
      </div>

      <div className="section-title">Colors</div>
      <div className="option-group">
        <div className="color-palette">
          <div 
            className="color-swatch" 
            style={{ backgroundColor: '#0ea5e9' }}
            onClick={() => updateSlide && updateSlide({ backgroundColor: '#0ea5e9' })}
            title="Apply Sky Blue"
          ></div>
          <div 
            className="color-swatch" 
            style={{ backgroundColor: '#8b5cf6' }}
            onClick={() => updateSlide && updateSlide({ backgroundColor: '#8b5cf6' })}
            title="Apply Purple"
          ></div>
          <div 
            className="color-swatch" 
            style={{ backgroundColor: '#10b981' }}
            onClick={() => updateSlide && updateSlide({ backgroundColor: '#10b981' })}
            title="Apply Emerald"
          ></div>
          <div 
            className="color-swatch" 
            style={{ backgroundColor: '#f59e0b' }}
            onClick={() => updateSlide && updateSlide({ backgroundColor: '#f59e0b' })}
            title="Apply Amber"
          ></div>
          <div 
            className="color-swatch" 
            style={{ backgroundColor: '#f43f5e' }}
            onClick={() => updateSlide && updateSlide({ backgroundColor: '#f43f5e' })}
            title="Apply Rose"
          ></div>
        </div>
      </div>

      <div className="section-title">
        <FiDroplet style={{ marginRight: 8 }} />
        Slide Background
      </div>
      <div className="option-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={currentSlide?.backgroundColor || '#ffffff'}
          onChange={(e) => {
            updateSlide && updateSlide({ backgroundColor: e.target.value });
          }}
          className="color-input"
        />
        <button
          className="action-button danger"
          onClick={() => {
            updateSlide && updateSlide({ backgroundColor: undefined });
          }}
        >
          Remove
        </button>
      </div>

      <div className="section-title">
        <FiUpload style={{ marginRight: 8 }} />
        Background image
      </div>
      <div className="option-group" style={{ display: 'flex', gap: 8 }}>
        <button
          className="quick-button"
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
        >
          Upload Image
        </button>
        {currentSlide?.backgroundImage && (
          <button
            className="action-button danger"
            onClick={() => updateSlide && updateSlide({ backgroundImage: null })}
          >
            Remove
          </button>
        )}
      </div>


    </div>
  );


  const renderInsertOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Text elements</div>
      <div className="option-group">
        <button className="insert-button" onClick={() => addTextBox('title')}>
          <FiType />
          <span>Title</span>
        </button>
        <button className="insert-button" onClick={() => addTextBox('subtitle')}>
          <FiType />
          <span>Subtitle</span>
        </button>
        <button className="insert-button" onClick={() => addTextBox('content')}>
          <FiType />
          <span>Content</span>
        </button>
      </div>

      <div className="section-title">Shapes</div>
      <div className="option-group">
        <div className="shape-grid">
          <button className="shape-button" onClick={() => addShape('rectangle')}>
            <FiSquare />
          </button>
          <button className="shape-button" onClick={() => addShape('circle')}>
            <FiCircle />
          </button>
          <button className="shape-button" onClick={() => addShape('triangle')}>
            <FiTriangle />
          </button>
          <button className="shape-button" onClick={() => addShape('star')}>
            <FiStar />
          </button>
        </div>
      </div>

      <div className="section-title">Media</div>
      <div className="option-group">
        <button className="insert-button" onClick={addImage}>
          <FiImage />
          <span>Image</span>
        </button>
      </div>

      <div className="section-title">Charts</div>
      <div className="option-group">
        <button className="insert-button" onClick={() => addChart('bar')}>
          <FiBarChart2 />
          <span>Bar Chart</span>
        </button>
        <button className="insert-button" onClick={() => addChart('pie')}>
          <FiPieChart />
          <span>Pie Chart</span>
        </button>
        <button className="insert-button" onClick={() => addChart('line')}>
          <FiTrendingUp />
          <span>Line Chart</span>
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
        <button className="quick-button" onClick={() => addShape('rectangle')}>
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
                <div className="option-group">
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
                          onClick={() => {
                            const newLabels = [...(selectedElement.labels || [])];
                            const newValues = [...(selectedElement.values || [])];
                            newLabels.splice(index, 1);
                            newValues.splice(index, 1);
                            updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues });
                          }}
                          title="Remove"
                          style={{
                            height: 28,
                            width: 28,
                            borderRadius: 4,
                            border: '1px solid #ef4444',
                            background: '#fff5f5',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 28
                          }}
                        >
                          −
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => {
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
                  updateSlideElement(selectedElement.id, { backgroundColor: e.target.value });
                }}
                className="color-input"
              />
              <button
                className="action-button danger"
                onClick={() => {
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
                onClick={() => updateSlideElement(selectedElement.id, { backgroundColor: '#ffffff' })}
                title="White"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#f8f9fa' }}
                onClick={() => updateSlideElement(selectedElement.id, { backgroundColor: '#f8f9fa' })}
                title="Light Gray"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#0ea5e9' }}
                onClick={() => updateSlideElement(selectedElement.id, { backgroundColor: '#0ea5e9' })}
                title="Sky Blue"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#8b5cf6' }}
                onClick={() => updateSlideElement(selectedElement.id, { backgroundColor: '#8b5cf6' })}
                title="Purple"
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: '#10b981' }}
                onClick={() => updateSlideElement(selectedElement.id, { backgroundColor: '#10b981' })}
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
                updateSlideElement(selectedElement.id, { borderColor: e.target.value });
              }}
              className="color-input"
            />
            <button
              className="action-button danger"
              onClick={() => {
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
              min="0"
              max="10"
              value={selectedElement.borderWidth || 0}
              onChange={(e) => updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: 4, fontSize: '12px', color: '#6b7280' }}>
              {selectedElement.borderWidth || 0}px
            </div>
          </div>

          <div className="section-title">Element Actions</div>
          <div className="option-group">
            <button 
              className="action-button"
              onClick={() => {
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
            >
              <FiCopy />
              Duplicate
            </button>
            <button 
              className="action-button danger"
              onClick={() => {
                if (selectedElement) {
                  const updatedElements = (currentSlide?.elements || []).filter(
                    element => element.id !== selectedElement.id
                  );
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
            >
              <FiTrash2 />
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
              min="0"
              max="10"
              value={selectedElement.borderWidth || 0}
              onChange={(e) => updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: 4, fontSize: '12px', color: '#6b7280' }}>
              {selectedElement.borderWidth || 0}px
            </div>
          </div>

          <div className="section-title">Element Actions</div>
          <div className="option-group">
            <button 
              className="action-button"
              onClick={() => {
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
            >
              <FiCopy />
              Duplicate
            </button>
            <button 
              className="action-button danger"
              onClick={() => {
                if (selectedElement) {
                  const updatedElements = (currentSlide?.elements || []).filter(
                    element => element.id !== selectedElement.id
                  );
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
            >
              <FiTrash2 />
              Delete
            </button>
          </div>
        </div>
      );
    }

    if (selectedElement && selectedElement.type === 'chart') {
      return (
        <div className="right-toolbar-section">
          {(selectedElement.chartType === 'bar' || selectedElement.chartType === 'pie') && (
            <>
              <div className="section-title">
                {selectedElement.chartType === 'bar' ? 'Bar Colors' : 'Slice Colors'}
              </div>
              <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selectedElement.labels || []).map((label, index) => {
                  const sliceColor = (selectedElement.sliceColors && selectedElement.sliceColors[index]) || 
                                   (selectedElement.barColors && selectedElement.barColors[index]) || 
                                   selectedElement.color || '#0ea5e9';
                  return (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      padding: '6px 8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef'
                    }}>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#374151', 
                        minWidth: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: '500'
                      }}>
                        {label}
                      </span>
                      <input
                        type="color"
                        value={sliceColor}
                        onChange={(e) => {
                          if (selectedElement.chartType === 'pie') {
                            const newSliceColors = [...(selectedElement.sliceColors || [])];
                            newSliceColors[index] = e.target.value;
                            updateSlideElement(selectedElement.id, { sliceColors: newSliceColors });
                          } else {
                            const newBarColors = [...(selectedElement.barColors || [])];
                            newBarColors[index] = e.target.value;
                            updateSlideElement(selectedElement.id, { barColors: newBarColors });
                          }
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '2px solid #ffffff',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {selectedElement.chartType === 'line' && (
            <>
              <div className="section-title">Chart color</div>
              <div className="option-group">
                <input
                  type="color"
                  value={selectedElement.color || '#0ea5e9'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { color: e.target.value })}
                  className="color-input"
                />
              </div>
            </>
          )}

          <div className="section-title">Data points</div>
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
                    onClick={() => {
                      const newLabels = [...(selectedElement.labels || [])];
                      const newValues = [...(selectedElement.values || [])];
                      newLabels.splice(index, 1);
                      newValues.splice(index, 1);
                      updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues });
                    }}
                    title="Remove"
                    style={{
                      height: 28,
                      width: 28,
                      borderRadius: 4,
                      border: '1px solid #ef4444',
                      background: '#fff5f5',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 28
                    }}
                  >
                    −
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => {
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

          <div className="section-title">Element Actions</div>
          <div className="option-group">
            <button 
              className="action-button"
              onClick={() => {
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
            >
              <FiCopy />
              Duplicate
            </button>
            <button 
              className="action-button danger"
              onClick={() => {
                if (selectedElement) {
                  const updatedElements = (currentSlide?.elements || []).filter(
                    element => element.id !== selectedElement.id
                  );
                  updateSlide && updateSlide({ elements: updatedElements });
                }
              }}
            >
              <FiTrash2 />
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


