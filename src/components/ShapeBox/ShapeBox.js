import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';

const ShapeBox = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const rndRef = useRef(null);

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
        cursor: isSelected ? 'move' : 'pointer'
      }}
      onClick={handleClick}
    >
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
        )}
      </div>
    </Rnd>
  );
};

export default ShapeBox;
