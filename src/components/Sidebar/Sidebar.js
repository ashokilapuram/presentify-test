import React, { useState } from 'react';
import { FiPlus, FiLayout } from 'react-icons/fi';
import { BarChart, LineChart, PieChart } from '../ChartBox/ChartBox';
import TextBox from '../TextBox/TextBox';
import ShapeBox from '../ShapeBox/ShapeBox';
import ImageBox from '../ImageBox/ImageBox';
import ChartBox from '../ChartBox/ChartBox';
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
                  <div className="slide-thumbnail-content" style={{ transform: 'scale(0.15)', transformOrigin: 'top left', width: '666.67%', height: '666.67%' }}>
                    {slide.elements.map((element) => {
                      // Scale down the element properties for the preview
                      const scaledElement = {
                        ...element,
                        x: element.x,
                        y: element.y,
                        width: element.width,
                        height: element.height,
                        fontSize: element.fontSize,
                        borderWidth: element.borderWidth,
                        borderRadius: element.borderRadius
                      };

                      if (element.type === 'text') {
                        return (
                          <TextBox
                            key={element.id}
                            element={scaledElement}
                            isSelected={false}
                            isEditing={false}
                            onSelect={() => {}}
                            onEdit={() => {}}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                            onMouseDown={() => {}}
                            textFormatting={{}}
                            hoverPreview={null}
                          />
                        );
                      }

                      if (element.type === 'shape') {
                        return (
                          <ShapeBox
                            key={element.id}
                            element={scaledElement}
                            isSelected={false}
                            onSelect={() => {}}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                          />
                        );
                      }

                      if (element.type === 'image') {
                        return (
                          <ImageBox
                            key={element.id}
                            element={scaledElement}
                            isSelected={false}
                            onSelect={() => {}}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                          />
                        );
                      }

                      if (element.type === 'chart') {
                        return (
                          <ChartBox
                            key={element.id}
                            element={scaledElement}
                            isSelected={false}
                            onSelect={() => {}}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                          />
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


