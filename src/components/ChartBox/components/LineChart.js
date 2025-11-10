import React from 'react';
import { Line, Circle, Shape } from 'react-konva';
import { lightenColor, darkenColor } from '../utils/chartGradients';

/**
 * Renders line chart with enhanced styling, gradients, and shadows
 */
const LineChart = ({ 
  seriesData, 
  labels, 
  xScale, 
  yScale, 
  animationProgress 
}) => {
  const dotRadius = 3.5; // Slightly larger dots
  const seriesColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
  
  return (
    <>
      {seriesData.map((series, seriesIndex) => {
        const points = (series.values || []).map((d, i) => [
          xScale(labels[i]) + xScale.bandwidth() / 2, 
          yScale(d)
        ]);
        // Use first color from series barColors if available, otherwise use default
        const lineColor = (series.barColors && series.barColors[0]) || seriesColors[seriesIndex % seriesColors.length];
        
        return (
          <React.Fragment key={seriesIndex}>
            {/* Render line segments with gradient and shadow effects */}
            {points.map(([x1, y1], i) => {
              if (i === points.length - 1) return null;
              const [x2, y2] = points[i + 1];
              
              const dx = x2 - x1;
              const dy = y2 - y1;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const offsetX = (dx / distance) * dotRadius;
              const offsetY = (dy / distance) * dotRadius;
              const startX = x1 + offsetX;
              const startY = y1 + offsetY;
              const endX = x2 - offsetX;
              const endY = y2 - offsetY;
              
              return (
                <Shape
                  key={`${seriesIndex}-line-${i}`}
                  sceneFunc={(context, shape) => {
                    context.save();
                    context.globalAlpha = animationProgress;
                    
                    // Create gradient for this segment
                    const gradient = context.createLinearGradient(startX, startY, endX, endY);
                    const lightColor = lightenColor(lineColor, 0.15);
                    const baseColor = lineColor;
                    gradient.addColorStop(0, lightColor);
                    gradient.addColorStop(1, baseColor);
                    
                    // Add shadow
                    context.shadowColor = 'rgba(0, 0, 0, 0.2)';
                    context.shadowBlur = 3;
                    context.shadowOffsetX = 0;
                    context.shadowOffsetY = 1;
                    
                    // Draw line
                    context.beginPath();
                    context.moveTo(startX, startY);
                    context.lineTo(endX, endY);
                    context.strokeStyle = gradient;
                    context.lineWidth = 3;
                    context.lineCap = 'round';
                    context.stroke();
                    
                    context.restore();
                    context.fillStrokeShape(shape);
                  }}
                />
              );
            })}
            
            {/* Render enhanced dots at data points with shadows */}
            {points.map(([x, y], i) => {
              const pointColor = (series.barColors && series.barColors[i]) || lineColor;
              return (
                <Shape
                  key={`${seriesIndex}-point-${i}`}
                  sceneFunc={(context, shape) => {
                    context.save();
                    context.globalAlpha = animationProgress;
                    
                    // Outer glow
                    const gradient = context.createRadialGradient(x, y, 0, x, y, dotRadius + 2);
                    gradient.addColorStop(0, lightenColor(pointColor, 0.4));
                    gradient.addColorStop(0.7, pointColor);
                    gradient.addColorStop(1, darkenColor(pointColor, 0.2));
                    
                    // Shadow
                    context.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    context.shadowBlur = 4;
                    context.shadowOffsetX = 0;
                    context.shadowOffsetY = 1;
                    
                    // Draw circle
                    context.beginPath();
                    context.arc(x, y, dotRadius, 0, Math.PI * 2);
                    context.fillStyle = gradient;
                    context.fill();
                    
                    // Clear shadow and add border
                    context.shadowColor = 'transparent';
                    context.strokeStyle = '#ffffff';
                    context.lineWidth = 1.5;
                    context.stroke();
                    
                    context.restore();
                    context.fillStrokeShape(shape);
                  }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default LineChart;

