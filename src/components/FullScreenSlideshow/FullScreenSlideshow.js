import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import { BarChart, LineChart, PieChart } from '../ChartBox/ChartBox';
import './FullScreenSlideshow.css';

const FullScreenSlideshow = ({ slides, currentSlideIndex, onClose, onSlideChange }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(currentSlideIndex);
  const [timeRemaining, setTimeRemaining] = useState(5);

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
          return 5;
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
    setTimeRemaining(5);
  }, [currentSlide, slides.length, onSlideChange]);

  const prevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(prevIndex);
    onSlideChange(prevIndex);
    setTimeRemaining(5);
  }, [currentSlide, slides.length, onSlideChange]);

  // Reset timer when slide changes manually
  useEffect(() => {
    setTimeRemaining(5);
  }, [currentSlide]);

  // Prevent body scrolling when slideshow is open
  useEffect(() => {
    document.body.classList.add('slideshow-open');
    return () => {
      document.body.classList.remove('slideshow-open');
    };
  }, []);

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

    // Use the same dimensions as the canvas (16:9 aspect ratio, max 800px width)
    const slideWidth = 800;
    const slideHeight = 450; // 800 * 9/16 = 450 (16:9 aspect ratio)
    
    // Calculate scale factor to fit slide content in fullscreen while maintaining aspect ratio
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Account for header and footer space (approximately 120px total)
    const availableHeight = screenHeight - 120;
    const availableWidth = screenWidth;
    
    const scaleX = availableWidth / slideWidth;
    const scaleY = availableHeight / slideHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

    return (
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: slideWidth,
          height: slideHeight,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {slide.elements.map((element) => {
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
              backgroundColor: element.fillColor || '#3b82f6',
              border: `${element.borderWidth || 0}px solid ${element.borderColor || '#1e40af'}`,
              borderRadius: element.shapeType === 'circle' ? '50%' : (element.shapeType === 'rectangle' ? 0 : element.borderRadius || 0),
              transform: `rotate(${element.rotation || 0}deg)`,
              transformOrigin: 'center',
              clipPath: element.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                         element.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
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
        // Render chart based on chartType using the actual chart components
        const chartStyle = {
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: 8
        };
        
        const renderChart = () => {
          switch (element.chartType) {
            case 'line':
              return <LineChart 
                width={element.width - 16} 
                height={element.height - 16} 
                labels={element.labels} 
                values={element.values} 
                color={element.color} 
              />;
            case 'pie':
              return <PieChart 
                width={element.width - 16} 
                height={element.height - 16} 
                labels={element.labels} 
                values={element.values} 
                color={element.color} 
                sliceColors={element.sliceColors} 
              />;
            case 'bar':
            default:
              return <BarChart 
                width={element.width - 16} 
                height={element.height - 16} 
                labels={element.labels} 
                values={element.values} 
                color={element.color} 
                barColors={element.barColors} 
              />;
          }
        };
        
        return (
          <div key={element.id} style={chartStyle}>
            {renderChart()}
          </div>
        );
      }
      
      return null;
    })}
      </div>
    );
  };

  return createPortal(
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
      
      <div className="slideshow-content">
        <div 
          className="slide-container"
          style={{
            backgroundColor: slides[currentSlide]?.backgroundColor || '#ffffff',
            backgroundImage: slides[currentSlide]?.backgroundImage ? `url(${slides[currentSlide].backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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
                setTimeRemaining(5);
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenSlideshow;
