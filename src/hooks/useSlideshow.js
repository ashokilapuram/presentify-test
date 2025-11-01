import { useState, useCallback } from 'react';

export const useSlideshow = (setCurrentSlideIndex, setSelectedElement) => {
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [showFullScreenSlideshow, setShowFullScreenSlideshow] = useState(false);

  const startFullScreenSlideshow = useCallback(() => {
    setShowFullScreenSlideshow(true);
  }, []);

  const closeFullScreenSlideshow = useCallback(() => {
    setShowFullScreenSlideshow(false);
  }, []);

  const stopSlideshow = useCallback(() => {
    setIsSlideshowOpen(false);
  }, []);

  const handleSlideshowSlideChange = useCallback((newSlideIndex) => {
    setCurrentSlideIndex(newSlideIndex);
    // Deselect element when changing slides
    setSelectedElement(null);
    // Also clear text editing state
    const clearEditingEvent = new CustomEvent('clearTextEditing');
    document.dispatchEvent(clearEditingEvent);
  }, [setCurrentSlideIndex, setSelectedElement]);

  return {
    // State
    isSlideshowOpen,
    setIsSlideshowOpen,
    showFullScreenSlideshow,
    setShowFullScreenSlideshow,
    
    // Actions
    startFullScreenSlideshow,
    closeFullScreenSlideshow,
    stopSlideshow,
    handleSlideshowSlideChange
  };
};
