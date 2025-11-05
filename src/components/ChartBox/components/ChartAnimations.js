import { useEffect, useState } from 'react';

/**
 * Custom hook to manage chart animations
 */
export const useChartAnimations = (element, seriesData) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [barAnimations, setBarAnimations] = useState({});

  // Individual bar animations
  useEffect(() => {
    if (element.chartType === "bar" && seriesData.length > 0) {
      const newBarAnimations = {};
      seriesData.forEach((series, seriesIndex) => {
        (series.values || []).forEach((value, labelIndex) => {
          const key = `${labelIndex}-${seriesIndex}`;
          const prevValue = barAnimations[key]?.finalValue || 0;
          if (value !== prevValue) {
            newBarAnimations[key] = {
              progress: 0,
              finalValue: value,
              startValue: prevValue
            };
          } else {
            // Keep existing animation state if value hasn't changed
            newBarAnimations[key] = barAnimations[key] || {
              progress: 1,
              finalValue: value,
              startValue: value
            };
          }
        });
      });
      setBarAnimations(newBarAnimations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element.chartType, seriesData]);

  // Animation (mount + update)
  useEffect(() => {
    let frame = 0;
    const total = 30;
    const animate = () => {
      frame++;
      setAnimationProgress(frame / total);
      if (frame < total) requestAnimationFrame(animate);
    };
    animate();
  }, [seriesData, element.labels]);

  // Animate individual bars
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

  return { animationProgress, barAnimations };
};

