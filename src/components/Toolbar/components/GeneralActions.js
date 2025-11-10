import React from 'react';
import { Undo, Redo, RotateCw } from 'lucide-react';
import { FiPlay, FiDownload, FiMaximize2 } from 'react-icons/fi';

/**
 * General actions buttons component
 */
const GeneralActions = ({ 
  canUndo, 
  canRedo, 
  isFullscreen,
  onUndo, 
  onRedo, 
  onStartFullScreenSlideshow, 
  onDownloadPresentation, 
  onToggleFullscreen, 
  onReset,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom
}) => {
  return (
    <>
      <button 
        className={`toolbar-button ${!canUndo ? 'disabled' : ''}`}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={16} />
      </button>
      <button 
        className={`toolbar-button ${!canRedo ? 'disabled' : ''}`}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={16} />
      </button>
      <button 
        className="toolbar-button primary"
        onClick={onStartFullScreenSlideshow}
        title="Start Slideshow (F5)"
      >
        <FiPlay size={16} />
        Slideshow
      </button>
      <button 
        className="toolbar-button"
        onClick={onDownloadPresentation}
        title="Download PowerPoint"
      >
        <FiDownload size={16} />
      </button>
      <button 
        className={`toolbar-button ${isFullscreen ? 'active' : ''}`}
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
      >
        <FiMaximize2 size={16} />
      </button>
      <button 
        className="toolbar-button"
        onClick={onReset}
        title="Reset App (New Slide)"
      >
        <RotateCw size={16} />
      </button>
    </>
  );
};

export default GeneralActions;

