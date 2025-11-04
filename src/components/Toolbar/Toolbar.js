import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
  FiAlignRight, FiAlignJustify, FiMaximize2, FiPlay, FiType, FiArrowLeft,
  FiChevronDown, FiDownload
} from 'react-icons/fi';
import { Undo, Redo, RotateCw, MoveHorizontal, List, ListOrdered } from 'lucide-react';
import './Toolbar.css';

const Toolbar = ({
  textFormatting,
  setTextFormatting,
  selectedElement,
  updateSlideElement,
  onShowTemplates,
  onActiveTabChange,
  onStartFullScreenSlideshow,
  onDownloadPresentation,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  slides,
  onBackToLanding,
  setShowDragMessage,
  onReset
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

  // Utility function to normalize list text - removes all existing markers before applying new ones
  const normalizeListText = (text, newType) => {
    const lines = text.split('\n');
    
    // First, check if text already has the correct markers for bullets
    if (newType === 'bullet') {
      const alreadyFormatted = lines.every(line => {
        if (!line.trim()) return true; // empty line is fine
        return line.match(/^[\u2022•]\s*/);
      });
      if (alreadyFormatted) {
        return text; // Already properly formatted
      }
    }
    
    // For numbers, check if all lines are numbered (but we'll still renumber to fix sequences)
    // Remove any existing markers (bullet •, number 1., or any combination)
    const cleanedLines = lines
      .map(line => line.replace(/^(\s*[\u2022•]\s*|\s*\d+\.\s*)/, ''));

    if (newType === 'bullet') {
      return cleanedLines
        .map(line => (line.trim() ? `• ${line}` : line))
        .join('\n');
    }
    if (newType === 'number') {
      return cleanedLines
        .map((line, idx) => {
          if (line.trim()) {
            return `${idx + 1}. ${line}`;
          }
          return line;
        })
        .join('\n');
    }
    return cleanedLines.join('\n'); // for 'none'
  };

  const toggleListType = () => {
    const order = ['none', 'bullet', 'number'];
    const current = selectedElement?.listType || textFormatting.listType || 'none';
    const next = order[(order.indexOf(current) + 1) % order.length];
    
    // Simply update listType - EditableTextBox will handle the formatting on render
    if (selectedElement?.id) {
      updateSlideElement(selectedElement.id, { listType: next });
    }

    // Update the formatting state
    const newFormat = { ...textFormatting, listType: next };
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

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 80, 120, 200];
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);

  // 🔄 Keep toolbar in sync when a new textbox is selected
  useEffect(() => {
    if (selectedElement && selectedElement.type === 'text') {
      setTextFormatting(prev => ({
        ...prev,
        letterSpacing: selectedElement.letterSpacing ?? 0,
        lineHeight: selectedElement.lineHeight ?? 1.2,
        textTransform: selectedElement.textTransform ?? 'none',
        listType: selectedElement.listType ?? 'none',
      }));
    } else {
      // Reset to default values when no text element is selected
      setTextFormatting(prev => ({
        ...prev,
        letterSpacing: 0,
        lineHeight: 1.2,
        textTransform: 'none',
        listType: 'none',
      }));
    }
  }, [selectedElement]);

  // Increase font size
  const increaseFontSize = () => {
    const currentSize = selectedElement?.fontSize || textFormatting.fontSize || 16;
    const currentIndex = fontSizes.indexOf(currentSize);
    const nextSize = currentIndex >= 0 && currentIndex < fontSizes.length - 1 
      ? fontSizes[currentIndex + 1] 
      : currentSize + 2;
    applyFormat('fontSize', nextSize);
  };

  // Decrease font size
  const decreaseFontSize = () => {
    const currentSize = selectedElement?.fontSize || textFormatting.fontSize || 16;
    const currentIndex = fontSizes.indexOf(currentSize);
    const prevSize = currentIndex > 0 
      ? fontSizes[currentIndex - 1] 
      : Math.max(8, currentSize - 2);
    applyFormat('fontSize', prevSize);
  };

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
            <div className="format-container">
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

              {/* Font Size Controls */}
              <div className="font-size-controls">
                <button
                  className="toolbar-button font-size-btn"
                  onClick={(e) => { e.stopPropagation(); decreaseFontSize(); }}
                  title="Decrease font size"
                >
                  -
                </button>
                <span className="font-size-display">
                  {selectedElement?.fontSize || textFormatting.fontSize || 16}
                </span>
                <button
                  className="toolbar-button font-size-btn"
                  onClick={(e) => { e.stopPropagation(); increaseFontSize(); }}
                  title="Increase font size"
                >
                  +
                </button>
              </div>

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

              {/* Separator */}
              <div className="formatting-separator">|</div>

              {/* === CANVA-STYLE FORMATTING OPTIONS === */}

              {/* ① Alignment Toggle (4 icons cycling) */}
              <button
                className="toolbar-button"
                title="Toggle text alignment"
                onClick={(e) => {
                  e.stopPropagation();
                  const order = ['left', 'center', 'right', 'justify'];
                  const current = selectedElement?.textAlign || textFormatting.textAlign || 'left';
                  const next = order[(order.indexOf(current) + 1) % order.length];
                  applyFormat('textAlign', next);
                }}
              >
                {(() => {
                  const current = selectedElement?.textAlign || textFormatting.textAlign || 'left';
                  switch (current) {
                    case 'center': return <FiAlignCenter size={16} />;
                    case 'right': return <FiAlignRight size={16} />;
                    case 'justify': return <FiAlignJustify size={16} />;
                    default: return <FiAlignLeft size={16} />;
                  }
                })()}
              </button>

              {/* ② List Toggle Button */}
              <button
                className={`toolbar-button ${(selectedElement?.listType || textFormatting.listType) !== 'none' ? 'active' : ''}`}
                title={
                  (selectedElement?.listType || textFormatting.listType) === 'none'
                    ? 'Bullet List'
                    : (selectedElement?.listType || textFormatting.listType) === 'bullet'
                    ? 'Numbered List'
                    : 'Turn Off List'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  toggleListType();
                }}
              >
                {(() => {
                  const current = selectedElement?.listType || textFormatting.listType || 'none';
                  if (current === 'none') {
                    return <List size={16} strokeWidth={2} />;
                  } else if (current === 'bullet') {
                    return <List size={16} strokeWidth={2} />;
                  } else {
                    return <ListOrdered size={16} strokeWidth={2} />;
                  }
                })()}
              </button>

              {/* ③ Text Spacing Dropdown (A above MoveHorizontal icon) */}
              <div className="custom-dropdown">
                <button
                  className="toolbar-button dropdown-trigger text-spacing-btn"
                  title="Text Spacing"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDropdownPos({
                      top: rect.bottom + window.scrollY + 4,
                      left: rect.left + window.scrollX,
                      width: rect.width,
                    });
                    setActiveDropdown('spacing');
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      fontWeight: 600,
                      gap: '0px',
                      margin: '0',
                      padding: '0',
                    }}
                  >
                    <span style={{ fontSize: '11px', marginBottom: '0px', padding: '0', lineHeight: '1', transform: 'translateY(2px)' }}>A</span>
                    <MoveHorizontal size={15} strokeWidth={2.2} style={{ margin: '0', padding: '0' }} />
                  </div>
                </button>
              </div>

              {/* ④ Capitalize Toggle (Aa) */}
              <button
                className="toolbar-button"
                title="Toggle Uppercase / Lowercase"
                onClick={(e) => {
                  e.stopPropagation();
                  const current = selectedElement?.textTransform || textFormatting.textTransform || 'none';
                  // Toggle between uppercase and lowercase only, skip 'none'
                  const next = current === 'uppercase' ? 'lowercase' : 'uppercase';
                  applyFormat('textTransform', next);
                }}
              >
                <span style={{ fontWeight: 600 }}>Aa</span>
              </button>

              {/* Separator */}
              <div className="formatting-separator">|</div>

              {/* Font Color */}
              <div className="color-button-container">
                <button 
                  className="font-color-btn" 
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
                  <span className="font-color-btn__label">A</span>
                  <span className="font-color-btn__swatch"></span>
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
            </div>
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
            onClick={toggleFullscreen}
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
        </div>
      </div>

      {/* Portal Dropdown */}
      {activeDropdown && activeDropdown !== 'spacing' && createPortal(
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

      {/* Text Spacing Dropdown */}
      {activeDropdown === 'spacing' && createPortal(
        <div className="dropdown-menu" style={{
          position: 'absolute',
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: 180,
          zIndex: 999999,
        }}>
          <div className="dropdown-item">
            <span>Letter spacing</span>
            <div className="spacing-controls">
              <button onClick={(e) => {
                e.stopPropagation();
                applyFormat('letterSpacing', Math.max(0, (selectedElement?.letterSpacing || textFormatting.letterSpacing || 0) - 1));
              }}>–</button>
              <span>{selectedElement?.letterSpacing || textFormatting.letterSpacing || 0}</span>
              <button onClick={(e) => {
                e.stopPropagation();
                applyFormat('letterSpacing', (selectedElement?.letterSpacing || textFormatting.letterSpacing || 0) + 1);
              }}>+</button>
            </div>
          </div>
          <div className="dropdown-item">
            <span>Line spacing</span>
            <div className="spacing-controls">
              <button onClick={(e) => {
                e.stopPropagation();
                applyFormat('lineHeight', Math.max(0.8, (selectedElement?.lineHeight || textFormatting.lineHeight || 1.2) - 0.1));
              }}>–</button>
              <span>{(selectedElement?.lineHeight || textFormatting.lineHeight || 1.2).toFixed(1)}</span>
              <button onClick={(e) => {
                e.stopPropagation();
                applyFormat('lineHeight', (selectedElement?.lineHeight || textFormatting.lineHeight || 1.2) + 0.1);
              }}>+</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Toolbar;