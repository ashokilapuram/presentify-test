import React, { useRef, useEffect, useState } from "react";
import { Image, Transformer, Group, Rect } from "react-konva";

const ImageBox = ({ element, isSelected, onSelect, onChange, readOnly = false }) => {
  const imageRef = useRef();
  const trRef = useRef();
  const [imgObj, setImgObj] = useState(null);

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.src = element.src;
    img.onload = () => setImgObj(img);
  }, [element.src]);

  // Handle selection transformer
  const groupRef = useRef();
  useEffect(() => {
    const nodeToTransform = element.cornerRadius !== undefined && element.cornerRadius > 0 ? groupRef.current : imageRef.current;
    if (isSelected && trRef.current && nodeToTransform && imgObj) {
      trRef.current.nodes([nodeToTransform]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, imgObj, element.cornerRadius]);

  const handleTransformEnd = () => {
    const node = element.cornerRadius !== undefined && element.cornerRadius > 0 ? groupRef.current : imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: Math.max(40, node.width() * scaleX),
      height: Math.max(40, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  if (!imgObj) return null;

  const cornerRadius = element.cornerRadius !== undefined ? element.cornerRadius : 0;
  const needsClipping = cornerRadius > 0;

  // If we have corner radius, wrap in Group with clipping
  if (needsClipping) {
    return (
      <>
        <Group
          ref={groupRef}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rotation={element.rotation || 0}
          draggable={!readOnly}
          onClick={(e) => {
            e.cancelBubble = true;
            onSelect();
          }}
          onTap={(e) => {
            e.cancelBubble = true;
            onSelect();
          }}
          onDragEnd={(e) =>
            onChange({ ...element, x: e.target.x(), y: e.target.y() })
          }
          onTransformEnd={handleTransformEnd}
          clipFunc={(ctx) => {
            const width = element.width;
            const height = element.height;
            const radius = cornerRadius;
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(width - radius, 0);
            ctx.quadraticCurveTo(width, 0, width, radius);
            ctx.lineTo(width, height - radius);
            ctx.quadraticCurveTo(width, height, width - radius, height);
            ctx.lineTo(radius, height);
            ctx.quadraticCurveTo(0, height, 0, height - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
          }}
        >
          <Image
            ref={imageRef}
            image={imgObj}
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            opacity={element.opacity !== undefined ? element.opacity : 1}
            shadowBlur={2}
          />
          {/* Border rect with corner radius */}
          {element.borderWidth && element.borderWidth > 0 && (
            <Rect
              x={0}
              y={0}
              width={element.width}
              height={element.height}
              cornerRadius={cornerRadius}
              stroke={element.borderColor}
              strokeWidth={element.borderWidth}
              fillEnabled={false}
            />
          )}
        </Group>
        {isSelected && !readOnly && (
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "bottom-center"
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 40 || newBox.height < 40) return oldBox;
              return newBox;
            }}
            anchorSize={8}
            anchorStroke="#0ea5e9"
            anchorFill="#ffffff"
            anchorStrokeWidth={2}
            borderStroke="#0ea5e9"
            borderStrokeWidth={1}
          />
        )}
      </>
    );
  }

  // Default rendering without corner radius
  return (
    <>
      <Image
        ref={imageRef}
        image={imgObj}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation || 0}
        opacity={element.opacity !== undefined ? element.opacity : 1}
        draggable={!readOnly}
        stroke={element.borderColor}
        strokeWidth={element.borderWidth || 0}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDragEnd={(e) =>
          onChange({ ...element, x: e.target.x(), y: e.target.y() })
        }
        onTransformEnd={handleTransformEnd}
        shadowBlur={2}
      />
      {isSelected && !readOnly && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "bottom-center"
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 40 || newBox.height < 40) return oldBox;
            return newBox;
          }}
          anchorSize={8}
          anchorStroke="#0ea5e9"
          anchorFill="#ffffff"
          anchorStrokeWidth={2}
          borderStroke="#0ea5e9"
          borderStrokeWidth={1}
        />
      )}
    </>
  );
};

export default ImageBox;
