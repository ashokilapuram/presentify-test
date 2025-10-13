import React, { useState } from 'react';
import { FiPlus, FiLayout } from 'react-icons/fi';
import { BarChart, LineChart, PieChart } from '../ChartBox/ChartBox';
import './Sidebar.css';

const Sidebar = ({ 
  slides, 
  currentSlideIndex, 
  setCurrentSlideIndex, 
  addSlide, 
  deleteSlide,
  onShowTemplates,
  onReorderSlides
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleDeleteSlide = (e, index) => {
    e.stopPropagation();
    deleteSlide(index);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    // Only clear dragOverIndex if we're leaving the slide item entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderSlides(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-slide-button" onClick={addSlide}>
          <FiPlus size={16} />
          New Slide
        </button>
        <button className="templates-button" onClick={onShowTemplates}>
          <FiLayout size={16} />
          Templates
        </button>
      </div>
      
      <div className="sidebar-content">
        <div className="slides-section">
          <div className="slides-title">SLIDES</div>
          <div className="slides-list">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide-item ${index === currentSlideIndex ? 'active' : ''} ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                onClick={() => handleSlideClick(index)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="slide-number">{index + 1}</div>
                <div 
                  className="slide-thumbnail"
                  style={{
                    backgroundColor: slide.backgroundColor || '#ffffff',
                    backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="slide-thumbnail-content">
                    {slide.elements.map((element) => {
                      if (element.type === 'text') {
                        return (
                          <div
                            key={element.id}
                            style={{
                              position: 'absolute',
                              left: element.x * 0.15,
                              top: element.y * 0.15,
                              width: element.width * 0.15,
                              height: element.height * 0.15,
                              fontSize: Math.max(element.fontSize * 0.15, 6),
                              fontWeight: element.fontWeight,
                              fontStyle: element.fontStyle,
                              textDecoration: element.textDecoration,
                              textAlign: element.textAlign,
                              color: element.color,
                              fontFamily: element.fontFamily,
                              backgroundColor: element.backgroundColor || 'transparent',
                              padding: element.padding ? `${parseFloat(element.padding) * 0.15}px` : '1px',
                              borderRadius: element.borderRadius ? `${parseFloat(element.borderRadius) * 0.15}px` : '0',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'
                            }}
                            dangerouslySetInnerHTML={{ __html: element.content }}
                          />
                        );
                      }
                      if (element.type === 'shape') {
                        return (
                          <div
                            key={element.id}
                            style={{
                              position: 'absolute',
                              left: element.x * 0.15,
                              top: element.y * 0.15,
                              width: element.width * 0.15,
                              height: element.height * 0.15,
                              backgroundColor: element.fillColor,
                              border: `${(element.borderWidth || 0) * 0.15}px solid ${element.borderColor}`,
                              borderRadius: element.shapeType === 'circle' ? '50%' : element.borderRadius ? `${parseFloat(element.borderRadius) * 0.15}px` : '0',
                              minWidth: '2px',
                              minHeight: '2px'
                            }}
                          />
                        );
                      }
                      if (element.type === 'image') {
                        return (
                          <img
                            key={element.id}
                            src={element.src}
                            alt=""
                            style={{
                              position: 'absolute',
                              left: element.x * 0.15,
                              top: element.y * 0.15,
                              width: element.width * 0.15,
                              height: element.height * 0.15,
                              objectFit: 'contain',
                              minWidth: '2px',
                              minHeight: '2px'
                            }}
                          />
                        );
                      }
                      if (element.type === 'chart') {
                        const props = { 
                          width: Math.max(element.width * 0.15, 8), 
                          height: Math.max(element.height * 0.15, 8), 
                          labels: element.labels, 
                          values: element.values, 
                          color: element.color 
                        };
                        return (
                          <div
                            key={element.id}
                            style={{
                              position: 'absolute',
                              left: element.x * 0.15,
                              top: element.y * 0.15,
                              width: Math.max(element.width * 0.15, 8),
                              height: Math.max(element.height * 0.15, 8),
                              overflow: 'hidden',
                              minWidth: '8px',
                              minHeight: '8px'
                            }}
                          >
                            {element.chartType === 'line' && <LineChart {...props} />}
                            {element.chartType === 'pie' && <PieChart {...props} />}
                            {element.chartType === 'bar' && <BarChart {...props} />}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                {slides.length > 1 && (
                  <button
                    className="slide-delete"
                    onClick={(e) => handleDeleteSlide(e, index)}
                    title="Delete slide"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;


