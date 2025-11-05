import { useEffect, useRef } from 'react';
import { padChartData } from '../utils/dataProcessing';

/**
 * Custom hook to handle live updates for bar and line charts
 */
export const useLiveUpdates = (isOpen, element, labels, series, onSave) => {
  const updateTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const onSaveRef = useRef(onSave);

  // Keep onSave ref up to date
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Live updates: automatically save changes as user edits (for bar and line charts only)
  useEffect(() => {
    // Skip if modal not open, no element, or no data
    if (!isOpen || !element || labels.length === 0 || series.length === 0) {
      return;
    }
    
    // Only for bar and line charts (pie charts excluded)
    if (element.chartType === 'pie') {
      return;
    }
    
    // Skip first change (initial data load)
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }
    
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce: wait 300ms after last change
    updateTimeoutRef.current = setTimeout(() => {
      const finalData = padChartData(labels, series, element.chartType, element);
      
      // Send live update (without closing modal) - use ref to avoid stale closure
      if (onSaveRef.current) {
        onSaveRef.current(finalData);
      }
    }, 300);
    
    // Cleanup
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [labels, series, isOpen, element]);

  // Reset initial load flag when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      isInitialLoadRef.current = true;
    } else {
      // Cleanup timeout when modal closes
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
      // Reset initial load flag
      isInitialLoadRef.current = true;
    }
  }, [isOpen]);
};

