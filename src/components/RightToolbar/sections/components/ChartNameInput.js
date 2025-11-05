import React from 'react';

/**
 * Component for chart name input with color picker
 */
const ChartNameInput = ({ 
  selectedElement, 
  updateSlideElement, 
  onEditDataClick 
}) => {
  return (
    <>
      <div className="section-title">Chart Name</div>
      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px auto', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Chart Name"
            value={selectedElement.chartName || ''}
            onChange={(e) => updateSlideElement(selectedElement.id, { chartName: e.target.value })}
            style={{
              padding: '4px 6px',
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              fontSize: '12px',
              outline: 'none',
              minWidth: 0,
              width: '100%'
            }}
          />
          <div style={{ position: 'relative', width: '20px', height: '20px' }}>
            <input
              type="color"
              value={selectedElement.chartNameColor || '#111827'}
              onChange={(e) => updateSlideElement(selectedElement.id, { chartNameColor: e.target.value })}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 2
              }}
              title="Chart name color"
            />
            <div
              className="color-swatch-small"
              style={{
                backgroundColor: selectedElement.chartNameColor || '#111827',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                position: 'relative'
              }}
            />
          </div>
          {selectedElement.chartType !== 'pie' && onEditDataClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditDataClick();
              }}
              title="Edit chart data"
              style={{
                padding: '6px 12px',
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
                e.currentTarget.style.color = '#111827';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
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

