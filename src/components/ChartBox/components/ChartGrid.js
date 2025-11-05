import React from 'react';
import { Line } from 'react-konva';
import * as d3 from 'd3';

/**
 * Renders horizontal grid lines at Y-axis values
 */
const ChartGrid = ({ 
  chartType, 
  chartW, 
  chartH, 
  padding, 
  yScale, 
  hasNegativeValues, 
  minVal, 
  maxVal 
}) => {
  if (chartType === "pie") return null;
  
  const tickCount = 4;
  const domain = hasNegativeValues ? [minVal, maxVal] : [0, maxVal];
  const ticks = d3.ticks(domain[0], domain[1], tickCount);
  
  return ticks.map((t, i) => (
    <Line
      key={i}
      points={[padding, yScale(t), chartW - padding, yScale(t)]}
      stroke="#e5e7eb"
      strokeWidth={1.5}
      dash={[4, 4]}
      listening={false}
    />
  ));
};

export default ChartGrid;

