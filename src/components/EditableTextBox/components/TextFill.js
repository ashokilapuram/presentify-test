import React from 'react';
import { Text } from 'react-konva';
import { processTextForDisplay } from '../utils/textProcessing';
import { hexToRgba } from '../utils/colorUtils';

export function TextFill({
  element,
  value,
  isEditing,
  readOnly,
  onSelect,
  handleDblClick,
  handleTransform,
  handleTransformEnd,
  textRef,
  strokeRef,
  backgroundRef,
  onChange,
}) {
  const hasBackground = element.backgroundColor && element.backgroundColor !== 'transparent';
  const textOpacity = element.textOpacity !== undefined ? element.textOpacity : 1;
  const textColor = hasBackground 
    ? (textOpacity < 1 ? hexToRgba(element.color, textOpacity) : element.color)
    : (textOpacity < 1 ? hexToRgba(element.color, textOpacity) : element.color);

  const displayText = processTextForDisplay(value || "", element);

  return (
    <Text
      ref={textRef}
      text={displayText}
      x={element.x}
      y={element.y}
      width={element.width}
      // let Konva compute height from text + width
      fontSize={element.fontSize}
      fontFamily={element.fontFamily || "Arial"}
      fontStyle={`${element.fontStyle === 'italic' ? 'italic ' : ''}${element.fontWeight === 'bold' ? 'bold' : 'normal'}`.trim()}
      fill={textColor}
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
        // Sync stroke layer with main text node during drag
        if (strokeRef.current && element.strokeWidth > 0) {
          strokeRef.current.x(e.target.x());
          strokeRef.current.y(e.target.y());
          strokeRef.current.rotation(e.target.rotation());
        }
        // Update the background rectangle position and rotation in real-time during drag
        if (backgroundRef.current) {
          backgroundRef.current.x(e.target.x());
          backgroundRef.current.y(e.target.y());
          backgroundRef.current.rotation(e.target.rotation());
        }
      }}
      onDragEnd={(e) => {
        // Sync stroke layer with main text node
        if (strokeRef.current && element.strokeWidth > 0) {
          strokeRef.current.x(e.target.x());
          strokeRef.current.y(e.target.y());
          strokeRef.current.rotation(e.target.rotation());
        }
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
  );
}

