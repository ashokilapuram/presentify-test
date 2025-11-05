import { useState, useEffect } from 'react';

/**
 * Custom hook to handle modal dragging functionality
 */
export const useModalDrag = (isOpen, modalRef) => {
  const [position, setPosition] = useState(null); // null means use default centering
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle drag functionality
  const handleMouseDown = (e) => {
    if (!modalRef.current) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('table')) {
      return; // Don't drag if clicking on interactive elements
    }
    
    const rect = modalRef.current.getBoundingClientRect();
    const currentX = position ? position.x : (window.innerWidth - rect.width) / 2;
    const currentY = position ? position.y : (window.innerHeight - rect.height) / 2;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
    
    // If position is null (centered), set initial position
    if (!position) {
      setPosition({
        x: currentX,
        y: currentY
      });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!modalRef.current) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Get modal dimensions
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      
      // Keep modal within viewport with some padding
      const padding = 20;
      const minX = padding;
      const minY = padding;
      const maxX = window.innerWidth - modalWidth - padding;
      const maxY = window.innerHeight - modalHeight - padding;
      
      setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, modalRef]);

  // Reset dragging state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
    }
  }, [isOpen]);

  return {
    position,
    setPosition,
    isDragging,
    handleMouseDown
  };
};

