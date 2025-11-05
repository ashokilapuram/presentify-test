import React from 'react';

/**
 * Color picker button component
 */
const ColorPickerButton = ({ 
  selectedElement, 
  textFormatting, 
  onColorChange, 
  onColorButtonClick 
}) => {
  return (
    <div className="color-button-container">
      <button 
        className="font-color-btn" 
        onClick={onColorButtonClick}
      >
        <span className="font-color-btn__label">A</span>
        <span className="font-color-btn__swatch"></span>
      </button>
      <input 
        type="color" 
        value={selectedElement?.color || textFormatting.color || '#000000'} 
        onChange={onColorChange}
        onClick={(e) => e.stopPropagation()}
        className="color-picker" 
      />
    </div>
  );
};

export default ColorPickerButton;

