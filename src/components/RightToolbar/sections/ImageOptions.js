import React from 'react';
import { FiDroplet } from 'react-icons/fi';
import SectionTitle from '../shared/SectionTitle';
import QuickColorsGrid from '../shared/QuickColorsGrid';
import ColorPickerGroup from '../shared/ColorPickerGroup';
import LayerActions from '../shared/LayerActions';

const ImageOptions = ({
  selectedElement,
  updateSlideElement,
  bringForward,
  bringToFront,
  sendBackward,
  sendToBack,
  updateSlide,
  currentSlide
}) => {
  const borderColors = [
    '#000000', '#6b7280', '#0ea5e9', '#8b5cf6',
    '#10b981', '#f59e0b', '#f43f5e', '#06b6d4',
    '#84cc16', '#a855f7', '#f97316', '#e5e7eb'
  ];

  const borderTitles = [
    'Black', 'Gray', 'Sky Blue', 'Purple',
    'Emerald', 'Amber', 'Rose', 'Cyan',
    'Lime', 'Violet', 'Orange', 'Light'
  ];

  return (
    <div className="right-toolbar-section">
      <SectionTitle icon={<FiDroplet />} text="Border color" />
      <div className="option-group">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <QuickColorsGrid
            colors={borderColors}
            titles={borderTitles}
            onColorSelect={(color) => updateSlideElement(selectedElement.id, { borderColor: color, borderWidth: 4 })}
          />
          <ColorPickerGroup
            value={selectedElement.borderColor || '#e5e7eb'}
            onChange={(color) => updateSlideElement(selectedElement.id, { borderColor: color, borderWidth: 4 })}
            onReset={() => updateSlideElement(selectedElement.id, { borderColor: undefined })}
            pickerTitle="Pick custom color"
            resetTitle="Remove border color"
          />
        </div>

        {/* Border width slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            onClick={(e) => e.stopPropagation()}
            min="0"
            max="10"
            value={selectedElement.borderWidth || 0}
            onChange={(e) => {
              e.stopPropagation();
              updateSlideElement(selectedElement.id, { borderWidth: parseInt(e.target.value) });
            }}
            style={{ flex: 1 }}
          />
          <div style={{
            minWidth: '32px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#374151',
            padding: '4px 8px',
            background: '#ffffff',
            borderRadius: '4px',
            border: '1px solid #e5e7eb'
          }}>
            {selectedElement.borderWidth || 0}px
          </div>
        </div>
      </div>

      <div className="section-title">Element Actions</div>
      <div className="option-group">
        <LayerActions
          selectedElement={selectedElement}
          currentSlide={currentSlide}
          bringForward={bringForward}
          bringToFront={bringToFront}
          sendBackward={sendBackward}
          sendToBack={sendToBack}
          updateSlide={updateSlide}
        />
      </div>
    </div>
  );
};

export default ImageOptions;

