import React, { useRef, useEffect, useState, useCallback } from "react";
import { Text, Transformer, Rect } from "react-konva";
import { Html } from "react-konva-utils";

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
  const [cursorPosition, setCursorPosition] = useState(null);

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
    if (isEditing && textareaRef.current) {
      const ta = textareaRef.current;
      // Grab focus immediately
      ta.focus({ preventScroll: true });
      
      // Only set cursor to end for new textboxes, preserve position for existing text
      if (element.content === 'Click to edit text') {
        // Defer selection to next frame so browser finishes focusing first
        requestAnimationFrame(() => {
          const len = ta.value.length;
          try {
            ta.setSelectionRange(len, len);
          } catch {}
        });
      } else {
        // For existing text, restore cursor position if we have one
        if (cursorPosition !== null) {
          requestAnimationFrame(() => {
            try {
              ta.setSelectionRange(cursorPosition, cursorPosition);
            } catch {}
          });
        }
      }
    }
  }, [isEditing, element.content, cursorPosition]);

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

  const handleDblClick = (e) => {
    // Capture cursor position before entering edit mode
    if (textareaRef.current) {
      const ta = textareaRef.current;
      const pos = ta.selectionStart || 0;
      setCursorPosition(pos);
    }
    setIsEditing(true);
  };

  const handleBlur = () => {
    editingLockRef.current = false;
    setIsEditing(false);
    onChange({ ...element, content: value });
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
          e.preventDefault();
          handleBlur();
          break;
        default:
          break;
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(element.content || "");
    } else if (e.key === 'Tab') {
      // Tab key finishes editing
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter creates a new line (default behavior)
      // Don't prevent default, let the textarea handle it
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // Only Ctrl+Enter should finish editing, not regular Enter
      // Let Enter create new lines by default
      // Don't prevent default or call handleBlur
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
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
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

            // Calculate minimum height based on text content
            const calculateMinHeight = () => {
              if (!value || value.trim() === '') {
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
              const paragraphs = value.split('\n');
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

      {isEditing && (
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
            defaultValue={value} // 🧠 key difference
            onInput={(e) => {
              // Auto-resize textarea to fit content
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onFocus={(e) => {
              // Auto-resize on focus to ensure full text is visible
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onBlur={(e) => {
              let content = e.target.value;
              // Strip markers before saving to storage (content is stored without markers)
              content = stripListMarkers(content);

              onChange({ ...element, content });
              setIsEditing(false);

              // 🟢 When exited with mouse click, don't auto reselect
              // 🟢 When exited with Enter, handles are already shown (handled above)
              // So we only restore selection if user is still focused inside textbox
              requestAnimationFrame(() => {
                if (document.activeElement !== e.target && typeof onSelect === 'function') {
                  onSelect();
                  forceTransformerRefresh();
                }
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                let content = e.target.value;
                // Strip markers before saving to storage (content is stored without markers)
                content = stripListMarkers(content);

                onChange({ ...element, content });
                setIsEditing(false);

                // ✅ re-select & show handles
                requestAnimationFrame(() => {
                  if (typeof onSelect === 'function') onSelect();
                  forceTransformerRefresh();
                });
              }
            }}
            autoFocus
          />
        </Html>
      )}
    </>
  );
};

export default EditableTextBox;