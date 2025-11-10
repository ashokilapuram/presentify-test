import React from 'react';
import { Group, Circle, Text, Shape } from 'react-konva';
import * as d3 from 'd3';
import PathLike from './PathLike';

/**
 * Renders pie chart with enhanced text rendering
 */
const PieChart = ({ 
  data, 
  labels, 
  chartW, 
  chartH, 
  animationProgress, 
  sliceColors,
  element 
}) => {
  const radius = Math.min(chartW, chartH) / 2 - 10;
  const pieGen = d3.pie()(data);
  const arcGen = d3.arc().innerRadius(0).outerRadius(radius);
  const cx = chartW / 2;
  const cy = chartH / 2 + 10;
  const textColor = element.labelsColor || "#1f2937"; // Darker, richer color
  
  return pieGen.map((slice, i) => {
    const path = arcGen(slice);
    const endAngle = slice.endAngle * animationProgress;
    const animPath = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(slice.startAngle)
      .endAngle(endAngle)();
    
    // Calculate responsive label position - on the left side of the chart
    const labelX = 8; // Closer to edge for smaller containers
    const labelSpacing = Math.max(20, Math.min(30, chartH / 8)); // Responsive spacing
    const labelY = 35 + (i * labelSpacing); // Responsive vertical spacing
    const dotRadius = Math.max(4, Math.min(6, chartW / 60)); // Responsive dot size
    const fontSize = Math.max(8, Math.min(12, chartW / 40)); // More responsive font size
    
    return (
      <Group key={i}>
        <PathLike
          pathData={animPath}
          fill={sliceColors[i]}
          x={cx}
          y={cy}
        />
        {/* Color indicator dot */}
        <Circle
          x={labelX + dotRadius + 2}
          y={labelY - 2}
          radius={dotRadius}
          fill={sliceColors[i]}
          listening={false}
        />
        {/* Pie slice labels with enhanced sharp rendering */}
        <Shape
          sceneFunc={(context, shape) => {
            const text = labels[i];
            const x = labelX + (dotRadius * 2) + 8;
            const y = labelY;
            
            context.save();
            
            // Enable better text rendering
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
            
            // Draw text with rich color
            context.fillStyle = textColor;
            context.fillText(text, x, y);
            
            context.restore();
            context.fillStrokeShape(shape);
          }}
          listening={false}
        />
      </Group>
    );
  });
};

export default PieChart;

