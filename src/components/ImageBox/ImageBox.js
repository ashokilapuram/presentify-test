import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';

const ImageBox = ({
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
      y: position.y,
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
      onClick={handleClick}
      enableDragging={true}
      enableResizing={true}
      dragHandleClassName="drag-handle"
      style={{
        position: "absolute",
        cursor: isSelected ? "move" : "pointer",
      }}
    >
      <div
        className="drag-handle"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: `rotate(${element.rotation || 0}deg)`,
          transformOrigin: "center",
        }}
      >
        {/* Image */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            border: isSelected 
              ? "2px dashed #2563eb" 
              : `${element.borderWidth || 0}px solid ${element.borderColor || "transparent"}`,
          }}
        >
          <img
            src={element.src}
            alt="Slide element"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block"
            }}
          />
        </div>

      </div>
    </Rnd>
  );
};

export default ImageBox;
