import React, { useEffect, useRef } from "react";
import { Rect, Circle, RegularPolygon, Star, Transformer } from "react-konva";

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

  const shapeProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    fill: element.fillColor,
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
