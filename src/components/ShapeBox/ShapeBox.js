import React, { useRef, useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';

const ShapeBox = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const rndRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);

  const handleDragStop = (e, d) => {
    onUpdate(element.id, { x: d.x, y: d.y });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    onUpdate(element.id, {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
      x: position.x,
      y: position.y
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(element);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(element.id);
  };

  const handleRotationStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);
    
    // Get the actual DOM element from the Rnd component
    const rndElement = rndRef.current?.resizableElement?.current || rndRef.current;
    if (!rndElement || !rndElement.getBoundingClientRect) {
      setIsRotating(false);
      return;
    }
    
    const rect = rndElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const startRotation = element.rotation || 0;
    
    const handleMouseMove = (e) => {
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const rotation = startRotation + (currentAngle - startAngle) * (180 / Math.PI);
      onUpdate(element.id, { rotation: rotation });
    };
    
    const handleMouseUp = () => {
      setIsRotating(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element.id, element.rotation, onUpdate]);

  return (
    <Rnd
      ref={rndRef}
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      className={`shape-container ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        cursor: isSelected ? 'move' : 'pointer',
        border: isSelected ? '2px solid #000000' : 'none',
        borderRadius: element.shapeType === 'circle' ? '50%' : 0,
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center'
      }}
      onClick={handleClick}
    >
      {/* Rotation handle positioned above the boundary - outside shape div to avoid overflow hidden */}
      {isSelected && (
        <div
          onMouseDown={handleRotationStart}
          style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ff0000',
            border: '2px solid #ffffff',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#ffffff'
            }}
          />
        </div>
      )}
      
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: element.fillColor || '#3b82f6',
          border: `${element.borderWidth || 0}px solid ${element.borderColor || '#1e40af'}`,
          borderRadius: element.shapeType === 'circle' ? '50%' : (element.shapeType === 'rectangle' ? 0 : element.borderRadius || 0),
          position: 'relative',
          overflow: 'hidden',
          clipPath: element.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                     element.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
        }}
      >
        {isSelected && (
          <>
            {/* Debug: Check if isSelected is true */}
            {console.log('ShapeBox isSelected:', isSelected, 'element.id:', element.id)}
            
            {/* Delete button */}
            <button
              className="shape-delete-button"
              onClick={handleDelete}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              ×
            </button>
          </>
        )}
      </div>
    </Rnd>
  );
};

export default ShapeBox;
