import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import './FullScreenSlideshow.css';

const FullScreenSlideshow = ({ slides, currentSlideIndex, onClose, onSlideChange }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(currentSlideIndex);
  const [timeRemaining, setTimeRemaining] = useState(2);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Use setTimeout to ensure nextSlide is called after state update
          setTimeout(() => {
            const nextIndex = (currentSlide + 1) % slides.length;
            setCurrentSlide(nextIndex);
            onSlideChange(nextIndex);
          }, 0);
          return 2;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlide, slides.length, onSlideChange]);

  const nextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextIndex);
    onSlideChange(nextIndex);
    setTimeRemaining(2);
  }, [currentSlide, slides.length, onSlideChange]);

  const prevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(prevIndex);
    onSlideChange(prevIndex);
    setTimeRemaining(2);
  }, [currentSlide, slides.length, onSlideChange]);

  // Reset timer when slide changes manually
  useEffect(() => {
    setTimeRemaining(2);
  }, [currentSlide]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, onClose]);

  // Render slide content
  const renderSlideContent = (slide) => {
    if (!slide || !slide.elements) return null;

    return slide.elements.map((element) => {
      if (element.type === 'text') {
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              textAlign: element.textAlign,
              color: element.color,
              fontFamily: element.fontFamily,
              backgroundColor: element.backgroundColor,
              padding: element.padding,
              borderRadius: element.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.textAlign === 'center' ? 'center' : 
                           element.textAlign === 'right' ? 'flex-end' : 'flex-start'
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
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.fillColor,
              border: `${element.borderWidth || 0}px solid ${element.borderColor}`,
              borderRadius: element.shapeType === 'circle' ? '50%' : element.borderRadius || 0
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
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              objectFit: 'contain'
            }}
          />
        );
      }
      
      if (element.type === 'chart') {
        // Render chart based on chartType
        const chartStyle = {
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height
        };
        
        // This would need to be implemented based on your chart components
        return (
          <div key={element.id} style={chartStyle}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}>
              Chart: {element.chartType}
            </div>
          </div>
        );
      }
      
      return null;
    });
  };

  return (
    <div className="fullscreen-slideshow">
      <div className="slideshow-header">
        <div className="slideshow-controls">
          <button 
            className="slideshow-button"
            onClick={prevSlide}
            title="Previous slide (←)"
          >
            <FiChevronLeft size={20} />
          </button>
          
          <button 
            className="slideshow-button"
            onClick={togglePlayPause}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
          
          <button 
            className="slideshow-button"
            onClick={nextSlide}
            title="Next slide (→)"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
        
        <div className="slideshow-info">
          <span className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </span>
          <span className="timer">
            {timeRemaining}s
          </span>
        </div>
        
        <button 
          className="slideshow-close"
          onClick={onClose}
          title="Exit slideshow (Esc)"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div 
        className="slideshow-content"
        style={{
          backgroundColor: slides[currentSlide]?.backgroundColor || '#ffffff',
          backgroundImage: slides[currentSlide]?.backgroundImage ? `url(${slides[currentSlide].backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="slide-container"
          style={{
            position: 'relative',
            width: '95vw',
            height: '85vh',
            maxWidth: '95vw',
            maxHeight: '85vh',
            backgroundColor: slides[currentSlide]?.backgroundColor || '#ffffff',
            backgroundImage: slides[currentSlide]?.backgroundImage ? `url(${slides[currentSlide].backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #333333',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
        >
          {renderSlideContent(slides[currentSlide])}
        </div>
      </div>
      
      <div className="slideshow-footer">
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setCurrentSlide(index);
                onSlideChange(index);
                setTimeRemaining(2);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullScreenSlideshow;
