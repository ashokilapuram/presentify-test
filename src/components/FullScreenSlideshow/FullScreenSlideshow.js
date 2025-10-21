import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import KonvaCanvas from "../KonvaCanvas/KonvaCanvas"; // ✅ import your existing canvas
import "./FullScreenSlideshow.css";

const FullScreenSlideshow = ({
  slides,
  currentSlideIndex,
  onClose,
  onSlideChange,
}) => {
  // Always start slideshow from first slide
  const [slideshowSlideIndex, setSlideshowSlideIndex] = useState(0);
  const nextSlide = useCallback(() => {
    const nextIndex = (slideshowSlideIndex + 1) % slides.length;
    setSlideshowSlideIndex(nextIndex);
  }, [slides.length, slideshowSlideIndex]);

  const prevSlide = useCallback(() => {
    const prevIndex = (slideshowSlideIndex - 1 + slides.length) % slides.length;
    setSlideshowSlideIndex(prevIndex);
  }, [slides.length, slideshowSlideIndex]);

  // ✅ Enter fullscreen only if not already active
  useEffect(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }

    // ✅ Detect when user exits fullscreen manually (Esc)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // Automatically close slideshow if fullscreen exited
        onClose && onClose();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onClose]);

  // Auto-advance timer (5 seconds per slide)
  useEffect(() => {
    const autoAdvanceTimer = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds

    return () => {
      clearInterval(autoAdvanceTimer);
    };
  }, [nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        // ✅ Close slideshow and fullscreen in one go
        onClose && onClose();

        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    document.addEventListener("keydown", handleKeyPress, true); // Use capture phase
    return () => document.removeEventListener("keydown", handleKeyPress, true);
  }, [nextSlide, prevSlide, onClose]);

  const currentSlide = slides[slideshowSlideIndex];

  return createPortal(
    <div className="fullscreen-slideshow">
      <div className="slideshow-content">
        {/* Centered 16:9 container */}
        <div className="slide-viewport">
          <div className="slide-placeholder">
            <KonvaCanvas
              slide={currentSlide}
              selectedElement={null}
              setSelectedElement={() => {}}
              updateSlideElement={() => {}}
              deleteElement={() => {}}
              textFormatting={{}}
              isDarkMode={false}
              onToggleDarkMode={() => {}}
              onThumbnailUpdate={() => {}}
              readOnly={true}
            />
          </div>
        </div>
      </div>

      <div className="slideshow-controls">
        <button className="slideshow-button" onClick={prevSlide}>
          <FiChevronLeft size={24} />
        </button>
        <span className="slide-counter">
          {slideshowSlideIndex + 1} / {slides.length}
        </span>
        <button className="slideshow-button" onClick={nextSlide}>
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenSlideshow;