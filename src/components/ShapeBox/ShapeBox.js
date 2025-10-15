import React, { useRef, useState, useCallback } from "react";
import { Rnd } from "react-rnd";

const ShapeBox = ({ element, isSelected, onSelect, onUpdate, onDelete }) => {
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

  const handleRotationStart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsRotating(true);

      const rndElement =
        rndRef.current?.resizableElement?.current || rndRef.current;
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
        const rotation =
          startRotation + (currentAngle - startAngle) * (180 / Math.PI);
        onUpdate(element.id, { rotation });
      };

      const handleMouseUp = () => {
        setIsRotating(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [element.id, element.rotation, onUpdate]
  );

  return (
    <Rnd
      ref={rndRef}
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      onClick={handleClick}
      style={{
        position: "absolute",
        cursor: isSelected ? "move" : "pointer",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: `rotate(${element.rotation || 0}deg)`,
          transformOrigin: "center",
        }}
      >
        {/* Shape + visual rotating border */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: element.fillColor || "#3b82f6",
            borderRadius:
              element.shapeType === "circle"
                ? "50%"
                : element.shapeType === "rectangle"
                ? 0
                : element.borderRadius || 0,
            clipPath:
              element.shapeType === "triangle"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : element.shapeType === "star"
                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                : "none",
            border: `${element.borderWidth || 0}px solid ${
              element.borderColor || "#1e40af"
            }`,
          }}
        />

        {/* Rotation handle */}
        {isSelected && (
          <div
            onMouseDown={handleRotationStart}
            style={{
              position: "absolute",
              top: "-25px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#ff0000",
              border: "2px solid #fff",
              cursor: "grab",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </Rnd>
  );
};

export default ShapeBox;