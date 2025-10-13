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

  // Sync content
  useEffect(() => {
    if (textDivRef.current && document.activeElement !== textDivRef.current) {
      textDivRef.current.innerHTML = element.content || '';
    }
  }, [element.content]);

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

  // Handle text input
  const handleInput = useCallback(() => {
    const html = textDivRef.current.innerHTML;
    setLocalContent(html);
    onUpdate(element.id, { content: html });
  }, [element.id, onUpdate]);

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

      onUpdate(element.id, { content: el.innerHTML, [property]: value });
    },
    [element.id, onUpdate, restoreSelection]
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
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      onDragStop={(e, d) => onUpdate(element.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) =>
        onUpdate(element.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: pos.x,
          y: pos.y
        })
      }
      bounds="parent"
      disableDragging={isEditing}
      className={`textbox-container ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`}
      style={{
        background: element.backgroundColor || 'transparent',
        cursor: isEditing ? 'text' : 'move'
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
          overflow: 'hidden',
          outline: 'none',
          background: 'transparent',
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