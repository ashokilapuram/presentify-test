import React from 'react';
import { FiPlus, FiList, FiGrid, FiLayout } from 'react-icons/fi';

const Sidebar = ({ 
  slides, 
  currentSlideIndex, 
  setCurrentSlideIndex, 
  addSlide, 
  deleteSlide,
  onShowTemplates 
}) => {
  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleDeleteSlide = (e, index) => {
    e.stopPropagation();
    deleteSlide(index);
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
                className={`slide-item ${index === currentSlideIndex ? 'active' : ''}`}
                onClick={() => handleSlideClick(index)}
              >
                <div className="slide-number">{index + 1}</div>
                <div className="slide-thumbnail">
                  <div className="slide-thumbnail-content">
                    {slide.elements.map((element) => (
                      <div
                        key={element.id}
                        style={{
                          position: 'absolute',
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          fontSize: element.fontSize * 0.15,
                          fontWeight: element.fontWeight,
                          textAlign: element.textAlign,
                          color: element.color,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {element.content}
                      </div>
                    ))}
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

        <div className="views-section">
          <div className="views-title">VIEWS</div>
          <div className="view-item">
            <FiList size={16} />
            Outline View
          </div>
          <div className="view-item">
            <FiGrid size={16} />
            Sort Slides
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

