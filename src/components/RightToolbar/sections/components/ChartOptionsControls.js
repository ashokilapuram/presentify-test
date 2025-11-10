import React from 'react';
import { Trash2 } from 'lucide-react';
import ModernColorPicker from '../../shared/ModernColorPicker';

/**
 * Component for chart options controls (labels, background, Y-axis, axis lines)
 */
const ChartOptionsControls = ({ selectedElement, updateSlideElement }) => {
  return (
    <>
      <div className="section-title">Chart Options</div>
      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* First Row: Labels and Background */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {/* Labels Color */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4,
            padding: '3px 5px',
            background: '#f9fafb',
            borderRadius: 4,
            border: '1px solid #e5e7eb'
          }}>
            <label style={{ 
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#374151',
              minWidth: '40px',
              flexShrink: 0
            }}>
              Labels
            </label>
            <ModernColorPicker
              value={selectedElement.labelsColor || '#374151'}
              onColorSelect={(color) => updateSlideElement(selectedElement.id, { labelsColor: color })}
              compact={true}
              buttonSize="18px"
              defaultColor="#374151"
            />
          </div>

          {/* Chart Background */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4,
            padding: '3px 5px',
            background: '#f9fafb',
            borderRadius: 4,
            border: '1px solid #e5e7eb'
          }}>
            <label style={{ 
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#374151',
              minWidth: '60px',
              flexShrink: 0
            }}>
              Background
            </label>
            <ModernColorPicker
              value={selectedElement.backgroundColor || 'transparent'}
              onColorSelect={(color) => updateSlideElement(selectedElement.id, { backgroundColor: color === 'transparent' ? undefined : color })}
              compact={true}
              buttonSize="18px"
              defaultColor="#ffffff"
              buttonStyle={{
                backgroundColor: selectedElement.backgroundColor || '#ffffff',
                border: selectedElement.backgroundColor ? '1px solid rgba(0, 0, 0, 0.1)' : '1px dashed #9ca3af'
              }}
            />
            {selectedElement.backgroundColor && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSlideElement(selectedElement.id, { backgroundColor: undefined });
                }}
                title="Remove background color"
                style={{
                  width: '18px',
                  height: '18px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '3px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  marginLeft: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.borderColor = '#f87171';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                }}
              >
                <Trash2 size={10} style={{ color: '#ef4444' }} />
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Y-Axis and Axis Lines (only for bar/line charts) */}
        {(selectedElement.chartType === 'bar' || selectedElement.chartType === 'line') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {/* Y-Axis Values Color */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              padding: '3px 5px',
              background: '#f9fafb',
              borderRadius: 4,
              border: '1px solid #e5e7eb'
            }}>
              <label style={{ 
                fontSize: '10px', 
                fontWeight: '600', 
                color: '#374151',
                minWidth: '40px',
                flexShrink: 0
              }}>
                Y-Axis
              </label>
              <ModernColorPicker
                value={selectedElement.yAxisColor || '#6b7280'}
                onColorSelect={(color) => updateSlideElement(selectedElement.id, { yAxisColor: color })}
                compact={true}
                buttonSize="18px"
                defaultColor="#6b7280"
              />
            </div>

            {/* Axis Lines */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              padding: '3px 5px',
              background: '#f9fafb',
              borderRadius: 4,
              border: '1px solid #e5e7eb'
            }}>
              <label style={{ 
                fontSize: '10px', 
                fontWeight: '600', 
                color: '#374151',
                minWidth: '35px',
                flexShrink: 0
              }}>
                Lines
              </label>
              <div style={{ 
                display: 'flex', 
                gap: 8,
                alignItems: 'center'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  fontSize: '10px', 
                  fontWeight: '500', 
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedElement.showXAxis || false}
                    onChange={(e) => updateSlideElement(selectedElement.id, { showXAxis: e.target.checked })}
                    style={{ 
                      margin: 0, 
                      width: '12px', 
                      height: '12px', 
                      accentColor: '#3b82f6',
                      cursor: 'pointer'
                    }}
                  />
                  X
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3, 
                  fontSize: '10px', 
                  fontWeight: '500', 
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedElement.showYAxis || false}
                    onChange={(e) => updateSlideElement(selectedElement.id, { showYAxis: e.target.checked })}
                    style={{ 
                      margin: 0, 
                      width: '12px', 
                      height: '12px', 
                      accentColor: '#3b82f6',
                      cursor: 'pointer'
                    }}
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

