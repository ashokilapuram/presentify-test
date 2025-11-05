import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Component for chart options controls (labels, background, Y-axis, axis lines)
 */
const ChartOptionsControls = ({ selectedElement, updateSlideElement }) => {
  return (
    <>
      <div className="section-title">Chart Options</div>
      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* First Row: Labels and Background */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Labels Color */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Labels</label>
            <div style={{ position: 'relative', width: '20px', height: '20px' }}>
              <input
                type="color"
                value={selectedElement.labelsColor || '#374151'}
                onChange={(e) => updateSlideElement(selectedElement.id, { labelsColor: e.target.value })}
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
                title="Labels color"
              />
              <div
                className="color-swatch-small"
                style={{
                  backgroundColor: selectedElement.labelsColor || '#374151',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              />
            </div>
          </div>

          {/* Chart Background */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Background</label>
            <div style={{ position: 'relative', width: '20px', height: '20px' }}>
              <input
                type="color"
                value={selectedElement.backgroundColor || '#ffffff'}
                onChange={(e) => updateSlideElement(selectedElement.id, { backgroundColor: e.target.value })}
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
                title="Background color"
              />
              <div
                className="color-swatch-small"
                style={{
                  backgroundColor: selectedElement.backgroundColor || 'transparent',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  border: selectedElement.backgroundColor ? 'none' : '1px dashed #9ca3af'
                }}
              />
            </div>
            {selectedElement.backgroundColor && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSlideElement(selectedElement.id, { backgroundColor: undefined });
                }}
                title="Remove background color"
                style={{
                  width: '20px',
                  height: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.borderColor = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Trash2 size={14} style={{ color: '#ef4444' }} />
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Y-Axis and Axis Lines (only for bar/line charts) */}
        {(selectedElement.chartType === 'bar' || selectedElement.chartType === 'line') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Y-Axis Values Color */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Y-Axis</label>
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <input
                  type="color"
                  value={selectedElement.yAxisColor || '#6b7280'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { yAxisColor: e.target.value })}
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
                  title="Y-Axis color"
                />
                <div
                  className="color-swatch-small"
                  style={{
                    backgroundColor: selectedElement.yAxisColor || '#6b7280',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                />
              </div>
            </div>

            {/* Axis Lines */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Lines</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={selectedElement.showXAxis || false}
                    onChange={(e) => updateSlideElement(selectedElement.id, { showXAxis: e.target.checked })}
                    style={{ margin: 0, width: '14px', height: '14px', accentColor: '#3b82f6' }}
                  />
                  X
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={selectedElement.showYAxis || false}
                    onChange={(e) => updateSlideElement(selectedElement.id, { showYAxis: e.target.checked })}
                    style={{ margin: 0, width: '14px', height: '14px', accentColor: '#3b82f6' }}
                  />
                  Y
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChartOptionsControls;

