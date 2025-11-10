import React, { useEffect, useRef } from "react";
import { Rect, Circle, RegularPolygon, Star, Transformer } from "react-konva";

// Convert hex to rgba with opacity
const hexToRgba = (hex, opacity = 1) => {
  if (!hex || hex === 'transparent') return `rgba(0, 0, 0, ${opacity})`;
  
  let r, g, b;
  if (hex.startsWith('#')) {
    const colorHex = hex.slice(1);
    if (colorHex.length === 3) {
      r = parseInt(colorHex[0] + colorHex[0], 16);
      g = parseInt(colorHex[1] + colorHex[1], 16);
      b = parseInt(colorHex[2] + colorHex[2], 16);
    } else {
      r = parseInt(colorHex.slice(0, 2), 16);
      g = parseInt(colorHex.slice(2, 4), 16);
      b = parseInt(colorHex.slice(4, 6), 16);
    }
  } else if (hex.startsWith('rgba')) {
    // If already rgba, extract rgb and use new opacity
    const matches = hex.match(/\d+\.?\d*/g);
    if (matches && matches.length >= 3) {
      r = parseInt(matches[0]);
      g = parseInt(matches[1]);
      b = parseInt(matches[2]);
    } else {
      return hex;
    }
  } else if (hex.startsWith('rgb')) {
    const matches = hex.match(/\d+/g);
    if (matches && matches.length >= 3) {
      r = parseInt(matches[0]);
      g = parseInt(matches[1]);
      b = parseInt(matches[2]);
    } else {
      return hex;
    }
  } else {
    return hex;
  }
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const KonvaShape = ({ element, isSelected, onSelect, onChange, readOnly = false }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: Math.max(30, node.width() * scaleX),
      height: Math.max(30, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  // Apply opacity to fill color if specified
  const fillColor = element.fillColor || '#3b82f6';
  const fillOpacity = element.fillOpacity !== undefined ? element.fillOpacity : 1;
  const fillWithOpacity = fillOpacity < 1 ? hexToRgba(fillColor, fillOpacity) : fillColor;

  const shapeProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    fill: fillWithOpacity,
    stroke: element.borderColor,
    strokeWidth: element.borderWidth,
    rotation: element.rotation || 0,
    draggable: !readOnly,
    onClick: (e) => {
      e.cancelBubble = true;
      onSelect();
    },
    onDragEnd: (e) =>
      onChange({ ...element, x: e.target.x(), y: e.target.y() }),
    onTransformEnd: handleTransformEnd,
    ref: shapeRef,
  };

  const renderShape = () => {
    switch (element.shapeType) {
      case "circle":
        return (
          <Circle
            {...shapeProps}
            radius={Math.min(element.width, element.height) / 2}
          />
        );
      case "triangle":
        return (
          <RegularPolygon
            {...shapeProps}
            sides={3}
            radius={Math.min(element.width, element.height) / 2}
          />
        );
      case "star":
        return (
          <Star
            {...shapeProps}
            numPoints={5}
            innerRadius={Math.min(element.width, element.height) / 4}
            outerRadius={Math.min(element.width, element.height) / 2}
          />
        );
      case "square":
        return <Rect {...shapeProps} cornerRadius={4} />;
      case "pentagon":
        return (
          <RegularPolygon
            {...shapeProps}
            sides={5}
            radius={Math.min(element.width, element.height) / 2}
          />
        );
      case "hexagon":
        return (
          <RegularPolygon
            {...shapeProps}
            sides={6}
            radius={Math.min(element.width, element.height) / 2}
          />
        );
      default: // rectangle
        return <Rect {...shapeProps} cornerRadius={4} />;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && !readOnly && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={
            element.shapeType === "square" 
              ? [
                  "top-left",
                  "top-right", 
                  "bottom-left",
                  "bottom-right",
                  "top-center",
                  "bottom-center",
                  "middle-left",
                  "middle-right"
                ]
              : [
                  "top-left",
                  "top-right",
                  "bottom-left", 
                  "bottom-right"
                ]
          }
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) return oldBox;
            return newBox;
          }}
          anchorSize={element.shapeType === "square" ? 8 : 6}
          anchorStroke="#0ea5e9"
          anchorFill="#ffffff"
          anchorStrokeWidth={2}
          borderStroke="#0ea5e9"
          borderStrokeWidth={2}
          borderDash={[5, 5]}
        />
      )}
    </>
  );
};

export default KonvaShape;
