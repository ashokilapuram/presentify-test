import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const BarChart = ({ width, height, labels, values, color, barColors }) => {
  const padding = 24;
  const innerW = Math.max(10, width - padding * 2);
  const innerH = Math.max(10, height - padding * 2);
  const maxVal = Math.max(1, ...values);
  const barGap = 8;
  const barWidth = Math.max(1, (innerW - barGap * (values.length - 1)) / values.length);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <g transform={`translate(${padding}, ${padding})`}>
        <rect x={0} y={0} width={innerW} height={innerH} fill="none" stroke="#e5e7eb" />
        {values.map((v, i) => {
          const h = (v / maxVal) * (innerH - 16);
          const x = i * (barWidth + barGap);
          const y = innerH - h;
          const barColor = (barColors && barColors[i]) || color;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} fill={barColor} rx={4} />
              {/* Value label on top of bar */}
              <text 
                x={x + barWidth / 2} 
                y={y - 4} 
                textAnchor="middle" 
                fontSize="10" 
                fill="#374151"
                fontWeight="500"
              >
                {v}
              </text>
              {/* Label below bar */}
              <text x={x + barWidth / 2} y={innerH + 14} textAnchor="middle" fontSize="10" fill="#6b7280">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export const LineChart = ({ width, height, labels, values, color }) => {
  const padding = 24;
  const innerW = Math.max(10, width - padding * 2);
  const innerH = Math.max(10, height - padding * 2);
  const maxVal = Math.max(1, ...values);
  const stepX = innerW / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = innerH - (v / maxVal) * (innerH - 16);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <g transform={`translate(${padding}, ${padding})`}>
        <rect x={0} y={0} width={innerW} height={innerH} fill="none" stroke="#e5e7eb" />
        <polyline fill="none" stroke={color} strokeWidth={2} points={points} />
        {values.map((v, i) => {
          const x = i * stepX;
          const y = innerH - (v / maxVal) * (innerH - 16);
          return <circle key={i} cx={x} cy={y} r={3} fill={color} />;
        })}
        {labels.map((l, i) => (
          <text key={i} x={i * stepX} y={innerH + 14} textAnchor="middle" fontSize="10" fill="#6b7280">
            {l}
          </text>
        ))}
      </g>
    </svg>
  );
};

export const PieChart = ({ width, height, labels, values, color, sliceColors }) => {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(10, Math.min(width, height) / 2 - 8);
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let startAngle = -Math.PI / 2;
  const defaultPalette = [color, '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

  const arcs = values.map((v, i) => {
    const angle = (v / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const midAngle = startAngle + angle / 2;
    
    // Calculate label position (outside the pie slice)
    const labelRadius = radius + 20;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);
    
    // Calculate arc path
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    startAngle = endAngle;
    
    const sliceColor = (sliceColors && sliceColors[i]) || defaultPalette[i % defaultPalette.length];
    
    return (
      <g key={i}>
        <path d={d} fill={sliceColor} stroke="#ffffff" strokeWidth={1} />
        <text 
          x={labelX} 
          y={labelY} 
          textAnchor="middle" 
          fontSize="10" 
          fill="#374151"
          fontWeight="500"
        >
          {labels[i]}
        </text>
      </g>
    );
  });

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {arcs}
    </svg>
  );
};

const ChartBox = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  scale = 1
}) => {
  const rndRef = useRef(null);
  const { width, height, x, y, chartType, labels, values, color, barColors, sliceColors } = element;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <LineChart width={width} height={height} labels={labels} values={values} color={color} />;
      case 'pie':
        return <PieChart width={width} height={height} labels={labels} values={values} color={color} sliceColors={sliceColors} />;
      case 'bar':
      default:
        return <BarChart width={width} height={height} labels={labels} values={values} color={color} barColors={barColors} />;
    }
  };

  return (
    <Rnd
      ref={rndRef}
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(e, d) => onUpdate(element.id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        onUpdate(element.id, {
          width: clamp(parseInt(ref.style.width, 10), 120, 1200),
          height: clamp(parseInt(ref.style.height, 10), 100, 800),
          x: pos.x,
          y: pos.y,
        });
      }}
      bounds="parent"
      onClick={(e) => { e.stopPropagation(); if (!isSelected) onSelect(element); }}
      scale={scale}
      style={{
        border: isSelected ? '1px solid #2d9cdb' : '1px solid transparent',
        background: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      {isSelected && (
        <div
          onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
          style={{
            position: 'absolute',
            top: -18,
            right: -18,
            width: 18,
            height: 18,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '18px',
            fontSize: 12,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          ×
        </div>
      )}
      <div style={{ width: '100%', height: '100%', padding: 8 }}>
        {renderChart()}
      </div>
    </Rnd>
  );
};

export default ChartBox;



