import React, { useEffect, useRef, useState, useMemo } from "react";
import { Group, Rect, Text, Line, Arc, Transformer, Circle, Shape } from "react-konva";
import * as d3 from "d3";

const ChartBox = ({ element, isSelected, onSelect, onChange, readOnly = false }) => {
  const groupRef = useRef(null);
  const trRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [barAnimations, setBarAnimations] = useState({});

  // ---- Selection transformer ----
  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // ---- Update transformer when element changes ----
  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [element.x, element.y, element.width, element.height, isSelected]);

  // ---- Animation (mount + update) ----
  useEffect(() => {
    let frame = 0;
    const total = 30;
    const animate = () => {
      frame++;
      setAnimationProgress(frame / total);
      if (frame < total) requestAnimationFrame(animate);
    };
    animate();
  }, [element.values, element.labels]);

  // ---- Individual bar animations ----
  useEffect(() => {
    if (element.chartType === "bar" && data.length > 0) {
      const newBarAnimations = {};
      data.forEach((value, index) => {
        const prevValue = barAnimations[index]?.finalValue || 0;
        if (value !== prevValue) {
          newBarAnimations[index] = {
            progress: 0,
            finalValue: value,
            startValue: prevValue
          };
        } else {
          // Keep existing animation state if value hasn't changed
          newBarAnimations[index] = barAnimations[index] || {
            progress: 1,
            finalValue: value,
            startValue: value
          };
        }
      });
      setBarAnimations(newBarAnimations);
    }
  }, [element.values]);

  // ---- Animate individual bars ----
  useEffect(() => {
    const animateBars = () => {
      setBarAnimations(prev => {
        const updated = { ...prev };
        let hasAnimating = false;
        
        Object.keys(updated).forEach(key => {
          const bar = updated[key];
          if (bar.progress < 1) {
            bar.progress = Math.min(1, bar.progress + 0.05);
            hasAnimating = true;
          }
        });
        
        if (hasAnimating) {
          requestAnimationFrame(animateBars);
        }
        
        return updated;
      });
    };
    
    const hasAnimatingBars = Object.values(barAnimations).some(bar => bar.progress < 1);
    if (hasAnimatingBars) {
      requestAnimationFrame(animateBars);
    }
  }, [barAnimations]);

  const chartW = element.width || 360;
  const chartH = element.height || 240;
  const padding = 35;
  const data = element.values || [];
  const labels = element.labels || [];
  const maxVal = d3.max(data) || 1;
  const minVal = d3.min(data) || 0;
  const hasNegativeValues = minVal < 0;

  const handleTransformEnd = () => {
    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    
    // Use same minimum sizes as transformer bounds
    const minWidth = element.chartType === "pie" ? 140 : 120;
    const minHeight = element.chartType === "pie" ? 140 : 100;
    
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: Math.max(minWidth, chartW * scaleX),
      height: Math.max(minHeight, chartH * scaleY),
      rotation: node.rotation(),
    });
  };

  // ---- Common layout helpers ----
  const xScale = d3
    .scaleBand()
    .domain(labels)
    .range([padding, chartW - padding])
    .padding(0.25);
  
  // Y-axis scale that handles negative values
  const yScale = d3
    .scaleLinear()
    .domain(hasNegativeValues ? [minVal, maxVal] : [0, maxVal])
    .range(hasNegativeValues ? [chartH - padding, padding] : [chartH - padding, padding]);

  // ---- Colors ----
  const defaultColor = element.color || "#0ea5e9";
  
  // Memoize barColors to ensure proper updates when colors change
  const barColors = useMemo(() => {
    // Always ensure we have a valid array
    if (!labels || labels.length === 0) {
      return [];
    }
    
    if (element.barColors && element.barColors.length === labels.length) {
      return element.barColors;
    }
    if (element.barColors && element.barColors.length > 0) {
      // Preserve existing colors and only extend if needed
      const colors = [...element.barColors];
      while (colors.length < labels.length) {
        // For line charts, use diverse colors; for bar charts, use single default color
        if (element.chartType === 'line') {
          const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
          colors.push(defaultColors[colors.length % defaultColors.length]);
        } else {
          colors.push(defaultColor);
        }
      }
      return colors;
    }
    // Create new array with default colors
    if (element.chartType === 'line') {
      // For line charts, use diverse colors for each point
      const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
      return labels.map((_, i) => defaultColors[i % defaultColors.length]);
    }
    return labels.map(() => defaultColor);
  }, [element.barColors, labels.length, defaultColor]);
  
  // Use barColors for pie slices to unify color management
  const sliceColors = useMemo(() => {
    if (element.barColors && element.barColors.length === labels.length) {
      return element.barColors;
    }
    if (element.barColors && element.barColors.length > 0) {
      // Preserve existing colors and only extend if needed
      const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
      const colors = [...element.barColors];
      // Only extend if we have fewer colors than labels
      while (colors.length < labels.length) {
        colors.push(defaultColors[colors.length % defaultColors.length]);
      }
      return colors;
    }
    // Create new array with different colors for each slice
    const defaultColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#84cc16', '#f97316'];
    return labels.map((_, i) => defaultColors[i % defaultColors.length]);
  }, [element.barColors, labels.length]);

  // ---- Chart type rendering ----
  const renderBars = () => {
    if (!data || data.length === 0 || !barColors || barColors.length === 0) {
      return null;
    }
    
    return data.map((d, i) => {
      const barX = xScale(labels[i]);
      const barAnimation = barAnimations[i];
      
      let currentValue;
      if (barAnimation && barAnimation.progress < 1) {
        // Animate from start value to final value
        currentValue = barAnimation.startValue + (barAnimation.finalValue - barAnimation.startValue) * barAnimation.progress;
      } else {
        // Use final value
        currentValue = d;
      }
      
      const barY = yScale(Math.max(0, currentValue));
      const barHeight = Math.abs(yScale(currentValue) - yScale(0));
      
      // Ensure we have a valid color
      const barColor = barColors[i % barColors.length] || defaultColor;
      
      return (
        <Rect
          key={i}
          x={barX}
          y={barY}
          width={xScale.bandwidth()}
          height={barHeight}
          fill={barColor}
          cornerRadius={4}
        />
      );
    });
  };

  const renderLine = () => {
    const points = data.map((d, i) => [xScale(labels[i]) + xScale.bandwidth() / 2, yScale(d)]);
    const outerRadius = 6;
    
    return (
      <>
        {/* Render line segments between points, stopping at ring edges */}
        {points.map(([x1, y1], i) => {
          if (i === points.length - 1) return null;
          const [x2, y2] = points[i + 1];
          
          // Calculate angle and distance between points
          const dx = x2 - x1;
          const dy = y2 - y1;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate offset to stop at ring edge
          const offsetX = (dx / distance) * outerRadius;
          const offsetY = (dy / distance) * outerRadius;
          
          // Start and end points adjusted to stop at ring edges
          const startX = x1 + offsetX;
          const startY = y1 + offsetY;
          const endX = x2 - offsetX;
          const endY = y2 - offsetY;
          
          return (
            <Line
              key={i}
              points={[startX, startY, endX, endY]}
              stroke={defaultColor}
              strokeWidth={2.5}
              lineCap="round"
              opacity={animationProgress}
            />
          );
        })}
        {/* Render outer rings and inner points */}
        {points.map(([x, y], i) => {
          // Get individual point color if available, otherwise use default color
          const pointColor = (element.barColors && element.barColors[i]) || defaultColor;
          return (
            <React.Fragment key={i}>
              {/* Outer ring */}
              <Circle
                x={x}
                y={y}
                radius={outerRadius}
                stroke={pointColor}
                strokeWidth={2}
                fill="transparent"
                opacity={animationProgress}
              />
              {/* Inner point */}
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
      </>
    );
  };

  const renderPie = () => {
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

  // Custom Konva path component for D3 arc strings
  const PathLike = ({ pathData, fill, x, y }) => {
    const shapeRef = useRef();
    useEffect(() => {
      if (shapeRef.current) shapeRef.current.getLayer()?.batchDraw();
    }, [pathData]);
    return (
      <React.Fragment>
        <Shape
          ref={shapeRef}
          sceneFunc={(context, shape) => {
            const path = new Path2D(pathData);
            context.fillStyle = fill;
            context.fill(path);
            context.closePath();
          }}
          x={x}
          y={y}
        />
      </React.Fragment>
    );
  };

  // ---- Y-axis labels (no lines) ----
  const renderYAxisValues = () => {
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
        fill={element.yAxisColor || "#6b7280"}
      />
    ));
  };

  // ---- X-axis labels ----
  const renderXAxisLabels = () =>
    labels.map((label, i) => (
      <Text
        key={i}
        text={label}
        x={xScale(label) + xScale.bandwidth() / 2 - 8}
        y={chartH - padding + 8}
        fontSize={12}
        fill={element.labelsColor || "#374151"}
      />
    ));

  return (
    <>
      <Group
        ref={groupRef}
        x={element.x}
        y={element.y}
        rotation={element.rotation || 0}
        draggable={!readOnly}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect?.();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect?.();
        }}
        onDragEnd={(e) =>
          onChange({ ...element, x: e.target.x(), y: e.target.y() })
        }
        onTransformEnd={handleTransformEnd}
      >
        {/* Background */}
        <Rect
          width={chartW}
          height={chartH}
          fill={element.backgroundColor || "transparent"}
          stroke={isSelected ? "#2563eb" : "transparent"}
          strokeWidth={1.5}
          cornerRadius={8}
        />

        {/* Chart Name */}
        {element.chartName && (
          <Text
            text={element.chartName}
            x={element.chartType === "pie" ? padding : chartW / 2}
            y={8}
            fontSize={Math.max(10, Math.min(18, chartW / 25))}
            fontStyle="bold"
            fill={element.chartNameColor || "#111827"}
            align={element.chartType === "pie" ? "left" : "center"}
          />
        )}

        {/* Zero line for negative values */}
        {hasNegativeValues && element.chartType !== "pie" && (
          <Line
            points={[padding, yScale(0), chartW - padding, yScale(0)]}
            stroke="#d1d5db"
            strokeWidth={1}
            dash={[2, 2]}
            listening={false}
          />
        )}

        {/* X-Axis Line */}
        {element.showXAxis && element.chartType !== "pie" && (
          <Line
            points={[padding, yScale(0), chartW - padding, yScale(0)]}
            stroke="#9ca3af"
            strokeWidth={2}
            listening={false}
          />
        )}

        {/* Y-Axis Line */}
        {element.showYAxis && element.chartType !== "pie" && (
          <Line
            points={[padding, padding, padding, chartH - padding]}
            stroke="#9ca3af"
            strokeWidth={2}
            listening={false}
          />
        )}

        {/* Chart Rendering */}
        {element.chartType === "bar" && renderBars()}
        {element.chartType === "line" && renderLine()}
        {element.chartType === "pie" && renderPie()}

        {/* Labels */}
        {element.chartType !== "pie" && renderXAxisLabels()}
        {element.chartType !== "pie" && renderYAxisValues()}
      </Group>

      {isSelected && !readOnly && (
        <Transformer
          ref={trRef}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            // Increased minimum sizes for better appearance
            const minWidth = element.chartType === "pie" ? 140 : 120;
            const minHeight = element.chartType === "pie" ? 140 : 100;
            
            if (newBox.width < minWidth || newBox.height < minHeight) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ChartBox;