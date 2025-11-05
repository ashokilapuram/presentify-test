import React from 'react';

/**
 * Component for bar and line chart color palettes
 */
const BarLineColorPalettes = ({ selectedElement, updateSlideElement }) => {
  const colorfulPalettes = [
    ['#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4'],
    ['#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'],
    ['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'],
    ['#f59e0b', '#f43f5e', '#10b981', '#0ea5e9', '#8b5cf6', '#84cc16']
  ];

  const monochromePalettes = [
    { base: '#8b5cf6', shades: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'] },
    { base: '#10b981', shades: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] },
    { base: '#f59e0b', shades: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'] },
    { base: '#f43f5e', shades: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'] },
    { base: '#06b6d4', shades: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'] },
    { base: '#000000', shades: ['#000000', '#1f2937', '#374151', '#6b7280', '#9ca3af'] }
  ];

  const applyPalette = (palette, isMonochrome = false) => {
    if (selectedElement.series && Array.isArray(selectedElement.series)) {
      // New format: update each series with colors from palette
      const updatedSeries = selectedElement.series.map((series, seriesIndex) => {
        if (selectedElement.chartType === 'line') {
          // For line charts: one color per series (line color)
          const colors = isMonochrome ? palette.shades : palette;
          return {
            ...series,
            barColors: (series.values || []).map(() => colors[seriesIndex % colors.length])
          };
        } else {
          // For bar charts: one color per series (first element in barColors array)
          const colors = isMonochrome ? palette.shades : palette;
          return {
            ...series,
            barColors: [colors[seriesIndex % colors.length]]
          };
        }
      });
      updateSlideElement(selectedElement.id, { series: updatedSeries });
    } else {
      // Old format: apply to barColors array
      const labels = selectedElement.labels || [];
      const colors = isMonochrome ? palette.shades : palette;
      const newBarColors = labels.map((_, i) => colors[i % colors.length]);
      updateSlideElement(selectedElement.id, { barColors: newBarColors });
    }
  };

  return (
    <>
      <div className="section-title">Colour</div>
      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Colourful Palettes */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: 8 }}>Colourful</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {colorfulPalettes.map((palette, paletteIndex) => (
              <div
                key={`colorful-${paletteIndex}`}
                onClick={() => applyPalette(palette, false)}
                className="color-palette-item"
                style={{
                  display: 'flex',
                  gap: 2,
                  cursor: 'pointer',
                  padding: '3px',
                  borderRadius: 4,
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease',
                  flex: '0 0 calc(50% - 3px)',
                  minWidth: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {palette.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="color-swatch-palette"
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: color,
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Monochromatic Palettes */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: 8 }}>Monochromatic</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {monochromePalettes.map((palette, paletteIndex) => (
              <div
                key={`mono-${paletteIndex}`}
                onClick={() => applyPalette(palette, true)}
                className="color-palette-item"
                style={{
                  display: 'flex',
                  gap: 2,
                  cursor: 'pointer',
                  padding: '3px',
                  borderRadius: 4,
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease',
                  flex: '0 0 calc(50% - 3px)',
                  minWidth: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {palette.shades.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="color-swatch-palette"
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: color,
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BarLineColorPalettes;

