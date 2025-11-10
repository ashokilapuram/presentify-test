import React, { useRef } from 'react';
import ModernColorPicker from '../../shared/ModernColorPicker';

/**
 * Component for chart name input with color picker
 */
const ChartNameInput = ({ 
  selectedElement, 
  updateSlideElement, 
  onEditDataClick 
}) => {
  const editDataButtonRef = useRef(null);
  
  const handleEditDataClick = (e) => {
    e.stopPropagation();
    if (editDataButtonRef.current && onEditDataClick) {
      const rect = editDataButtonRef.current.getBoundingClientRect();
      const modalWidth = 510; // Approximate modal width
      const modalHeight = 320; // Height for 4 rows
      const padding = 20;
      
      let x = rect.left;
      let y = rect.bottom + 8;
      
      // Ensure modal stays within viewport
      if (x + modalWidth > window.innerWidth - padding) {
        x = window.innerWidth - modalWidth - padding;
      }
      if (x < padding) {
        x = padding;
      }
      if (y + modalHeight > window.innerHeight - padding) {
        y = window.innerHeight - modalHeight - padding;
      }
      if (y < padding) {
        y = padding;
      }
      
      // Pass position to parent component
      onEditDataClick({ x, y });
    } else if (onEditDataClick) {
      onEditDataClick(null);
    }
  };
  
  return (
    <>
      <div className="section-title">Chart Name</div>
      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          width: '100%'
        }}>
          <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="text"
              placeholder="Chart Name"
              value={selectedElement.chartName || ''}
              onChange={(e) => updateSlideElement(selectedElement.id, { chartName: e.target.value })}
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                padding: '4px 6px',
                border: '1px solid #e5e7eb',
                borderRadius: 4,
                fontSize: '11px',
                outline: 'none',
                background: '#ffffff',
                transition: 'border-color 0.2s ease',
                height: '22px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000000'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <ModernColorPicker
              value={selectedElement.chartNameColor || '#111827'}
              onColorSelect={(color) => updateSlideElement(selectedElement.id, { chartNameColor: color })}
              compact={true}
              buttonSize="20px"
              defaultColor="#111827"
            />
          </div>
          {selectedElement.chartType !== 'pie' && onEditDataClick && (
            <button
              ref={editDataButtonRef}
              onClick={handleEditDataClick}
              title="Edit chart data"
              style={{
                flex: '0 0 auto',
                padding: '3px 8px',
                height: '22px',
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 4,
                fontSize: '10px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.color = '#111827';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
            >
              Edit Data
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChartNameInput;

