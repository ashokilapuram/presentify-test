import { useEffect, useCallback } from 'react';

export function useAutoResize(element, isEditing, value, textareaRef, textRef, onChange, isTransforming) {
  // Simple auto-resize textarea based on content
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.max(element.height, scrollHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [element.height, textareaRef]);

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
  }, [element.fontSize, element.fontWeight, element.fontStyle, element.fontFamily, value, element.width, onChange, isEditing, isTransforming, textRef, element.height]);

  return { autoResize };
}

