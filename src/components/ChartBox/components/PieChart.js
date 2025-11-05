import React from 'react';
import { Group, Circle, Text } from 'react-konva';
import * as d3 from 'd3';
import PathLike from './PathLike';

/**
 * Renders pie chart
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
        {/* Pie slice labels - on the left side */}
        <Text
          text={labels[i]}
          x={labelX + (dotRadius * 2) + 8}
          y={labelY}
          fontSize={fontSize}
          fill={element.labelsColor || "#374151"}
          align="left"
          fontStyle="bold"
          listening={false}
        />
      </Group>
    );
  });
};

export default PieChart;

