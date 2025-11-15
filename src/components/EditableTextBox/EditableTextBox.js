import React, { useRef, useEffect, useState, useCallback } from "react";
import { Text, Transformer, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import Konva from "konva";

// Utility function to normalize list text - removes all existing markers before applying new ones
function normalizeListText(text, newType) {
  const lines = text.split('\n');
  
  // First, check if text already has the correct markers for bullets
  if (newType === 'bullet') {
    const alreadyFormatted = lines.every(line => {
      if (!line.trim()) return true; // empty line is fine
      return line.match(/^[\u2022•]\s*/);
    });
    if (alreadyFormatted) {
      return text; // Already properly formatted
    }
  }
  
  // For numbers, check if all lines are numbered (but we'll still renumber to fix sequences)
  // Remove any existing markers (bullet •, number 1., or any combination)
  const cleanedLines = lines
    .map(line => line.replace(/^(\s*[\u2022•]\s*|\s*\d+\.\s*)/, ''));

  if (newType === 'bullet') {
    return cleanedLines
      .map(line => (line.trim() ? `• ${line}` : line))
      .join('\n');
  }
  if (newType === 'number') {
    return cleanedLines
      .map((line, idx) => {
        if (line.trim()) {
          return `${idx + 1}. ${line}`;
        }
        return line;
      })
      .join('\n');
  }
  return cleanedLines.join('\n'); // for 'none'
}

// Utility function to strip all list markers from text (used when saving raw content)
function stripListMarkers(text) {
  const lines = text.split('\n');
  return lines
    .map(line => line.replace(/^(\s*[\u2022•]\s*|\s*\d+\.\s*)/, ''))
    .join('\n');
}

const EditableTextBox = ({ element, isSelected, onSelect, onChange, readOnly = false }) => {
  const textRef = useRef();
  const backgroundRef = useRef();
  const trRef = useRef();
  const textareaRef = useRef();
  const editingLockRef = useRef(false);
  const lastFormattedListTypeRef = useRef(null);
  const originalYPositionRef = useRef(null);
  const originalRotationRef = useRef(null);
  const canvasReadyRef = useRef(false);
  const animationRef = useRef(null);

  // Force Transformer to refresh after selection re-apply
  const forceTransformerRefresh = useCallback(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      const layer = trRef.current.getLayer();
      if (layer) layer.batchDraw();
    }
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(element.content || "");
  const [isTransforming, setIsTransforming] = useState(false);
  const userHasInteractedRef = useRef(false);
  // Removed cursorPosition state as it was complex and likely caused the bug

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Force re-render when font properties change
  useEffect(() => {
    if (textRef.current && textRef.current.getLayer()) {
      textRef.current.getLayer().batchDraw();
    }
  }, [element.fontWeight, element.fontStyle, element.fontSize, element.fontFamily]);

  // If formatting/appearance changes while this element is selected (for example
  // via a toolbar that updates fontWeight/color/size), ensure the Transformer
  // is re-attached and redrawn so resize handles remain visible. We don't
  // depend on isSelected toggling here because formatting updates often happen
  // while selection is already true.
  useEffect(() => {
    if (isSelected && !isEditing) {
      try {
        forceTransformerRefresh();
      } catch (err) {
        console.error('Error refreshing transformer after formatting change:', err);
      }
    }
    // Intentionally include commonly changed element appearance props
  }, [
    isSelected,
    isEditing,
    element.fontWeight,
    element.fontStyle,
    element.fontSize,
    element.fontFamily,
    element.color,
    element.width,
    element.height,
    element.textAlign,
    element.rotation,
    element.strokeWidth,
    element.strokeColor,
    element.letterSpacing,
    element.lineHeight,
  ]);

  // Handle text animation in slideshow mode
  useEffect(() => {
    if (!readOnly || !textRef.current) return;

    // Ensure cleanup of previous animation
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Wait for canvas to be ready
    const layer = textRef.current.getLayer();
    if (!layer) return;

    layer.draw(); // Force initial draw
    canvasReadyRef.current = true;

    // Initial position (50px below target position)
    const targetY = element.y;
    textRef.current.y(targetY + 50);
    // Only animate background if it exists
    if (backgroundRef.current && (element.backgroundColor || element.borderWidth > 0)) {
      backgroundRef.current.y(targetY + 50);
    }

    // Create and start the animation
    animationRef.current = new Konva.Animation((frame) => {
      if (!frame) return;

      const progress = Math.min(1, frame.time / 500); // 500ms duration
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth easing
      const currentY = targetY + 50 * (1 - ease);

      textRef.current.y(currentY);
      // Only animate background if it exists and is visible
      if (backgroundRef.current && (element.backgroundColor || element.borderWidth > 0)) {
        backgroundRef.current.y(currentY);
      }

      if (progress >= 1) {
        animationRef.current.stop();
      }
    }, layer);

    animationRef.current.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      // Reset position on cleanup
      if (textRef.current) {
        textRef.current.y(targetY);
      }
      // Only reset background if it exists and is visible
      if (backgroundRef.current && (element.backgroundColor || element.borderWidth > 0)) {
        backgroundRef.current.y(targetY);
      }
    };
  }, [readOnly, element.y]);

  // Keep value synced with slide element, but NOT while editing
  useEffect(() => {
    // Prevent overwriting user's typing
    if (editingLockRef.current) return;

    if (!isEditing && value !== element.content) {
      setValue(element.content || "");
    }
  }, [element.content, isEditing]);

  // Auto-start editing for new textboxes
  useEffect(() => {
    if (element.content === 'Click to edit text' && isSelected) {
      setIsEditing(true);
      // don't force setValue(''); keep existing content so caret logic stays stable
    }
  }, [element.content, isSelected]);

  // When you enter editing mode - format content to show bullets/numbers matching display
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const currentListType = element.listType || 'none';
      // Format when entering edit mode or when listType changes during editing
      if (lastFormattedListTypeRef.current !== currentListType) {
        // Format the current value to show bullets/numbers in edit mode to match display
        const formattedValue = normalizeListText(value || element.content || "", currentListType);
        
        // Update textarea directly to show formatted content (only if different)
        // Use requestAnimationFrame to ensure this happens after initial render and cursor positioning
        requestAnimationFrame(() => {
          if (textareaRef.current && formattedValue !== textareaRef.current.value) {
            textareaRef.current.value = formattedValue;
            lastFormattedListTypeRef.current = currentListType;
          }
        });
      }
    } else if (!isEditing) {
      // Reset tracking when exiting edit mode
      lastFormattedListTypeRef.current = null;
    }
  }, [isEditing, element.listType]);

  // When you enter editing mode - handle focus and cursor
  useEffect(() => {
    if (isEditing && textareaRef.current && !userHasInteractedRef.current) {
      const ta = textareaRef.current;
      
      // Only set cursor to end if user hasn't interacted yet (i.e., just entered edit mode)
      const setCursorToEnd = () => {
        if (userHasInteractedRef.current) return; // Don't force if user has interacted
        const len = ta.value.length;
        try {
          // Set selection range to the end to force cursor position
          ta.setSelectionRange(len, len);
        } catch (e) {
          // In case setSelectionRange fails in some environments
          console.error("Failed to set selection range:", e);
        }
      };
      
      // Set cursor position first, then focus
      setCursorToEnd();
      ta.focus({ preventScroll: true });
      
      // Try again after focus to ensure it sticks (but only if user hasn't interacted)
      requestAnimationFrame(() => {
        if (!userHasInteractedRef.current) {
          setCursorToEnd();
          // Try multiple times to override browser default behavior
          setTimeout(() => {
            if (!userHasInteractedRef.current) {
              setCursorToEnd();
              setTimeout(() => {
                if (!userHasInteractedRef.current) {
                  setCursorToEnd();
                }
              }, 20);
            }
          }, 10);
        }
      });
    }
  }, [isEditing]); // Only dependent on isEditing

  // Simple auto-resize textarea based on content
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.max(element.height, scrollHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [element.height]);

  // Auto-resize when value changes (only when editing)
  useEffect(() => {
    if (isEditing) {
      autoResize();
    }
  }, [value, isEditing, autoResize]);

  // Auto-resize when font properties change (when not editing): mirror Konva height
  useEffect(() => {
    if (isEditing || isTransforming) return;
    if (!textRef.current) return;

    if (textRef.current.getLayer()) textRef.current.getLayer().batchDraw();
    const newHeight = Math.ceil(textRef.current.height());

    if (Math.abs(newHeight - element.height) > 2) {
      onChange({ height: newHeight, __internal: 'autoHeight' });
    }
  }, [element.fontSize, element.fontWeight, element.fontStyle, element.fontFamily, value, element.width, onChange, isEditing, isTransforming]);

  const handleBlur = () => {
    // Strip markers before saving
    const contentToSave = stripListMarkers(textareaRef.current?.value || value);
    // Update local value state immediately to prevent flicker when switching from textarea to Text
    setValue(contentToSave);
    // Set editing lock to prevent value sync effect from overwriting during transition
    editingLockRef.current = true;
    setIsEditing(false);
    // Reset user interaction flag when exiting edit mode
    userHasInteractedRef.current = false;
    onChange({ ...element, content: contentToSave });
    // Release lock after a brief delay to allow parent update to complete
    setTimeout(() => {
      editingLockRef.current = false;
    }, 0);
  };
  
  const handleDblClick = (e) => {
    // Don't allow editing in read-only mode (e.g., slideshow)
    if (readOnly) {
      e.cancelBubble = true;
      if (e.evt) {
        e.evt.stopPropagation();
      }
      return;
    }
    // Prevent default double-click text selection
    if (e.evt) {
      e.evt.preventDefault();
    }
    // Reset user interaction flag when entering edit mode via double-click
    userHasInteractedRef.current = false;
    // This is the core fix: simply set the state
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts like PowerPoint
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          onChange({ ...element, fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' });
          break;
        case 'i':
          e.preventDefault();
          onChange({ ...element, fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' });
          break;
        case 'u':
          e.preventDefault();
          onChange({ ...element, textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' });
          break;
        case 'Enter':
          // Ctrl/Meta + Enter finishes editing
          e.preventDefault();
          handleBlur();
          break;
        default:
          break;
      }
    } else if (e.key === 'Escape') {
      // Escape reverts to original content and exits
      setIsEditing(false);
      setValue(element.content || "");
    } else if (e.key === 'Tab') {
      // Tab key finishes editing
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      // Handle Enter key for bullets/numbers
      const listType = element.listType || 'none';
      if (listType === 'bullet' || listType === 'number') {
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        // Get the current line
        const textBeforeCursor = text.substring(0, start);
        const textAfterCursor = text.substring(end);
        const lines = textBeforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];
        
        // Check if current line has a bullet or number
        const hasBullet = /^[\u2022•]\s*/.test(currentLine);
        const hasNumber = /^\d+\.\s*/.test(currentLine);
        
        // If current line has a marker, add one to the new line
        if ((listType === 'bullet' && hasBullet) || (listType === 'number' && hasNumber)) {
          e.preventDefault();
          
          // Find where the current line starts in the full text
          const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
          const lineStartIndex = lastNewlineIndex + 1;
          
          // Get the marker from current line
          let markerLength = 0;
          if (listType === 'bullet') {
            const bulletMatch = currentLine.match(/^[\u2022•]\s*/);
            markerLength = bulletMatch ? bulletMatch[0].length : 0;
          } else {
            const numberMatch = currentLine.match(/^\d+\.\s*/);
            markerLength = numberMatch ? numberMatch[0].length : 0;
          }
          
          // Calculate position within line content (excluding marker)
          const positionInLine = start - lineStartIndex;
          const positionInContent = Math.max(0, positionInLine - markerLength);
          
          // Get line content without marker
          const lineContent = currentLine.substring(markerLength);
          const contentBeforeCursor = lineContent.substring(0, positionInContent);
          const contentAfterCursor = lineContent.substring(positionInContent);
          
          // Build new text
          const previousLines = lines.slice(0, -1);
          const prefix = previousLines.length > 0 ? previousLines.join('\n') + '\n' : '';
          let newText;
          let newCursorPos;
          
          if (listType === 'bullet') {
            // Build text with bullet on new line
            newText = prefix + '• ' + contentBeforeCursor + '\n• ' + contentAfterCursor + textAfterCursor;
            // Cursor position: after the new bullet and space
            newCursorPos = prefix.length + '• '.length + contentBeforeCursor.length + '\n• '.length;
          } else if (listType === 'number') {
            // Get current number and calculate next
            const numberMatch = currentLine.match(/^(\d+)\.\s*/);
            const currentNumber = numberMatch ? parseInt(numberMatch[1]) : lines.length;
            const nextNumber = currentNumber + 1;
            
            const numberPrefix = currentNumber + '. ';
            const nextNumberPrefix = nextNumber + '. ';
            newText = prefix + numberPrefix + contentBeforeCursor + '\n' + nextNumberPrefix + contentAfterCursor + textAfterCursor;
            // Cursor position: after the new number and space
            newCursorPos = prefix.length + numberPrefix.length + contentBeforeCursor.length + '\n'.length + nextNumberPrefix.length;
          }
          
          // Update textarea value
          textarea.value = newText;
          setValue(newText);
          
          // Set cursor position after the new bullet/number
          setTimeout(() => {
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }
        // If no marker, allow default behavior (just newline)
      }
      // If listType is 'none', allow default behavior (just newline)
    }
  };

  const handleTransform = (e) => {
    setIsTransforming(true);
    const node = textRef.current;
    const scaleX = node.scaleX();
    
    // Store original y position and rotation on first transform (to preserve position when stroke is present)
    if (originalYPositionRef.current === null) {
      originalYPositionRef.current = node.y();
      originalRotationRef.current = node.rotation();
    }
    
    // Check if rotation has changed (user is rotating, not just resizing)
    const rotationChanged = Math.abs(node.rotation() - originalRotationRef.current) > 0.01;
    
    // Calculate minimum width based on 2 characters
    const calculateMinWidth = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const fontStyle = element.fontStyle || 'normal';
      const fontWeight = element.fontWeight || 'normal';
      const fontFamily = element.fontFamily || 'Arial';
      const fontSize = element.fontSize || 16;
      
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      
      // Measure width of 2 characters (using 'MM' as a reasonable approximation)
      const twoCharWidth = ctx.measureText('MM').width;
      return Math.max(40, twoCharWidth + 10); // Add some padding
    };
    
    const minWidth = calculateMinWidth();
    const newWidth = Math.max(minWidth, node.width() * scaleX);
    
    // Update the text dimensions in real-time during resize
    // Reset scale to prevent font size changes
    node.scaleX(1);
    node.scaleY(1);
    node.width(newWidth);
    
    // Preserve original y position when stroke is present AND user is only resizing (not rotating)
    // Rotation needs to allow y to change naturally
    if (originalYPositionRef.current !== null && element.strokeWidth > 0 && !rotationChanged) {
      node.y(originalYPositionRef.current);
    }
    
    // Mirror Konva measured height after width change
    if (node.getLayer()) node.getLayer().batchDraw();
    const newHeight = Math.ceil(node.height());
    
    // Also update the background rectangle to match
    if (backgroundRef.current) {
      backgroundRef.current.width(newWidth);
      backgroundRef.current.height(newHeight);
      backgroundRef.current.x(node.x());
      backgroundRef.current.y(node.y());
      backgroundRef.current.rotation(node.rotation());
    }
  };

  const handleTransformEnd = (e) => {
    const node = textRef.current;
    
    // Always reset scale to prevent font size changes
    node.scaleX(1);
    node.scaleY(1);
    
    // Check if rotation changed during transform
    const rotationChanged = originalRotationRef.current !== null && 
      Math.abs(node.rotation() - originalRotationRef.current) > 0.01;
    
    // Preserve original y position when stroke is present AND user only resized (not rotated)
    // Rotation needs to allow y to change naturally
    if (originalYPositionRef.current !== null && element.strokeWidth > 0 && !rotationChanged) {
      node.y(originalYPositionRef.current);
    }
    
    // Set transforming to false after a short delay to allow the height to be set
    setTimeout(() => {
      setIsTransforming(false);
    }, 100);

    // Get the final width
    const newWidth = node.width();
    
    // Mirror Konva measured height based on the final width
    if (node.getLayer()) node.getLayer().batchDraw();
    const newHeight = Math.ceil(node.height());

    // Also update the background rectangle to match the final state
    if (backgroundRef.current) {
      backgroundRef.current.width(newWidth);
      backgroundRef.current.height(newHeight);
      backgroundRef.current.x(node.x());
      backgroundRef.current.y(node.y());
      backgroundRef.current.rotation(node.rotation());
    }

    // Use preserved y position if stroke is present and no rotation occurred, otherwise use current position
    const finalY = (originalYPositionRef.current !== null && element.strokeWidth > 0 && !rotationChanged) 
      ? originalYPositionRef.current 
      : node.y();

    onChange({
      ...element,
      x: node.x(),
      y: finalY,
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    });
    
    // Reset the stored positions after transform ends
    originalYPositionRef.current = null;
    originalRotationRef.current = null;
  };

  return (
    <>
      {/* Background rectangle for background color */}
      {(element.backgroundColor || element.borderWidth > 0) && (
        <Rect
          ref={backgroundRef}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          fill={element.backgroundColor || 'transparent'}
          stroke={element.borderColor || 'transparent'}
          strokeWidth={element.borderWidth || 0}
          rotation={element.rotation || 0}
          visible={!isEditing}
        />
      )}
      
      <Text
        ref={textRef}
        text={(() => {
          let text = value || "";

          // Apply case transform
          const transform = element.textTransform || 'none';
          if (transform === 'uppercase') text = text.toUpperCase();
          else if (transform === 'lowercase') text = text.toLowerCase();

          // Apply list prefixes using normalization (removes all old markers first)
          if (element.listType === 'bullet' || element.listType === 'number' || element.listType === 'none') {
            text = normalizeListText(text, element.listType || 'none');
          }

          return text;
        })()}
        x={element.x}
        y={element.y}
        width={element.width}
        // let Konva compute height from text + width
        fontSize={element.fontSize}
        fontFamily={element.fontFamily || "Arial"}
        fontStyle={`${element.fontStyle === 'italic' ? 'italic ' : ''}${element.fontWeight === 'bold' ? 'bold' : 'normal'}`.trim()}
        fill={element.color}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth || 0}
        textDecoration={element.textDecoration || 'none'}
        align={element.textAlign}
        verticalAlign="top"
        wrap="word"
        ellipsis={false}
        letterSpacing={element.letterSpacing || 0}
        lineHeight={element.lineHeight || 1.2}
        rotation={element.rotation || 0}
        draggable={!readOnly}
        listening={!readOnly}
        onClick={readOnly ? undefined : onSelect}
        onTap={readOnly ? undefined : onSelect}
        onDblClick={readOnly ? undefined : handleDblClick}
        onDblTap={readOnly ? undefined : handleDblClick}
        onDragMove={(e) => {
          // Update the background rectangle position and rotation in real-time during drag
          if (backgroundRef.current) {
            backgroundRef.current.x(e.target.x());
            backgroundRef.current.y(e.target.y());
            backgroundRef.current.rotation(e.target.rotation());
          }
        }}
        onDragEnd={(e) => {
          // Also update the background rectangle position and rotation
          if (backgroundRef.current) {
            backgroundRef.current.x(e.target.x());
            backgroundRef.current.y(e.target.y());
            backgroundRef.current.rotation(e.target.rotation());
          }
          onChange({ ...element, x: e.target.x(), y: e.target.y(), rotation: e.target.rotation() });
        }}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        visible={!isEditing}
      />

      {isSelected && !isEditing && !readOnly && (
        <Transformer
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            // Calculate minimum width based on 2 characters
            const calculateMinWidth = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              const fontStyle = element.fontStyle || 'normal';
              const fontWeight = element.fontWeight || 'normal';
              const fontFamily = element.fontFamily || 'Arial';
              const fontSize = element.fontSize || 16;
              
              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
              
              // Measure width of 2 characters (using 'MM' as a reasonable approximation)
              const twoCharWidth = ctx.measureText('MM').width;
              return Math.max(40, twoCharWidth + 10); // Add some padding
            };

            // Calculate minimum height based on Konva's displayed text content
            const calculateMinHeight = () => {
              const currentText = textRef.current?.text() || '';
              if (!currentText || currentText.trim() === '') {
                return 20; // Default minimum
              }
              
              // Create a temporary canvas to measure text height
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Set font properties to match the text
              const fontStyle = element.fontStyle || 'normal';
              const fontWeight = element.fontWeight || 'normal';
              const fontFamily = element.fontFamily || 'Arial';
              const fontSize = element.fontSize || 16;
              
              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
              
              // Handle line breaks first
              const paragraphs = currentText.split('\n');
              let totalLines = 0;
              
              for (const paragraph of paragraphs) {
                if (paragraph.trim() === '') {
                  totalLines += 1; // Empty line
                  continue;
                }
                
                const words = paragraph.split(' ');
                const lines = [];
                let currentLine = '';
                
                for (let i = 0; i < words.length; i++) {
                  const word = words[i];
                  const testLine = currentLine + (currentLine ? ' ' : '') + word;
                  const metrics = ctx.measureText(testLine);
                  const testWidth = metrics.width;
                  
                  if (testWidth > newBox.width) {
                    // If current line has content, save it and start new line
                    if (currentLine !== '') {
                      lines.push(currentLine);
                      currentLine = '';
                    }
                    
                    // Now handle the word - if it's still too long, break it character by character
                    if (currentLine === '') {
                      let charIndex = 0;
                      while (charIndex < word.length) {
                        let charLine = '';
                        while (charIndex < word.length) {
                          const testChar = charLine + word[charIndex];
                          const charMetrics = ctx.measureText(testChar);
                          if (charMetrics.width > newBox.width && charLine !== '') {
                            break;
                          }
                          charLine = testChar;
                          charIndex++;
                        }
                        if (charLine) {
                          lines.push(charLine);
                        }
                      }
                    } else {
                      // If we have space on current line, add the word
                      currentLine = word;
                    }
                  } else {
                    // Word fits, add it to current line
                    currentLine = testLine;
                  }
                }
                
                if (currentLine) {
                  lines.push(currentLine);
                }
                
                totalLines += lines.length;
              }
              
              const lineHeight = fontSize * 1.2; // Slightly more spacing for better text wrapping
              const padding = totalLines === 1 ? 2 : 4; // Less padding for single line, normal for multi-line
              return Math.max(12, totalLines * lineHeight + padding);
            };

            const minWidth = calculateMinWidth();
            const minHeight = calculateMinHeight();
            
            return {
              ...newBox,
              width: Math.max(minWidth, newBox.width),
              height: Math.max(minHeight, newBox.height),
            };
          }}
          keepRatio={false}
        />
      )}

      {isEditing && !readOnly && (
        <Html>
          <textarea
            ref={textareaRef}
            className="editable-textbox-textarea"
            style={{
              position: "absolute",
              top: element.y,
              left: element.x,
              width: element.width,
              minHeight: Math.max(100, Math.ceil(textRef.current?.height?.() || element.height)),
              fontSize: element.fontSize,
              fontFamily: element.fontFamily || "Arial",
              color: element.color,
              fontWeight: element.fontWeight || "normal",
              fontStyle: element.fontStyle || "normal",
              textDecoration: element.textDecoration || "none",
              textAlign: element.textAlign,
              border: element.borderWidth > 0
                ? `${element.borderWidth}px solid ${element.borderColor || "#000000"}`
                : "none !important",
              borderWidth: element.borderWidth > 0 ? `${element.borderWidth}px` : "0px !important",
              borderStyle: element.borderWidth > 0 ? "solid" : "none !important",
              borderColor: element.borderWidth > 0 ? (element.borderColor || "#000000") : "transparent !important",
              background: element.backgroundColor || "transparent",
              outline: "none",
              resize: "none",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
              lineHeight: element.lineHeight || 1.2,
              textTransform: element.textTransform || 'none',
              padding: "0px",
              margin: "0px",
              boxSizing: "border-box",
              transform: `rotate(${element.rotation || 0}deg)`,
              transformOrigin: "top left",
            }}
            defaultValue={normalizeListText(value || element.content || "", element.listType || 'none')}
            onInput={(e) => {
              // Mark that user has interacted
              userHasInteractedRef.current = true;
              
              // Auto-apply bullets/numbers if listType is set but current line doesn't have marker
              const listType = element.listType || 'none';
              if (listType === 'bullet' || listType === 'number') {
                const textarea = e.target;
                const cursorPos = textarea.selectionStart;
                const textBeforeCursor = textarea.value.substring(0, cursorPos);
                const lines = textBeforeCursor.split('\n');
                const currentLine = lines[lines.length - 1];
                
                // Check if current line has a marker
                const hasBullet = /^[\u2022•]\s*/.test(currentLine);
                const hasNumber = /^\d+\.\s*/.test(currentLine);
                
                // If no marker but listType is set and line has content (user started typing), add it
                // Only add if the line doesn't already have a marker and has some non-whitespace content
                const lineHasContent = currentLine.trim().length > 0;
                if (lineHasContent && 
                    ((listType === 'bullet' && !hasBullet) || 
                     (listType === 'number' && !hasNumber))) {
                  const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
                  const lineStartIndex = lastNewlineIndex + 1;
                  const lineContent = currentLine;
                  const textAfterCursor = textarea.value.substring(cursorPos);
                  
                  let newText;
                  let newCursorPos;
                  
                  if (listType === 'bullet') {
                    newText = textarea.value.substring(0, lineStartIndex) + '• ' + lineContent + textAfterCursor;
                    newCursorPos = cursorPos + 2; // +2 for '• '
                  } else if (listType === 'number') {
                    // Count existing numbered lines to get the next number
                    const allLines = textarea.value.split('\n');
                    let lineNumber = 1;
                    for (let i = 0; i < lines.length - 1; i++) {
                      const numMatch = allLines[i]?.match(/^(\d+)\.\s*/);
                      if (numMatch) {
                        lineNumber = Math.max(lineNumber, parseInt(numMatch[1]) + 1);
                      }
                    }
                    newText = textarea.value.substring(0, lineStartIndex) + lineNumber + '. ' + lineContent + textAfterCursor;
                    newCursorPos = cursorPos + (lineNumber + '. ').length;
                  }
                  
                  textarea.value = newText;
                  setValue(newText);
                  setTimeout(() => {
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                  }, 0);
                  return; // Don't continue with normal input handling
                }
              }
              
              // Auto-resize textarea to fit content
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
              // Update state value on input to trigger autoResize effect on value change
              setValue(e.target.value);
            }}
            onFocus={(e) => {
              // Auto-resize on focus to ensure full text is visible
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
              
              // Only force cursor to end if user hasn't interacted yet (initial focus from double-click)
              if (!userHasInteractedRef.current) {
                const setCursorToEnd = () => {
                  if (userHasInteractedRef.current) return; // Don't force if user has interacted
                  const len = e.target.value.length;
                  try {
                    e.target.setSelectionRange(len, len);
                  } catch (err) {
                    // Ignore errors
                  }
                };
                
                // Set immediately
                setCursorToEnd();
                
                // Set again after a small delay to override browser default
                setTimeout(() => {
                  if (!userHasInteractedRef.current) {
                    setCursorToEnd();
                    setTimeout(() => {
                      if (!userHasInteractedRef.current) {
                        setCursorToEnd();
                      }
                    }, 10);
                  }
                }, 0);
              }
            }}
            onBlur={(e) => {
              // Centralized blur handler saves content and exits edit mode
              handleBlur();

              // After the textarea is removed and state updates, ensure selection
              // and transformer attachment happen. We don't rely on the stale
              // `isEditing` closure value here — always re-select and refresh
              // the transformer on the next frame.
              requestAnimationFrame(() => {
                if (typeof onSelect === 'function') {
                  try {
                    onSelect();
                  } catch (err) {
                    // swallow errors from parent handlers
                    console.error('onSelect handler failed after blur:', err);
                  }
                }

                // Force the transformer to re-attach and redraw so handles become visible
                try {
                  forceTransformerRefresh();
                } catch (err) {
                  console.error('forceTransformerRefresh failed after blur:', err);
                }
              });
            }}
            onMouseDown={(e) => {
              // Mark that user has interacted when they click
              userHasInteractedRef.current = true;
            }}
            onKeyDown={(e) => {
              // Mark that user has interacted when they type or use arrow keys
              if (e.key.length === 1 || e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End') {
                userHasInteractedRef.current = true;
              }
              handleKeyDown(e);
            }}
            autoFocus
          />
        </Html>
      )}
    </>
  );
};

export default EditableTextBox;