import React from 'react';
import { Trash2 } from 'lucide-react';
import LayerActions from '../shared/LayerActions';

const ChartOptions = ({
  selectedElement,
  updateSlideElement,
  bringForward,
  bringToFront,
  sendBackward,
  sendToBack,
  updateSlide,
  currentSlide
}) => {
  const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];

  const getBarColor = (index) => {
    if (selectedElement.barColors && selectedElement.barColors[index]) {
      return selectedElement.barColors[index];
    }
    // Use correct defaults based on chart type
    if (selectedElement.chartType === 'line') {
      return defaultColors[index % defaultColors.length];
    } else if (selectedElement.chartType === 'bar') {
      return selectedElement.color || '#0ea5e9';
    } else {
      // pie chart
      return defaultColors[index % defaultColors.length];
    }
  };

  const handleBarColorChange = (index, color) => {
    const newBarColors = [...(selectedElement.barColors || [])];
    // Ensure the array is the right size
    while (newBarColors.length < (selectedElement.labels || []).length) {
      if (selectedElement.chartType === 'pie' || selectedElement.chartType === 'line') {
        newBarColors.push(defaultColors[newBarColors.length % defaultColors.length]);
      } else {
        newBarColors.push(selectedElement.color || '#0ea5e9');
      }
    }
    newBarColors[index] = color;
    updateSlideElement(selectedElement.id, { barColors: newBarColors });
  };

  const removeDataPoint = (index) => {
    const newLabels = [...(selectedElement.labels || [])];
    const newValues = [...(selectedElement.values || [])];
    const newBarColors = [...(selectedElement.barColors || [])];
    newLabels.splice(index, 1);
    newValues.splice(index, 1);
    newBarColors.splice(index, 1);
    updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues, barColors: newBarColors });
  };

  const addDataPoint = () => {
    const newLabels = [...(selectedElement.labels || []), `Item ${(selectedElement.labels?.length || 0) + 1}`];
    const newValues = [...(selectedElement.values || []), 0];
    
    // Also update barColors to match what ChartBox will generate
    const currentBarColors = selectedElement.barColors || [];
    const newBarColors = [...currentBarColors];
    const newIndex = newLabels.length - 1;
    
    // Determine the color for the new item based on chart type (matching ChartBox logic)
    if (selectedElement.chartType === 'line') {
      // For line charts, use diverse colors
      newBarColors.push(defaultColors[newIndex % defaultColors.length]);
    } else if (selectedElement.chartType === 'bar') {
      // For bar charts, use the single default color
      newBarColors.push(selectedElement.color || '#0ea5e9');
    } else {
      // For pie charts, use diverse colors
      newBarColors.push(defaultColors[newIndex % defaultColors.length]);
    }
    
    updateSlideElement(selectedElement.id, { labels: newLabels, values: newValues, barColors: newBarColors });
  };

  return (
    <div className="right-toolbar-section">
      <div className="section-title">Data points</div>
      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(selectedElement.labels || []).map((label, index) => {
          const value = (selectedElement.values || [])[index] ?? 0;
          return (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(50px, 60px) 20px 24px',
                gap: 4,
                alignItems: 'center',
                width: '100%',
                minWidth: 0
              }}
            >
              <input
                type="text"
                value={label}
                onChange={(e) => {
                  const newLabels = [...(selectedElement.labels || [])];
                  newLabels[index] = e.target.value;
                  updateSlideElement(selectedElement.id, { labels: newLabels });
                }}
                placeholder="Label"
                style={{
                  padding: '4px 6px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  fontSize: '12px',
                  minWidth: 0,
                  width: '100%'
                }}
              />
              <input
                type="number"
                value={value}
                min={selectedElement.chartType === 'bar' ? undefined : "0"}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  // For pie and line charts, ensure values are not negative
                  const finalValue = (selectedElement.chartType === 'pie' || selectedElement.chartType === 'line') ?
                    Math.max(0, isNaN(num) ? 0 : num) :
                    (isNaN(num) ? 0 : num);
                  const newValues = [...(selectedElement.values || [])];
                  newValues[index] = finalValue;
                  updateSlideElement(selectedElement.id, { values: newValues });
                }}
                placeholder="Value"
                style={{
                  padding: '4px 6px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  fontSize: '12px',
                  width: '100%'
                }}
              />
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <input
                  type="color"
                  value={getBarColor(index)}
                  onChange={(e) => handleBarColorChange(index, e.target.value)}
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
                />
                <div
                  className="color-swatch-small"
                  style={{
                    backgroundColor: getBarColor(index),
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDataPoint(index);
                }}
                title="Remove"
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 4,
                  border: '1px solid #ef4444',
                  background: '#fff5f5',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 24
                }}
              >
                −
              </button>
            </div>
          );
        })}

        {/* Chart Name Input, Color Button, and Add Button in a row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(50px, 60px) 20px 24px',
            gap: 4,
            alignItems: 'center',
            width: '100%',
            minWidth: 0,
            marginTop: 4
          }}
        >
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
              width: '100%',
              gridColumn: 'span 2'
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              addDataPoint();
            }}
            title="Add data point"
            style={{
              height: 24,
              width: 24,
              borderRadius: 4,
              border: '1px solid #10b981',
              background: '#d1fae5',
              color: '#059669',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 24,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a7f3d0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#d1fae5';
            }}
          >
            +
          </button>
        </div>
      </div>

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

        {/* Third Row: Chart Color (only for line charts) */}
        {selectedElement.chartType === 'line' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Chart Color */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>Chart Color</label>
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <input
                  type="color"
                  value={selectedElement.color || '#0ea5e9'}
                  onChange={(e) => updateSlideElement(selectedElement.id, { color: e.target.value })}
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
                  title="Chart line color"
                />
                <div
                  className="color-swatch-small"
                  style={{
                    backgroundColor: selectedElement.color || '#0ea5e9',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                />
              </div>
            </div>
          </div>
        )}
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

export default ChartOptions;

