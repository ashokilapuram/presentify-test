import React, { useRef, useEffect, useState } from "react";
import { Image, Transformer } from "react-konva";

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
  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = imageRef.current;
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
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 40 || newBox.height < 40) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ImageBox;
