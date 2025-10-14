import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import './TextBox.css';

const TextBox = ({
  element,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onUpdate,
  onDelete,
  textFormatting,
  onFormatChange
}) => {
  const textDivRef = useRef(null);
  const [localContent, setLocalContent] = useState(element.content);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSize, setCurrentSize] = useState({ width: element.width, height: element.height });

  // Sync content
  useEffect(() => {
    if (textDivRef.current && document.activeElement !== textDivRef.current) {
      textDivRef.current.innerHTML = element.content || '';
    }
  }, [element.content]);

  // Sync size with element dimensions
  useEffect(() => {
    setCurrentSize({ width: element.width, height: element.height });
  }, [element.width, element.height]);

  // Apply element-level visual styles
  useEffect(() => {
    const el = textDivRef.current;
    if (!el) return;
    el.style.fontSize = `${element.fontSize || 16}px`;
    el.style.fontWeight = element.fontWeight || 'normal';
    el.style.fontStyle = element.fontStyle || 'normal';
    el.style.textDecoration = element.textDecoration || 'none';
    el.style.textAlign = element.textAlign || 'left';
    el.style.color = element.color || '#000';
    el.style.fontFamily = element.fontFamily || 'Inter, sans-serif';
  }, [element]);

  // Store / restore text selection
  const storeSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (!range.collapsed) {
        window.__PRESENTIFY_SELECTION__ = {
          element: textDivRef.current,
          range: range.cloneRange()
        };
      }
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const store = window.__PRESENTIFY_SELECTION__;
    if (store && store.element === textDivRef.current && store.range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(store.range);
    }
  }, []);

  // Calculate text dimensions for auto-sizing
  const calculateTextDimensions = useCallback(() => {
    if (!textDivRef.current) return { width: element.width, height: element.height };
    
    // Get the canvas container to determine available space
    const canvasContainer = document.querySelector('.canvas');
    const maxAvailableWidth = canvasContainer ? canvasContainer.offsetWidth - 100 : 600; // Leave some margin
    const maxAvailableHeight = canvasContainer ? canvasContainer.offsetHeight - 100 : 400; // Leave some margin
    
    // Use the current width or a reasonable default, but don't exceed slide boundaries
    const fixedWidth = Math.min(element.width || 200, maxAvailableWidth);
    
    // Create a temporary div to measure text with fixed width
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = `${fixedWidth}px`;
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.wordWrap = 'break-word';
    tempDiv.style.fontSize = `${element.fontSize || 16}px`;
    tempDiv.style.fontWeight = element.fontWeight || 'normal';
    tempDiv.style.fontStyle = element.fontStyle || 'normal';
    tempDiv.style.fontFamily = element.fontFamily || 'Inter, sans-serif';
    tempDiv.style.padding = '8px';
    tempDiv.style.border = 'none';
    tempDiv.style.outline = 'none';
    tempDiv.style.boxSizing = 'border-box';
    
    // Set the content and measure height
    tempDiv.innerHTML = textDivRef.current.innerHTML;
    document.body.appendChild(tempDiv);
    const totalHeight = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);
    
    // Keep the fixed width, adjust height but respect slide boundaries
    const newWidth = fixedWidth;
    const newHeight = Math.min(
      Math.max(totalHeight, 30), // Ensure minimum height
      maxAvailableHeight // Don't exceed slide height
    );
    
    return { width: newWidth, height: newHeight };
  }, [element.fontSize, element.fontWeight, element.fontStyle, element.fontFamily, element.width]);

  // Handle text input with auto-sizing
  const handleInput = useCallback(() => {
    const html = textDivRef.current.innerHTML;
    setLocalContent(html);
    
    // Calculate new dimensions based on content
    const { width, height } = calculateTextDimensions();
    
    // Update current size state immediately for visual feedback
    setCurrentSize({ width, height });
    
    // Update element with new content and dimensions
    onUpdate(element.id, { 
      content: html,
      width: width,
      height: height
    });
  }, [element.id, onUpdate, calculateTextDimensions]);

  // Core formatting logic
  const applyFormatting = useCallback(
    (property, value) => {
      const el = textDivRef.current;
      if (!el) return;
      el.focus();
      restoreSelection();

      const selection = window.getSelection();
      const hasSelection =
        selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
      const range = hasSelection ? selection.getRangeAt(0) : null;

      const wrapSpan = (styleKey, styleValue) => {
        if (!range) return;
        const span = document.createElement('span');
        span.style[styleKey] = styleValue;
        const frag = range.extractContents();
        span.appendChild(frag);
        range.insertNode(span);
      };

      switch (property) {
        case 'fontFamily':
          wrapSpan('fontFamily', value);
          break;
        case 'fontSize':
          wrapSpan('fontSize', `${value}px`);
          break;
        case 'color':
          wrapSpan('color', value);
          break;
        case 'fontWeight':
          document.execCommand('bold');
          break;
        case 'fontStyle':
          document.execCommand('italic');
          break;
        case 'textDecoration':
          document.execCommand('underline');
          break;
        case 'textAlign':
          el.style.textAlign = value;
          break;
        default:
          break;
      }

      // Calculate new dimensions after formatting change
      const { width, height } = calculateTextDimensions();
      
      // Update current size state immediately for visual feedback
      setCurrentSize({ width, height });
      
      onUpdate(element.id, { 
        content: el.innerHTML, 
        [property]: value,
        width: width,
        height: height
      });
    },
    [element.id, onUpdate, restoreSelection, calculateTextDimensions]
  );

  // 🔒 Call onFormatChange only once (not every render)
  useEffect(() => {
    if (onFormatChange) {
      onFormatChange(() => applyFormatting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ empty dependency array prevents infinite re-renders

  return (
    <Rnd
      size={{ width: currentSize.width, height: currentSize.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={(e, d) => onUpdate(element.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) => {
        const newWidth = parseInt(ref.style.width);
        const newHeight = parseInt(ref.style.height);
        setCurrentSize({ width: newWidth, height: newHeight });
        onUpdate(element.id, {
          width: newWidth,
          height: newHeight,
          x: pos.x,
          y: pos.y
        });
      }}
      bounds="parent"
      disableDragging={isEditing}
      className={`textbox-container ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`}
      style={{
        background: element.backgroundColor || 'transparent',
        cursor: isEditing ? 'text' : 'move',
        border: element.borderWidth && element.borderWidth > 0 
          ? `${element.borderWidth}px solid ${element.borderColor || '#e5e7eb'}` 
          : 'none'
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) onSelect(element);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEdit(element);
        setTimeout(() => {
          textDivRef.current?.focus();
        }, 50);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isSelected || isHovered) && !isEditing && (
        <div
          className="textbox-delete-button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(element.id);
          }}
        >
          ×
        </div>
      )}

      <div
        ref={textDivRef}
        className="textbox-ce"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={storeSelection}
        onKeyUp={storeSelection}
        style={{
          width: '100%',
          height: '100%',
          padding: 8,
          overflow: 'auto',
          outline: 'none',
          background: 'transparent',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          boxSizing: 'border-box',
          ...{
            fontSize: element.fontSize,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            textDecoration: element.textDecoration,
            color: element.color,
            textAlign: element.textAlign,
            fontFamily: element.fontFamily || 'Inter, sans-serif'
          }
        }}
      />
    </Rnd>
  );
};

export default TextBox;