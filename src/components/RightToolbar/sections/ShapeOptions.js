import React, { useRef } from 'react';
import { FiDroplet, FiLayers } from 'react-icons/fi';
import { Palette, Trash2 } from 'lucide-react';
import SectionTitle from '../shared/SectionTitle';
import ModernColorPicker from '../shared/ModernColorPicker';
import LayerActions from '../shared/LayerActions';

const ShapeOptions = ({
  selectedElement,
  updateSlideElement,
  bringForward,
  bringToFront,
  sendBackward,
  sendToBack,
  updateSlide,
  currentSlide
}) => {
  const borderColorButtonRef = useRef(null);
  const fillColorButtonRef = useRef(null);

  const fillColors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
    '#f43f5e', '#06b6d4', '#84cc16', '#a855f7',
    '#f97316', '#0ea5e9', '#64748b', '#ef4444',
    '#ec4899', '#6366f1'
  ];

  const borderColors = [
    '#000000', '#6b7280', '#0ea5e9', '#8b5cf6',
    '#10b981', '#f59e0b', '#f43f5e', '#06b6d4',
    '#84cc16', '#a855f7', '#f97316', '#e5e7eb'
  ];

  // Calculate if a color is light or dark to determine icon color
  const getContrastColor = (color) => {
    if (!color || color === 'transparent' || color === 'undefined') {
      return '#374151'; // Default dark gray
    }
    
    // Convert hex to RGB
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    } else if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0]);
        g = parseInt(matches[1]);
        b = parseInt(matches[2]);
      } else {
        return '#374151';
      }
    } else {
      return '#374151';
    }
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Convert hex to rgba with opacity
  const hexToRgba = (hex, opacity = 1) => {
    if (!hex || hex === 'transparent') return `rgba(0, 0, 0, ${opacity})`;
    
    let r, g, b;
    if (hex.startsWith('#')) {
      const colorHex = hex.slice(1);
      if (colorHex.length === 3) {
        r = parseInt(colorHex[0] + colorHex[0], 16);
        g = parseInt(colorHex[1] + colorHex[1], 16);
        b = parseInt(colorHex[2] + colorHex[2], 16);
      } else {
        r = parseInt(colorHex.slice(0, 2), 16);
        g = parseInt(colorHex.slice(2, 4), 16);
        b = parseInt(colorHex.slice(4, 6), 16);
      }
    } else if (hex.startsWith('rgba')) {
      // If already rgba, extract rgb and use new opacity
      const matches = hex.match(/\d+\.?\d*/g);
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0]);
        g = parseInt(matches[1]);
        b = parseInt(matches[2]);
      } else {
        return hex;
      }
    } else if (hex.startsWith('rgb')) {
      const matches = hex.match(/\d+/g);
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0]);
        g = parseInt(matches[1]);
        b = parseInt(matches[2]);
      } else {
        return hex;
      }
    } else {
      return hex;
    }
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Get fill color with opacity applied for preview
  const getFillColorWithOpacity = () => {
    const fillColor = selectedElement.fillColor || '#3b82f6';
    const opacity = selectedElement.fillOpacity !== undefined ? selectedElement.fillOpacity : 1;
    return opacity < 1 ? hexToRgba(fillColor, opacity) : fillColor;
  };

  return (
    <div className="right-toolbar-section">
      <SectionTitle icon={<FiDroplet />} text="Fill color" />
      <div className="option-group">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          {/* Quick Colors Grid - 2 rows */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px',
            flex: 1
          }}>
            {fillColors.map((color, idx) => (
              <div
                key={idx}
                className="color-swatch-small"
                style={{
                  backgroundColor: color,
                  ...(color === '#ffffff' && { border: '1.5px solid #e5e7eb' })
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  updateSlideElement(selectedElement.id, { fillColor: color });
                }}
                title={color}
              />
            ))}
          </div>
          
          {/* Fill Color Button */}
          <div style={{ position: 'relative', width: '36px', height: '36px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <ModernColorPicker
                value={selectedElement.fillColor || '#3b82f6'}
                onColorSelect={(color) => {
                  updateSlideElement(selectedElement.id, { fillColor: color });
                }}
                defaultColor="#3b82f6"
                compact={true}
                quickColors={[]}
                buttonSize="0px"
                buttonStyle={{
                  display: 'none',
                  opacity: 0,
                  position: 'absolute',
                  pointerEvents: 'none',
                  width: 0,
                  height: 0
                }}
              />
            </div>
            <div 
              ref={fillColorButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                const mcpButton = e.currentTarget.parentElement.querySelector('.modern-color-picker > div');
                if (mcpButton) {
                  if (fillColorButtonRef.current) {
                    const rect = fillColorButtonRef.current.getBoundingClientRect();
                    mcpButton.setAttribute('data-actual-left', rect.left.toString());
                    mcpButton.setAttribute('data-actual-top', rect.top.toString());
                    mcpButton.setAttribute('data-actual-bottom', rect.bottom.toString());
                    mcpButton.setAttribute('data-actual-width', rect.width.toString());
                  }
                  mcpButton.click();
                }
              }}
              style={{
                width: '36px',
                height: '36px',
                background: getFillColorWithOpacity(),
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Pick custom color"
            >
              <Palette size={16} style={{ color: getContrastColor(selectedElement.fillColor || '#3b82f6') }} />
            </div>
          </div>
        </div>

      </div>

      <SectionTitle icon={<FiLayers />} text="Opacity" />
      <div className="option-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            onClick={(e) => e.stopPropagation()}
            min="0"
            max="100"
            value={(selectedElement.fillOpacity !== undefined ? selectedElement.fillOpacity : 1) * 100}
            onChange={(e) => {
              e.stopPropagation();
              const opacityValue = parseInt(e.target.value) / 100;
              updateSlideElement(selectedElement.id, { fillOpacity: opacityValue });
            }}
            style={{ flex: 1, cursor: 'pointer' }}
          />
          <div style={{
            minWidth: '50px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#374151',
            padding: '6px 10px',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            {Math.round((selectedElement.fillOpacity !== undefined ? selectedElement.fillOpacity : 1) * 100)}%
          </div>
        </div>
      </div>

      <SectionTitle icon={<FiDroplet />} text="Border color" />
      <div className="option-group">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          {/* Quick Colors Grid - 2 rows */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 1fr)', 
            gap: '4px',
            flex: 1
          }}>
            {borderColors.map((color, idx) => (
              <div
                key={idx}
                className="color-swatch-small"
                style={{
                  backgroundColor: color,
                  ...(color === '#ffffff' && { border: '1.5px solid #e5e7eb' })
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  updateSlideElement(selectedElement.id, { borderColor: color, borderWidth: 4 });
                }}
                title={color}
              />
            ))}
          </div>
          
          {/* Border Color Button and Delete Button */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <ModernColorPicker
                  value={selectedElement.borderColor || '#1e40af'}
                  onColorSelect={(color) => {
                    updateSlideElement(selectedElement.id, { borderColor: color, borderWidth: 4 });
                  }}
                  defaultColor="#1e40af"
                  compact={true}
                  quickColors={[]}
                  buttonSize="0px"
                  buttonStyle={{
                    display: 'none',
                    opacity: 0,
                    position: 'absolute',
                    pointerEvents: 'none',
                    width: 0,
                    height: 0
                  }}
                />
              </div>
              <div 
                ref={borderColorButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  const mcpButton = e.currentTarget.parentElement.querySelector('.modern-color-picker > div');
                  if (mcpButton) {
                    if (borderColorButtonRef.current) {
                      const rect = borderColorButtonRef.current.getBoundingClientRect();
                      mcpButton.setAttribute('data-actual-left', rect.left.toString());
                      mcpButton.setAttribute('data-actual-top', rect.top.toString());
                      mcpButton.setAttribute('data-actual-bottom', rect.bottom.toString());
                      mcpButton.setAttribute('data-actual-width', rect.width.toString());
                    }
                    mcpButton.click();
                  }
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  background: selectedElement.borderColor || '#1e40af',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Pick custom color"
              >
                <Palette size={16} style={{ color: getContrastColor(selectedElement.borderColor || '#1e40af') }} />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateSlideElement(selectedElement.id, { borderColor: undefined, borderWidth: 0 });
              }}
              style={{
                width: '36px',
                height: '36px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
              title="Remove border color"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Border width slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
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

export default ShapeOptions;

