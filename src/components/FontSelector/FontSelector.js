import React, { useRef, useEffect } from "react";
import "./FontSelector.css";

const fonts = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Trebuchet MS",
  "Comic Sans MS",
  "Roboto",
  "Inter",
];

const sizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 60, 80, 120, 200];

const FontSelector = ({ onFontChange, onSizeChange, currentFont, currentSize }) => {
  const savedRangeRef = useRef(null);

  // Save current text selection
  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const editor = document.querySelector('.textbox-ce:focus');
    if (editor && editor.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  // Restore last saved selection
  const restoreSelection = () => {
    const sel = window.getSelection();
    const range = savedRangeRef.current;
    if (!range) return false;
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  };

  // Apply font/size to selected text
  const applyInlineStyle = (styleObj) => {
    let sel = window.getSelection();
    let range = sel.rangeCount > 0 ? sel.getRangeAt(0) : savedRangeRef.current;

    if (!range || range.collapsed) {
      const ok = restoreSelection();
      if (!ok) return;
      sel = window.getSelection();
      range = sel.getRangeAt(0);
      if (!range || range.collapsed) return;
    }

    const span = document.createElement("span");
    Object.assign(span.style, styleObj);

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    // Move caret after the span
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();
  };

  useEffect(() => {
    const handleSelChange = () => saveSelection();
    document.addEventListener("selectionchange", handleSelChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelChange);
    };
  }, []);

  const handleFontSelect = (font) => {
    applyInlineStyle({ fontFamily: font });
    if (onFontChange) onFontChange(font);
  };

  const handleSizeSelect = (size) => {
    applyInlineStyle({ fontSize: `${size}px` });
    if (onSizeChange) onSizeChange(size);
  };

  return (
    <div className="font-selector-container">
      {/* Font Family */}
      <div className="dropdown">
        <label className="dropdown-label">Font:</label>
        <div className="dropdown-content">
          {fonts.map((font) => (
            <div
              key={font}
              className="dropdown-item"
              onClick={() => handleFontSelect(font)}
              style={{ fontFamily: font }}
            >
              {font}
            </div>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="dropdown">
        <label className="dropdown-label">Size:</label>
        <div className="dropdown-content">
          {sizes.map((size) => (
            <div
              key={size}
              className="dropdown-item"
              onClick={() => handleSizeSelect(size)}
            >
              {size}px
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontSelector;

