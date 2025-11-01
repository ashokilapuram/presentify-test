import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import EditableTextBox from '../EditableTextBox/EditableTextBox';
import KonvaShape from '../KonvaShape/KonvaShape';
import ImageBox from '../ImageBox/ImageBox';
import ChartBox from '../ChartBox/ChartBox';

const KonvaCanvas = ({
  slide,
  updateSlideElement,
  setSelectedElement,
  selectedElement,
  deleteElement,
  onThumbnailUpdate,   // ✅ new prop
  readOnly = false,
}) => {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 800, height: 450 }); // 16:9
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Responsive scaling logic
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = document.querySelector('.canvas-container')?.offsetWidth || 800;
      const scaleFactor = containerWidth / 1024; // base width
      setScale(scaleFactor);
      setStageSize({
        width: 1024 * scaleFactor,
        height: 576 * scaleFactor,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (stageRef.current && typeof onThumbnailUpdate === 'function') {
      const dataURL = stageRef.current.toDataURL({ 
        pixelRatio: 0.25,
        mimeType: 'image/png',
        quality: 1
      });
      // Pass slide.id along with the thumbnail data to avoid stale index issues
      onThumbnailUpdate(slide.id, dataURL);
    }
  }, [slide, scale, onThumbnailUpdate]);

  // Load background image when slide backgroundImage changes
  useEffect(() => {
    if (slide?.backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setBackgroundImage(img);
      };
      img.onerror = () => {
        console.error('Failed to load background image');
        setBackgroundImage(null);
      };
      img.src = slide.backgroundImage;
    } else {
      setBackgroundImage(null);
    }
  }, [slide?.backgroundImage]);

  // Handle element selection
  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  // Handle element drag end
  const handleDragEnd = (element, e) => {
    updateSlideElement(element.id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };


  // Render slide elements
  const renderElements = () => {
    if (!slide?.elements) return null;

    return slide.elements.map((element) => {
      if (element.type === 'text') {
        return (
          <EditableTextBox
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onSelect={() => handleElementClick(element)}
            onChange={(updates) => updateSlideElement(element.id, updates)}
            readOnly={readOnly}
          />
        );
      }

      if (element.type === 'shape') {
        return (
          <KonvaShape
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onSelect={() => handleElementClick(element)}
            onChange={(updates) => updateSlideElement(element.id, updates)}
            readOnly={readOnly}
          />
        );
      }

      if (element.type === 'image') {
        return (
          <ImageBox
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onSelect={() => handleElementClick(element)}
            onChange={(updates) => updateSlideElement(element.id, updates)}
            readOnly={readOnly}
          />
        );
      }

      if (element.type === 'chart') {
        return (
          <ChartBox
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onSelect={() => handleElementClick(element)}
            onChange={(updates) => updateSlideElement(element.id, updates)}
            readOnly={readOnly}
          />
        );
      }

      return null;
    });
  };

  return (
    <div className="canvas-container">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        style={{
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.15)',
        }}
        ref={stageRef}
        onClick={(e) => {
          // Deselect if clicking on empty canvas area
          if (e.target === e.target.getStage()) {
            setSelectedElement(null);
          }
        }}
      >
        <Layer>
          {/* Background image */}
          {backgroundImage && (
            <KonvaImage
              image={backgroundImage}
              x={0}
              y={0}
              width={1024}
              height={576}
              listening={false}
            />
          )}
          {/* Background color (only if no background image) */}
          {!backgroundImage && slide?.backgroundColor && (
            <Rect
              x={0}
              y={0}
              width={1024}
              height={576}
              fill={slide.backgroundColor}
              listening={false}
            />
          )}
          {/* Default white background if no background color or image */}
          {!backgroundImage && !slide?.backgroundColor && (
            <Rect
              x={0}
              y={0}
              width={1024}
              height={576}
              fill="white"
              listening={false}
            />
          )}
          {renderElements()}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;

