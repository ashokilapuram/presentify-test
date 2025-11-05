import React from 'react';
import { Line, Text } from 'react-konva';
import * as d3 from 'd3';

/**
 * Renders Y-axis labels (no lines)
 */
export const YAxisValues = ({ 
  yScale, 
  hasNegativeValues, 
  minVal, 
  maxVal,
  yAxisColor 
}) => {
  const tickCount = 4;
  const domain = hasNegativeValues ? [minVal, maxVal] : [0, maxVal];
  const ticks = d3.ticks(domain[0], domain[1], tickCount);
  
  return ticks.map((t, i) => (
    <Text
      key={i}
      text={t.toFixed(0)}
      x={4}
      y={yScale(t) - 6}
      fontSize={10}
      fill={yAxisColor || "#6b7280"}
    />
  ));
};

/**
 * Renders X-axis labels with rotation and truncation support
 */
export const XAxisLabels = ({ 
  labels, 
  xScale, 
  chartH, 
  padding,
  labelsColor 
}) => {
  if (!labels || labels.length === 0) return null;
  
  // Calculate if labels need rotation (for legend positioning)
  const bandWidth = labels.length > 0 ? xScale.bandwidth() : 40;
  const minWidthForHorizontal = 40; // Minimum width needed for horizontal labels
  const minWidthForRotation = 25; // Below this, rotate labels
  const needsLabelRotation = bandWidth < minWidthForRotation;
  const useTruncation = !needsLabelRotation && bandWidth < minWidthForHorizontal;
  
  // Estimate if labels will wrap to multiple lines
  const labelFontSize = 12;
  const estimateTextWidth = (text) => {
    // Rough estimate: average character width is about 0.6 * fontSize for most fonts
    return text.length * labelFontSize * 0.6;
  };
  
  const hasMultiLineLabels = labels.some(label => {
    if (needsLabelRotation || useTruncation) return false; // Rotated or truncated labels don't wrap
    const estimatedWidth = estimateTextWidth(label);
    return estimatedWidth > bandWidth;
  });
  
  // Calculate label Y position - adjust if rotated or multi-line to avoid overlap
  const baseLabelY = chartH - padding + 8;
  const rotatedLabelY = baseLabelY + (needsLabelRotation ? 20 : 0); // Extra space for rotated labels
  const multiLineLabelY = rotatedLabelY + (hasMultiLineLabels && !needsLabelRotation ? 0 : 0); // Keep same Y, but allow wrapping
  
  return labels.map((label, i) => {
    // Center label perfectly under the bar band
    const labelX = xScale(label) + xScale.bandwidth() / 2;
    let displayText = label;
    
    // Truncate text if needed (but don't truncate if we want to allow wrapping)
    if (useTruncation && label.length > 0 && !hasMultiLineLabels) {
      const maxChars = Math.floor(bandWidth / 6); // Rough estimate: 6px per character
      if (label.length > maxChars && maxChars > 3) {
        displayText = label.substring(0, maxChars - 3) + '...';
      }
    }
    
    return (
      <Text
        key={i}
        text={displayText}
        x={labelX}
        y={multiLineLabelY}
        fontSize={labelFontSize}
        fill={labelsColor || "#374151"}
        rotation={needsLabelRotation ? -90 : 0}
        align="center"
        verticalAlign={needsLabelRotation ? "middle" : "top"}
        offsetX={0}
        offsetY={needsLabelRotation ? labelFontSize / 2 : 0}
        width={needsLabelRotation ? undefined : (hasMultiLineLabels ? bandWidth : undefined)}
        ellipsis={useTruncation && !hasMultiLineLabels}
        wrap={hasMultiLineLabels && !needsLabelRotation ? "word" : undefined}
      />
    );
  });
};

/**
 * Renders axis lines (X and Y)
 */
export const AxisLines = ({ 
  chartType, 
  showXAxis, 
  showYAxis, 
  chartW, 
  chartH, 
  padding, 
  yScale,
  hasNegativeValues 
}) => {
  return (
    <>
      {/* Zero line for negative values */}
      {hasNegativeValues && chartType !== "pie" && (
        <Line
          points={[padding, yScale(0), chartW - padding, yScale(0)]}
          stroke="#d1d5db"
          strokeWidth={1}
          dash={[2, 2]}
          listening={false}
        />
      )}

      {/* X-Axis Line */}
      {showXAxis && chartType !== "pie" && (
        <Line
          points={[padding, yScale(0), chartW - padding, yScale(0)]}
          stroke="#9ca3af"
          strokeWidth={2}
          listening={false}
        />
      )}

      {/* Y-Axis Line */}
      {showYAxis && chartType !== "pie" && (
        <Line
          points={[padding, padding, padding, chartH - padding]}
          stroke="#9ca3af"
          strokeWidth={2}
          listening={false}
        />
      )}
    </>
  );
};

