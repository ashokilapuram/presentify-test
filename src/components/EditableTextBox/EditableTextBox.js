import React, { useRef, useEffect, useState, useCallback } from "react";
import { Text, Transformer, Rect } from "react-konva";
import { Html } from "react-konva-utils";

const EditableTextBox = ({ element, isSelected, onSelect, onChange, readOnly = false }) => {
  const textRef = useRef();
  const backgroundRef = useRef();
  const trRef = useRef();
  const textareaRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(element.content || "");
  const [isTransforming, setIsTransforming] = useState(false);

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
    if (!isEditing) {
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

  // When you enter editing mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const ta = textareaRef.current;
      // Grab focus immediately
      ta.focus({ preventScroll: true });
      // Defer selection to next frame so browser finishes focusing first
      requestAnimationFrame(() => {
        const len = ta.value.length;
        try {
          ta.setSelectionRange(len, len);
        } catch {}
      });
    }
  }, [isEditing]);

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
      onChange({ ...element, height: newHeight });
    }
  }, [element.fontSize, element.fontWeight, element.fontStyle, element.fontFamily, value, element.width, onChange, isEditing, isTransforming]);

  const handleDblClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
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

    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    });
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
        text={value || ""}
        x={element.x}
        y={element.y}
        width={element.width}
        // let Konva compute height from text + width
        fontSize={element.fontSize}
        fontFamily={element.fontFamily || "Arial"}
        fontStyle={`${element.fontStyle === 'italic' ? 'italic ' : ''}${element.fontWeight === 'bold' ? 'bold' : 'normal'}`.trim()}
        fill={element.color}
        textDecoration={element.textDecoration || 'none'}
        align={element.textAlign}
        verticalAlign="top"
        wrap="word"
        ellipsis={false}
        lineHeight={1.05}
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
            style={{
              position: "absolute",
              top: element.y,
              left: element.x,
              width: element.width,
              minHeight: Math.ceil(textRef.current?.height?.() || element.height),
              fontSize: element.fontSize,
              fontFamily: element.fontFamily || "Arial",
              color: element.color,
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              textAlign: element.textAlign,
              border: element.borderWidth > 0 ? `${element.borderWidth}px solid ${element.borderColor || '#000000'}` : "none",
              background: element.backgroundColor || "transparent",
              outline: "none",
              resize: "none",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              lineHeight: 1.05,
              padding: "0px",
              boxSizing: "border-box",
              transform: `rotate(${element.rotation || 0}deg)`,
              transformOrigin: "top left",
            }}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onFocus={(e) => {
              const len = e.target.value.length;
              try {
                e.target.setSelectionRange(len, len);
              } catch {}
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </Html>
      )}
    </>
  );
};

export default EditableTextBox;