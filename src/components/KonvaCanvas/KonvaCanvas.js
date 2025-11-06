import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import EditableTextBox from '../EditableTextBox/EditableTextBox';
import KonvaShape from '../KonvaShape/KonvaShape';
import ImageBox from '../ImageBox/ImageBox';
import ChartBox from '../ChartBox/ChartBox';
import ContextMenu from '../ContextMenu/ContextMenu';

const KonvaCanvas = ({
  slide,
  updateSlideElement,
  setSelectedElement,
  selectedElement,
  deleteElement,
  updateSlide,
  onThumbnailUpdate,   // ✅ new prop
  onOpenDesignTab,
  readOnly = false,
}) => {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 800, height: 450 }); // 16:9
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, position: null });

  // Responsive scaling logic
  useEffect(() => {
    const handleResize = () => {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const container = document.querySelector('.canvas-container');
        if (!container) return;
        
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const baseWidth = 1024;
        const baseHeight = 576;
        
        // Check if we're in fullscreen slideshow (check for fullscreen-slideshow parent)
        const isInSlideshow = container.closest('.fullscreen-slideshow') !== null;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isFullscreen = isInSlideshow || (containerWidth >= viewportWidth * 0.85 && 
                          containerHeight >= viewportHeight * 0.85);
        
        if (isFullscreen) {
          // Fullscreen mode: scale based on screen width, height maintains ratio automatically
          // Use the larger of container or viewport to ensure we fill the screen
          const actualWidth = Math.max(containerWidth, viewportWidth);
          const scaleFactor = actualWidth / baseWidth;
          setScale(scaleFactor);
          setIsFullscreenMode(true);
          setStageSize({
            width: baseWidth,
            height: baseHeight,
          });
        } else {
          setIsFullscreenMode(false);
          // Normal mode: scale based on container width
          const scaleFactor = containerWidth / baseWidth;
          setScale(scaleFactor);
          setStageSize({
            width: baseWidth * scaleFactor,
            height: baseHeight * scaleFactor,
          });
        }
      });
    };
    
    // Initial resize with a small delay to ensure DOM is ready
    setTimeout(handleResize, 100);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure high-quality canvas rendering in fullscreen
  useEffect(() => {
    if (stageRef.current && isFullscreenMode) {
      const stage = stageRef.current;
      
      // Set high pixel ratio on stage
      const pixelRatio = Math.max(window.devicePixelRatio || 2, 3);
      stage.pixelRatio(pixelRatio);
      
      const layers = stage.getLayers();
      layers.forEach((layer) => {
        const canvas = layer.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Enable high-quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          }
        }
      });
      
      // Force redraw with high quality
      stage.batchDraw();
      
      // Redraw again after a short delay to ensure settings are applied
      setTimeout(() => {
        stage.batchDraw();
      }, 100);
    }
  }, [isFullscreenMode, slide, scale]);

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

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({ visible: false, position: null });
  };

  // Close context menu when slide changes
  useEffect(() => {
    closeContextMenu();
  }, [slide?.id]);

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

  // Attach native contextmenu listener directly to the Konva canvas (Chrome + Edge compatible)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Get the container div that wraps the canvas
    const container = stage.container ? stage.container() : null;
    if (!container) return;

    // Get the actual canvas element or the content wrapper
    const content = container.querySelector('.konvajs-content') || container.querySelector('canvas') || container;
    if (!content) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }

      const rect = container.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      // Calculate relative position for Konva intersection check
      const stageScale = stage.scaleX();
      const relativeX = (x - rect.left) / stageScale;
      const relativeY = (y - rect.top) / stageScale;

      // Only open context menu when clicking on empty stage
      const shape = stage.getIntersection({ x: relativeX, y: relativeY });
      if (!shape) {
        // Prevent duplicate menus
        setContextMenu((prev) => {
          if (prev.visible) return prev;
          return { visible: true, position: { x, y } };
        });
      } else {
        // Clicked on element → close
        setContextMenu({ visible: false, position: null });
      }
    };

    content.addEventListener('contextmenu', handleContextMenu, { capture: true, passive: false });

    return () => {
      content.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    };
  }, [slide, scale]); // Re-attach when slide or scale changes


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
            onChange={(updates) => {
              // update element in slides state
              updateSlideElement(element.id, updates);
              // immediately update selectedElement in parent to the latest merged object
              // so selection doesn't point to a stale object after update
              setSelectedElement(prev => {
                // If previously selected isn't this element, don't override selection
                if (!prev || prev.id !== element.id) return prev;
                return { ...prev, ...updates };
              });
            }}
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
        pixelRatio={isFullscreenMode ? Math.max(window.devicePixelRatio || 2, 3) : 1}
        imageSmoothingEnabled={true}
        style={{
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.15)',
        }}
        ref={stageRef}
        onClick={(e) => {
          // Deselect if clicking on empty canvas area
          if (e.target === e.target.getStage()) {
            setSelectedElement(null);
            closeContextMenu();
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
      <ContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        onClose={closeContextMenu}
        currentSlide={slide}
        updateSlide={updateSlide}
        onOpenDesignTab={onOpenDesignTab}
      />
    </div>
  );
};

export default KonvaCanvas;

