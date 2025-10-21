import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
  FiAlignRight, FiAlignJustify, FiRotateCcw, FiRotateCw,
  FiMaximize2, FiPlay, FiType, FiArrowLeft,
  FiChevronDown
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
    if (selectedElement && selectedElement.type === 'text') {
      // Check if there's a text selection in the contentEditable element
      const textElement = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
      if (textElement) {
        const selection = window.getSelection();
        const hasSelection = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
        
        if (hasSelection && selection.anchorNode && textElement.contains(selection.anchorNode)) {
          // Apply formatting to selected text
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          
          switch (property) {
            case 'color':
              span.style.color = value;
              break;
            case 'fontSize':
              span.style.fontSize = `${value}px`;
              break;
            case 'fontFamily':
              span.style.fontFamily = value;
              break;
            case 'fontWeight':
              span.style.fontWeight = value;
              break;
            case 'fontStyle':
              span.style.fontStyle = value;
              break;
            case 'textDecoration':
              span.style.textDecoration = value;
              break;
            default:
              break;
          }
          
          const frag = range.extractContents();
          span.appendChild(frag);
          range.insertNode(span);
          
          // Update the element content
          updateSlideElement(selectedElement.id, {
            content: textElement.innerHTML,
            [property]: value
          });
        } else {
          // No text selection, update element properties directly
          updateSlideElement(selectedElement.id, {
            [property]: value
          });
        }
      } else {
        // Fallback: update element properties directly
        updateSlideElement(selectedElement.id, {
          [property]: value
        });
      }
    }

    // Update the formatting state
    const newFormat = { ...textFormatting, [property]: value };
    setTextFormatting(newFormat);
  };

  const toggleStyle = (property) => {
    // Get current value from selected element or formatting state
    const current = selectedElement?.[property] || textFormatting[property];
    let newValue;
    switch (property) {
      case 'fontWeight': newValue = current === 'bold' ? 'normal' : 'bold'; break;
      case 'fontStyle': newValue = current === 'italic' ? 'normal' : 'italic'; break;
      case 'textDecoration': newValue = current === 'underline' ? 'none' : 'underline'; break;
      default: newValue = current;
    }
    
    // For toggle styles, we need to handle text selection differently
    if (selectedElement && selectedElement.type === 'text') {
      const textElement = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
      if (textElement) {
        const selection = window.getSelection();
        const hasSelection = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
        
        if (hasSelection && selection.anchorNode && textElement.contains(selection.anchorNode)) {
          // Apply formatting to selected text using execCommand for toggle styles
          textElement.focus();
          switch (property) {
            case 'fontWeight':
              document.execCommand('bold');
              break;
            case 'fontStyle':
              document.execCommand('italic');
              break;
            case 'textDecoration':
              document.execCommand('underline');
              break;
            default:
              break;
          }
          
          // Update the element content
          updateSlideElement(selectedElement.id, {
            content: textElement.innerHTML,
            [property]: newValue
          });
        } else {
          // No text selection, update element properties directly
          updateSlideElement(selectedElement.id, {
            [property]: newValue
          });
        }
      } else {
        // Fallback: update element properties directly
        updateSlideElement(selectedElement.id, {
          [property]: newValue
        });
      }
    }

    // Update the formatting state
    const newFormat = { ...textFormatting, [property]: newValue };
    setTextFormatting(newFormat);
  };

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60];
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Check if text formatting options should be shown
  const shouldShowTextFormatting = () => {
    return selectedElement && selectedElement.type === 'text';
  };

  const openDropdown = (e, type) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width
    });
    setActiveDropdown(type);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-trigger')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="toolbar">
      <div className="toolbar-top">
        <div 
          className="toolbar-logo"
          onClick={onBackToLanding}
          style={{ cursor: 'pointer' }}
          title="Back to Landing Page"
        >
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <polygon points="8,12 12,8 16,12" fill="currentColor"/>
            </svg>
          </div>
          Presentify
        </div>

        <div className="toolbar-actions">
          {/* Text Formatting Options - Only show when text is selected */}
          {shouldShowTextFormatting() && (
            <>
              {/* Font Family Dropdown */}
              <div className="custom-dropdown">
                <button
                  className="toolbar-button dropdown-trigger"
                  onClick={(e) => { e.stopPropagation(); openDropdown(e, "family"); }}
                  style={{
                    fontFamily: selectedElement?.fontFamily || textFormatting.fontFamily || 'Inter',
                    minWidth: "100px",
                  }}
                >
                  {selectedElement?.fontFamily || textFormatting.fontFamily || "Inter"}
                  <FiChevronDown size={14} />
                </button>
              </div>

              {/* Font Size Dropdown */}
              <div className="custom-dropdown">
                <button
                  className="toolbar-button dropdown-trigger"
                  onClick={(e) => { e.stopPropagation(); openDropdown(e, "size"); }}
                  style={{
                    minWidth: "50px",
                  }}
                >
                  {selectedElement?.fontSize || textFormatting.fontSize || 16}
                  <FiChevronDown size={14} />
                </button>
              </div>
            </>
          )}

          {/* Text Formatting Separator and Font Style - Only show when text is selected */}
          {shouldShowTextFormatting() && (
            <>
              {/* Separator */}
              <div className="formatting-separator">|</div>

              {/* Font Style */}
              <button className={`toolbar-button ${(selectedElement?.fontWeight || textFormatting.fontWeight) === 'bold' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleStyle('fontWeight'); }}>
                <FiBold size={14} />
              </button>
              <button className={`toolbar-button ${(selectedElement?.fontStyle || textFormatting.fontStyle) === 'italic' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleStyle('fontStyle'); }}>
                <FiItalic size={14} />
              </button>
              <button className={`toolbar-button ${(selectedElement?.textDecoration || textFormatting.textDecoration) === 'underline' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleStyle('textDecoration'); }}>
                <FiUnderline size={14} />
              </button>
            </>
          )}

          {/* Text Alignment - Only show when text is selected */}
          {shouldShowTextFormatting() && (
            <>
              {/* Separator */}
              <div className="formatting-separator">|</div>

              {/* Text Alignment */}
              <button className={`toolbar-button ${(selectedElement?.textAlign || textFormatting.textAlign) === 'left' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); applyFormat('textAlign', 'left'); }}>
                <FiAlignLeft size={14} />
              </button>
              <button className={`toolbar-button ${(selectedElement?.textAlign || textFormatting.textAlign) === 'center' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); applyFormat('textAlign', 'center'); }}>
                <FiAlignCenter size={14} />
              </button>
              <button className={`toolbar-button ${(selectedElement?.textAlign || textFormatting.textAlign) === 'right' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); applyFormat('textAlign', 'right'); }}>
                <FiAlignRight size={14} />
              </button>
              <button className={`toolbar-button ${(selectedElement?.textAlign || textFormatting.textAlign) === 'justify' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); applyFormat('textAlign', 'justify'); }}>
                <FiAlignJustify size={14} />
              </button>
            </>
          )}

          {/* Font Color - Only show when text is selected */}
          {shouldShowTextFormatting() && (
            <>
              {/* Separator */}
              <div className="formatting-separator">|</div>

              {/* Font Color */}
              <div className="color-button-container">
                <button 
                  className="toolbar-button" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
                    
                    // Store current selection before opening color picker
                    if (selectedElement && selectedElement.type === 'text') {
                      const textElement = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
                      if (textElement) {
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed) {
                          // Store the selection
                          window.__PRESENTIFY_SELECTION__ = {
                            element: textElement,
                            range: selection.getRangeAt(0).cloneRange()
                          };
                        }
                      }
                    }
                    
                    const colorInput = e.currentTarget.parentElement.querySelector('.color-picker');
                    if (colorInput) {
                      colorInput.click();
                    }
                  }}
                >
                  <span style={{ 
                    fontWeight: 'bold', 
                    textDecoration: 'underline', 
                    color: '#dc2626',
                    fontSize: '12px'
                  }}>
                    A
                  </span>
                </button>
                <input 
                  type="color" 
                  value={selectedElement?.color || textFormatting.color || '#000000'} 
                  onChange={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
                    
                    // Restore selection before applying format
                    restoreSelection();
                    applyFormat('color', e.target.value); 
                  }} 
                  onClick={(e) => e.stopPropagation()}
                  className="color-picker" 
                />
              </div>
            </>
          )}

          {/* Separator for general actions */}
          <div className="formatting-separator">|</div>

          {/* General Actions - Always visible */}
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
        </div>
      </div>

      {/* Portal Dropdown */}
      {activeDropdown && createPortal(
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 999999,
          }}
        >
          {(activeDropdown === "family"
            ? ["Inter", "Playfair Display", "Arial", "Times New Roman", "Courier New"]
            : [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 80, 120, 200]
          ).map((item) => (
            <div
              key={item}
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                applyFormat(
                  activeDropdown === "family" ? "fontFamily" : "fontSize",
                  activeDropdown === "family" ? item : parseInt(item)
                );
                setActiveDropdown(null);
              }}
              style={{
                fontFamily: activeDropdown === "family" ? item : "inherit",
              }}
            >
              {item}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Toolbar;