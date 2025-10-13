import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
  FiAlignRight, FiAlignJustify, FiRotateCcw, FiRotateCw,
  FiDownload, FiUser, FiMaximize2, FiPlay, FiType, FiArrowLeft
} from 'react-icons/fi';
import './Toolbar.css';

const Toolbar = ({
  textFormatting,
  setTextFormatting,
  selectedElement,
  updateSlideElement,
  onShowTemplates,
  onActiveTabChange,
  onStartFullScreenSlideshow,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  slides,
  onBackToLanding,
  onShowProfile,
  setShowDragMessage
}) => {
  const [viewMode, setViewMode] = useState('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const restoreSelection = () => {
    const store = window.__PRESENTIFY_SELECTION__;
    if (store && store.element) {
      store.element.focus();
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(store.range);
    }
  };

  const applyFormat = (property, value) => {
    restoreSelection();
    const editor = window.__PRESENTIFY_SELECTION__?.element;
    if (!editor) return;

    if (selectedElement) {
      updateSlideElement(selectedElement.id, {
        [property]: value,
        content: editor.innerHTML
      });
    }

    const newFormat = { ...textFormatting, [property]: value };
    setTextFormatting(newFormat);
  };

  const toggleStyle = (property) => {
    const current = textFormatting[property];
    let newValue;
    switch (property) {
      case 'fontWeight': newValue = current === 'bold' ? 'normal' : 'bold'; break;
      case 'fontStyle': newValue = current === 'italic' ? 'normal' : 'italic'; break;
      case 'textDecoration': newValue = current === 'underline' ? 'none' : 'underline'; break;
      default: newValue = current;
    }
    applyFormat(property, newValue);
  };

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60];

  const handleDownload = () => {
    const presentationData = {
      name: "My Presentation",
      description: "Presentation created with Presentify",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      slides: slides
    };

    const dataStr = JSON.stringify(presentationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `presentation-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-top">
        <div className="toolbar-logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <polygon points="8,12 12,8 16,12" fill="currentColor"/>
            </svg>
          </div>
          Presentify
        </div>
        
        {onBackToLanding && (
          <button 
            className="toolbar-button"
            onClick={onBackToLanding}
            title="Back to Landing Page"
          >
            <FiArrowLeft size={16} />
          </button>
        )}

        <div className="toolbar-actions">
          <button 
            className={`toolbar-button ${!canUndo ? 'disabled' : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <FiRotateCcw size={16} />
          </button>
          <button 
            className={`toolbar-button ${!canRedo ? 'disabled' : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <FiRotateCw size={16} />
          </button>
          <button 
            className="toolbar-button"
            onClick={handleDownload}
            title="Download Presentation (Ctrl+S)"
          >
            <FiDownload size={16} />
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
            className={`toolbar-button ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
          >
            <FiMaximize2 size={16} />
          </button>
          
          
          <div className="toolbar-user" onClick={onShowProfile} title="Profile Settings">
            <FiUser size={20} />
          </div>
        </div>
      </div>
      
      <div className="toolbar-bottom">
        <div className="toolbar-formatting">
          {/* Font Family */}
          <select
            className="formatting-select"
            value={textFormatting.fontFamily || 'Inter'}
            onChange={(e) => applyFormat('fontFamily', e.target.value)}
          >
            <option value="Inter">Inter</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>

          {/* Font Size */}
          <select
            className="formatting-select"
            value={textFormatting.fontSize}
            onChange={(e) => applyFormat('fontSize', parseInt(e.target.value))}
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          {/* Separator */}
          <div className="formatting-separator"></div>

          {/* Font Style */}
          <button className={`formatting-button ${textFormatting.fontWeight === 'bold' ? 'active' : ''}`} onClick={() => toggleStyle('fontWeight')}>
            <FiBold />
          </button>
          <button className={`formatting-button ${textFormatting.fontStyle === 'italic' ? 'active' : ''}`} onClick={() => toggleStyle('fontStyle')}>
            <FiItalic />
          </button>
          <button className={`formatting-button ${textFormatting.textDecoration === 'underline' ? 'active' : ''}`} onClick={() => toggleStyle('textDecoration')}>
            <FiUnderline />
          </button>

          {/* Separator */}
          <div className="formatting-separator"></div>

          {/* Text Alignment */}
          <button className={`formatting-button ${textFormatting.textAlign === 'left' ? 'active' : ''}`} onClick={() => applyFormat('textAlign', 'left')}>
            <FiAlignLeft />
          </button>
          <button className={`formatting-button ${textFormatting.textAlign === 'center' ? 'active' : ''}`} onClick={() => applyFormat('textAlign', 'center')}>
            <FiAlignCenter />
          </button>
          <button className={`formatting-button ${textFormatting.textAlign === 'right' ? 'active' : ''}`} onClick={() => applyFormat('textAlign', 'right')}>
            <FiAlignRight />
          </button>
          <button className={`formatting-button ${textFormatting.textAlign === 'justify' ? 'active' : ''}`} onClick={() => applyFormat('textAlign', 'justify')}>
            <FiAlignJustify />
          </button>

          {/* Separator */}
          <div className="formatting-separator"></div>

          {/* Font Color */}
          <div className="color-button-container">
            <button 
              className="formatting-button color-button" 
              onClick={() => document.querySelector('.color-picker').click()}
              style={{ color: textFormatting.color }}
            >
              <span style={{ 
                fontWeight: 'bold', 
                textDecoration: 'underline', 
                color: '#dc2626' 
              }}>
                A
              </span>
            </button>
            <input 
              type="color" 
              value={textFormatting.color} 
              onChange={(e) => applyFormat('color', e.target.value)} 
              className="color-picker" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;