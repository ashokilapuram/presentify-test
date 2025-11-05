import React from 'react';
import { Line, Circle } from 'react-konva';

/**
 * Renders line chart
 */
const LineChart = ({ 
  seriesData, 
  labels, 
  xScale, 
  yScale, 
  animationProgress 
}) => {
  const outerRadius = 6;
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
            {/* Render line segments between points */}
            {points.map(([x1, y1], i) => {
              if (i === points.length - 1) return null;
              const [x2, y2] = points[i + 1];
              
              const dx = x2 - x1;
              const dy = y2 - y1;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const offsetX = (dx / distance) * outerRadius;
              const offsetY = (dy / distance) * outerRadius;
              const startX = x1 + offsetX;
              const startY = y1 + offsetY;
              const endX = x2 - offsetX;
              const endY = y2 - offsetY;
              
              return (
                <Line
                  key={`${seriesIndex}-line-${i}`}
                  points={[startX, startY, endX, endY]}
                  stroke={lineColor}
                  strokeWidth={2.5}
                  lineCap="round"
                  opacity={animationProgress}
                />
              );
            })}
            {/* Render outer rings and inner points */}
            {points.map(([x, y], i) => {
              const pointColor = (series.barColors && series.barColors[i]) || lineColor;
              return (
                <React.Fragment key={`${seriesIndex}-point-${i}`}>
                  <Circle
                    x={x}
                    y={y}
                    radius={outerRadius}
                    stroke={pointColor}
                    strokeWidth={2}
                    fill="transparent"
                    opacity={animationProgress}
                  />
                  <Circle
                    x={x}
                    y={y}
                    radius={3.5}
                    fill={pointColor}
                    opacity={animationProgress}
                  />
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default LineChart;

