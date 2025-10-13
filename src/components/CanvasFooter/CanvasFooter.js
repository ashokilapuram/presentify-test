import React, { useState, useEffect } from 'react';
import './CanvasFooter.css';

const CanvasFooter = ({
  manualZoom,
  setManualZoom,
  isPanning,
  setIsPanning,
  setShowDragMessage
}) => {
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  // Debug: Log props to see what we're receiving
  console.log('CanvasFooter props:', { manualZoom, isPanning, setManualZoom, setIsPanning, setShowDragMessage });
  
  // Show tutorial on every page load
  useEffect(() => {
    setShowTutorial(true);
    setTutorialStep(0);
    // Set initial tooltip position for zoom button
    setTimeout(() => {
      const zoomButton = document.querySelector('.zoom-out');
      if (zoomButton) {
        const rect = zoomButton.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top - 60,
          left: rect.left - 50
        });
      }
    }, 100);
  }, []);
  
  // Handle tutorial navigation
  const handleTutorialNext = () => {
    if (tutorialStep === 0) {
      // Move to drag button tutorial
      setTutorialStep(1);
      setTimeout(() => {
        const panButton = document.querySelector('.pan-button');
        if (panButton) {
          const rect = panButton.getBoundingClientRect();
          setTooltipPosition({
            top: rect.top - 60,
            left: rect.left - 50
          });
        }
      }, 100);
    } else {
      // End tutorial
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };
  
  const handleZoomOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Canvas Footer: Zoom out clicked, current zoom:', manualZoom);
    if (setManualZoom) {
      setManualZoom(z => Math.max(0.25, z - 0.1));
    } else {
      console.error('setManualZoom function not provided');
    }
  };

  const handleZoomIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Canvas Footer: Zoom in clicked, current zoom:', manualZoom);
    if (setManualZoom) {
      setManualZoom(z => Math.min(3, z + 0.1));
    } else {
      console.error('setManualZoom function not provided');
    }
  };

  const handlePanToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newPanningState = !isPanning;
    console.log('Canvas Footer: Pan toggle clicked, current state:', isPanning, 'new state:', newPanningState);
    
    if (setIsPanning) {
      setIsPanning(newPanningState);
      
      // Only show message when turning ON drag mode (entering pan mode)
      if (newPanningState && setShowDragMessage) {
        setShowDragMessage(true);
        setTimeout(() => setShowDragMessage(false), 30000); // 30 seconds
      } else if (setShowDragMessage) {
        // When turning OFF, immediately hide any existing message
        setShowDragMessage(false);
      }
    } else {
      console.error('setIsPanning function not provided');
    }
  };

  return (
    <>
      {showTutorial && (
        <div className="tutorial-overlay" />
      )}
      
      <div className="canvas-footer">
        <div className="canvas-controls-centered">
          <div className="zoom-control">
            <span className="zoom-label" style={{ fontSize: '12px', color: '#666', marginRight: '8px' }}>
              Adjust canvas size here
            </span>
            <button 
              className="zoom-button zoom-out"
              onClick={handleZoomOut}
              title="Zoom Out (Ctrl+-)"
              type="button"
            >
              −
            </button>
            <span className="zoom-percentage">
              {Math.round(manualZoom * 100)}%
            </span>
            <button 
              className="zoom-button zoom-in"
              onClick={handleZoomIn}
              title="Zoom In (Ctrl++)"
              type="button"
            >
              +
            </button>
          </div>
          
          <div className="pan-control">
            <span className="pan-label" style={{ fontSize: '12px', color: '#666', marginRight: '8px' }}>
              Click here to adjust canvas position
            </span>
            <button
              className={`pan-button ${isPanning ? 'active' : ''}`}
              onClick={handlePanToggle}
              title={isPanning ? "Exit Pan Mode" : "Enter Pan Mode"}
              type="button"
            >
              🖐️
            </button>
          </div>
        </div>
      </div>
      
      {showTutorial && (
        <div 
          className="tutorial-tooltip above"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="tutorial-content">
            <div className="tutorial-text">
              {tutorialStep === 0 ? 'Zoom according to display' : 'Click here and drag canvas'}
            </div>
            <div className="tutorial-buttons">
              <button 
                className="tutorial-skip-button"
                onClick={handleSkipTutorial}
              >
                Skip
              </button>
              <button 
                className="tutorial-next-button"
                onClick={handleTutorialNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CanvasFooter;
