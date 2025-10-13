import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TextBox.css';

const TextBox = ({ 
  element, 
  isSelected, 
  isEditing,
  onSelect, 
  onEdit,
  onUpdate,
  onDelete,
  onMouseDown,
  textFormatting
}) => {
  const [localContent, setLocalContent] = useState(element.content);
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 });
  const [hasContentChanged, setHasContentChanged] = useState(false);
  
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const measureRef = useRef(null);

  // Sync local content with element content
  useEffect(() => {
    setLocalContent(element.content);
  }, [element.content]);

  // Auto-resize functionality
  const updateSize = useCallback(() => {
    if (!measureRef.current || !isEditing || !localContent) return;

    const measureElement = measureRef.current;
    measureElement.textContent = localContent;
    
    // Get the current content dimensions
    const contentWidth = measureElement.scrollWidth + 20; // Add padding
    const contentHeight = measureElement.scrollHeight + 16; // Add padding
    
    // Calculate new dimensions with minimum constraints
    const newWidth = Math.max(contentWidth, Math.max(element.width, 100));
    const newHeight = Math.max(contentHeight, Math.max(element.height, 30));

    // Only update if content requires more space than current size
    const needsWidthIncrease = contentWidth > element.width;
    const needsHeightIncrease = contentHeight > element.height;
    
    if (needsWidthIncrease || needsHeightIncrease) {
      onUpdate(element.id, { 
        width: needsWidthIncrease ? newWidth : element.width,
        height: needsHeightIncrease ? newHeight : element.height
      });
    }
  }, [localContent, element.width, element.height, element.id, onUpdate, isEditing]);

  // Update size when content changes (not when just entering edit mode)
  useEffect(() => {
    if (isEditing && hasContentChanged && localContent !== element.content) {
      const timeoutId = setTimeout(updateSize, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [localContent, element.content, updateSize, isEditing, hasContentChanged]);

  // Reset content changed flag when entering/exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setHasContentChanged(false);
    }
  }, [isEditing]);

  // Handle text content changes
  const handleContentChange = useCallback((e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    setHasContentChanged(true); // Mark that content has actually changed
    
    // Save selection before updating
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setTextSelection({ start, end });
    
    // Debounced update to parent
    clearTimeout(handleContentChange.timeoutId);
    handleContentChange.timeoutId = setTimeout(() => {
      onUpdate(element.id, { content: newContent });
    }, 300);
  }, [element.id, onUpdate]);

  // Handle text selection changes
  const handleSelectionChange = useCallback(() => {
    if (textareaRef.current && isEditing) {
      const textarea = textareaRef.current;
      setTextSelection({
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      });
    }
  }, [isEditing]);

  // Apply text formatting to selected text
  const applyFormatting = useCallback((property, value) => {
    if (!isEditing || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // If text is selected, we could implement rich text formatting here
    // For now, we'll apply formatting to the entire text box
    onUpdate(element.id, { [property]: value });

    // Restore selection
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start, end);
      }
    }, 0);
  }, [isEditing, element.id, onUpdate]);

  // Handle mouse down for dragging and resizing
  const handleMouseDown = useCallback((e, handle = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSelected) {
      onSelect(element);
      return;
    }

    // Let the Canvas component handle the dragging and resizing
    if (onMouseDown) {
      onMouseDown(e, element, handle);
    }
  }, [isSelected, element, onSelect, onMouseDown]);

  // Handle double click to enter edit mode
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(element);
    
    // Focus and select all text after a brief delay
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    }, 50);
  }, [element, onEdit]);

  // Handle key events
  const handleKeyDown = useCallback((e) => {
    if (!isEditing) return;

    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyFormatting('fontWeight', element.fontWeight === 'bold' ? 'normal' : 'bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormatting('fontStyle', element.fontStyle === 'italic' ? 'normal' : 'italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormatting('textDecoration', element.textDecoration === 'underline' ? 'none' : 'underline');
          break;
        case 'a':
          e.preventDefault();
          textareaRef.current?.select();
          break;
        default:
          break;
      }
    }

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current?.blur();
    }

    // Handle Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      textareaRef.current?.blur();
    }

    // Handle Delete key
    if (e.key === 'Delete' && !isEditing) {
      e.preventDefault();
      onDelete(element.id);
    }
  }, [isEditing, element, applyFormatting, onDelete]);

  // Handle blur (exit edit mode)
  const handleBlur = useCallback(() => {
    // Small delay to allow for formatting button clicks
    setTimeout(() => {
      if (isEditing) {
        onEdit(null);
      }
    }, 150);
  }, [isEditing, onEdit]);

  // Focus handling
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Restore previous selection if available
      if (textSelection.start !== textSelection.end) {
        textareaRef.current.setSelectionRange(textSelection.start, textSelection.end);
      }
    }
  }, [isEditing, textSelection]);

  // Render resize handles
  const renderResizeHandles = () => {
    if (!isSelected || isEditing) return null;

    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    
    return handles.map(handle => (
      <div
        key={handle}
        className={`textbox-resize-handle textbox-resize-handle-${handle}`}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onMouseDown) {
            onMouseDown(e, element, handle);
          }
        }}
      />
    ));
  };

  const textboxStyle = {
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textDecoration: element.textDecoration,
    textAlign: element.textAlign,
    color: element.color,
    fontFamily: element.fontFamily || 'Inter, sans-serif',
    lineHeight: element.lineHeight || 1.4,
    letterSpacing: element.letterSpacing || 'normal',
  };

  const measureStyle = {
    ...textboxStyle,
    position: 'absolute',
    visibility: 'hidden',
    height: 'auto',
    width: 'max-content',
    maxWidth: '800px', // Reasonable max width
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    padding: '8px',
    border: 'none',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,
  };

  return (
    <>
      {/* Invisible measuring element */}
      <div
        ref={measureRef}
        style={measureStyle}
        aria-hidden="true"
      />
      
      {/* Main textbox container */}
      <div
        ref={containerRef}
        className={`textbox-container ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`}
        style={textboxStyle}
        onMouseDown={(e) => {
          if (isEditing) {
            // Allow text selection when editing
            e.stopPropagation();
            return;
          }
          handleMouseDown(e);
        }}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isSelected ? 0 : -1}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="textbox-textarea"
            value={localContent}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onSelect={handleSelectionChange}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: 'inherit',
              fontWeight: 'inherit',
              fontStyle: 'inherit',
              textDecoration: 'inherit',
              textAlign: 'inherit',
              color: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
              letterSpacing: 'inherit',
            }}
            spellCheck={true}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        ) : (
          <div 
            className="textbox-display"
            style={{
              fontSize: 'inherit',
              fontWeight: 'inherit',
              fontStyle: 'inherit',
              textDecoration: 'inherit',
              textAlign: 'inherit',
              color: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            {localContent || 'Click to edit text'}
          </div>
        )}
        
        {renderResizeHandles()}
      </div>
    </>
  );
};

export default TextBox;
