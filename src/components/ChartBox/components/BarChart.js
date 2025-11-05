import React from 'react';
import { Shape } from 'react-konva';

/**
 * Renders bar chart
 */
const BarChart = ({ 
  seriesData, 
  labels, 
  xScale, 
  yScale, 
  barAnimations, 
  defaultColor 
}) => {
  if (!labels || labels.length === 0 || seriesData.length === 0) {
    return null;
  }
  
  // Calculate bar width to fit all series side by side
  const barWidth = xScale.bandwidth() / seriesData.length;
  const gap = barWidth * 0.1; // Small gap between bars
  const actualBarWidth = barWidth - gap;
  
  const bars = [];
  
  // Render bars for each label
  labels.forEach((label, labelIndex) => {
    // Render one bar per series for this label
    seriesData.forEach((series, seriesIndex) => {
      const value = series.values[labelIndex] ?? 0;
      const barX = xScale(label) + (seriesIndex * barWidth) + (gap / 2);
      const barAnimation = barAnimations[`${labelIndex}-${seriesIndex}`];
      
      let currentValue;
      if (barAnimation && barAnimation.progress < 1) {
        currentValue = barAnimation.startValue + (barAnimation.finalValue - barAnimation.startValue) * barAnimation.progress;
      } else {
        currentValue = value;
      }
      
      const barY = yScale(Math.max(0, currentValue));
      const barHeight = Math.abs(yScale(currentValue) - yScale(0));
      const isNegative = currentValue < 0;
      
      // Get color for this series and label
      const barColor = (series.barColors && series.barColors[labelIndex]) || 
                       (series.barColors && series.barColors[0]) || 
                       defaultColor;
      
      // Create a bar with rounded corners on the side away from x-axis
      // For positive bars: rounded top corners, sharp bottom (at x-axis)
      // For negative bars: rounded bottom corners, sharp top (at x-axis)
      const radius = Math.min(4, barHeight / 2); // Ensure radius doesn't exceed half the height
      const x = barX;
      const y = barY;
      const width = actualBarWidth;
      const height = barHeight;
      
      bars.push(
        <Shape
          key={`${labelIndex}-${seriesIndex}`}
          sceneFunc={(context, shape) => {
            context.beginPath();
            
            if (isNegative) {
              // Negative bar: rounded bottom corners, sharp top (at x-axis)
              // Start from top-left (sharp corner at x-axis)
              context.moveTo(x, y);
              // Line to top-right (sharp corner at x-axis)
              context.lineTo(x + width, y);
              // Line to bottom-right, just before the rounded corner
              context.lineTo(x + width, y + height - radius);
              // Draw rounded bottom-right corner
              context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
              // Line to bottom-left, just before the rounded corner
              context.lineTo(x + radius, y + height);
              // Draw rounded bottom-left corner
              context.quadraticCurveTo(x, y + height, x, y + height - radius);
              // Close path back to top-left
              context.closePath();
            } else {
              // Positive bar: rounded top corners, sharp bottom (at x-axis)
              // Start from bottom-left (sharp corner at x-axis)
              context.moveTo(x, y + height);
              // Line to bottom-right (sharp corner at x-axis)
              context.lineTo(x + width, y + height);
              // Line to top-right, just before the rounded corner
              context.lineTo(x + width, y + radius);
              // Draw rounded top-right corner
              context.quadraticCurveTo(x + width, y, x + width - radius, y);
              // Line to top-left, just before the rounded corner
              context.lineTo(x + radius, y);
              // Draw rounded top-left corner
              context.quadraticCurveTo(x, y, x, y + radius);
              // Close path back to bottom-left
              context.closePath();
            }
            
            context.fillStyle = barColor;
            context.fill();
            context.fillStrokeShape(shape);
          }}
          fill={barColor}
        />
      );
    });
  });
  
  return bars;
};

export default BarChart;

