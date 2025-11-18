import React from 'react';
import { Text } from 'react-konva';
import { processTextForDisplay } from '../utils/textProcessing';

export function TextStroke({ element, value, isEditing, strokeRef }) {
  if (element.strokeWidth <= 0) {
    return null;
  }

  const displayText = processTextForDisplay(value || "", element);

  return (
    <Text
      ref={strokeRef}
      text={displayText}
      x={element.x}
      y={element.y}
      width={element.width}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily || "Arial"}
      fontStyle={`${element.fontStyle === 'italic' ? 'italic ' : ''}${element.fontWeight === 'bold' ? 'bold' : 'normal'}`.trim()}
      fill="transparent"
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
      listening={false}
      visible={!isEditing}
    />
  );
}

