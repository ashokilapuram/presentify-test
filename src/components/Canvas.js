import React, { useState, useRef, useCallback } from 'react';
import { 
  FiEdit3, 
  FiMessageCircle, 
  FiSearch, 
  FiZoomOut, 
  FiMaximize2,
  FiGrid,
  FiEye
} from 'react-icons/fi';
import TextBox from './TextBox';

const Canvas = ({ 
  slide, 
  selectedElement, 
  setSelectedElement, 
  updateSlideElement, 
  deleteElement, 
  textFormatting 
}) => {
  const [editingElement, setEditingElement] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef(null);

  const handleElementSelect = (element) => {
    setSelectedElement(element);
    setEditingElement(null); // Exit edit mode when selecting different element
  };

  const handleElementEdit = (element) => {
    setSelectedElement(element);
    setEditingElement(element);
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
    setEditingElement(null);
  };


  const handleMouseDown = (e, element, handle = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Make sure element is selected
    if (selectedElement?.id !== element.id) {
      setSelectedElement(element);
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setDragState({
      element,
      handle,
      startX,
      startY,
      startElementX: element.x,
      startElementY: element.y,
      startElementWidth: element.width,
      startElementHeight: element.height
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragState) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;
    
    if (dragState.handle) {
      // Resizing
      let newWidth = dragState.startElementWidth;
      let newHeight = dragState.startElementHeight;
      let newX = dragState.startElementX;
      let newY = dragState.startElementY;
      
      switch (dragState.handle) {
        case 'se':
          newWidth = Math.max(50, dragState.startElementWidth + deltaX);
          newHeight = Math.max(20, dragState.startElementHeight + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(50, dragState.startElementWidth - deltaX);
          newHeight = Math.max(20, dragState.startElementHeight + deltaY);
          newX = dragState.startElementX + deltaX;
          break;
        case 'ne':
          newWidth = Math.max(50, dragState.startElementWidth + deltaX);
          newHeight = Math.max(20, dragState.startElementHeight - deltaY);
          newY = dragState.startElementY + deltaY;
          break;
        case 'nw':
          newWidth = Math.max(50, dragState.startElementWidth - deltaX);
          newHeight = Math.max(20, dragState.startElementHeight - deltaY);
          newX = dragState.startElementX + deltaX;
          newY = dragState.startElementY + deltaY;
          break;
        case 'e':
          newWidth = Math.max(50, dragState.startElementWidth + deltaX);
          break;
        case 'w':
          newWidth = Math.max(50, dragState.startElementWidth - deltaX);
          newX = dragState.startElementX + deltaX;
          break;
        case 'n':
          newHeight = Math.max(20, dragState.startElementHeight - deltaY);
          newY = dragState.startElementY + deltaY;
          break;
        case 's':
          newHeight = Math.max(20, dragState.startElementHeight + deltaY);
          break;
        default:
          break;
      }
      
      updateSlideElement(dragState.element.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    } else {
      // Moving
      const newX = Math.max(0, dragState.startElementX + deltaX);
      const newY = Math.max(0, dragState.startElementY + deltaY);
      
      updateSlideElement(dragState.element.id, {
        x: newX,
        y: newY
      });
    }
  }, [dragState, updateSlideElement]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  React.useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (selectedElement && e.key === 'Delete') {
        deleteElement(selectedElement.id);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedElement, deleteElement]);

  const renderResizeHandles = (element) => {
    if (selectedElement?.id !== element.id) return null;
    
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    
    return handles.map(handle => (
      <div
        key={handle}
        className={`resize-handle ${handle}`}
        onMouseDown={(e) => handleMouseDown(e, element, handle)}
      />
    ));
  };

  return (
    <div className="canvas-container">
      <div className="canvas-workspace">
        <div 
          className="canvas"
          ref={canvasRef}
          onClick={handleCanvasClick}
        >
          {slide?.elements?.map((element) => {
            if (element.type === 'text') {
              return (
                <TextBox
                  key={element.id}
                  element={element}
                  isSelected={selectedElement?.id === element.id}
                  isEditing={editingElement?.id === element.id}
                  onSelect={handleElementSelect}
                  onEdit={handleElementEdit}
                  onUpdate={updateSlideElement}
                  onDelete={deleteElement}
                  onMouseDown={handleMouseDown}
                  textFormatting={textFormatting}
                />
              );
            }

            return (
              <div
                key={element.id}
                className={`canvas-element ${selectedElement?.id === element.id ? 'selected' : ''}`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleElementSelect(element);
                }}
                onMouseDown={(e) => handleMouseDown(e, element)}
              >
                {element.type === 'shape' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fillColor,
                      border: `${element.borderWidth}px solid ${element.borderColor}`,
                      borderRadius: element.shapeType === 'circle' ? '50%' : '0'
                    }}
                  />
                )}
                
                {element.type === 'image' && (
                  <img
                    src={element.src}
                    alt="Slide element"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                )}
                {renderResizeHandles(element)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="canvas-footer">
        <div className="canvas-tabs">
          <div className="canvas-tab active">
            <FiMessageCircle size={16} />
            Notes
          </div>
          <div className="canvas-tab">
            <FiMessageCircle size={16} />
            Comments
          </div>
        </div>

        <div className="canvas-controls">
          <div className="zoom-control">
            <FiSearch size={16} />
            <input
              type="range"
              className="zoom-slider"
              min="25"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
            />
            <span className="zoom-percentage">{zoom}%</span>
          </div>

          <div className="view-controls">
            <button className="view-control-button">
              <FiZoomOut size={16} />
            </button>
            <button className="view-control-button">
              <FiMaximize2 size={16} />
            </button>
            <button className="view-control-button">
              <FiEye size={16} />
            </button>
            <button className="view-control-button">
              <FiGrid size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
