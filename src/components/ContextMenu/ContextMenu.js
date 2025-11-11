import React, { useEffect, useRef } from 'react';
import { FiImage, FiDroplet } from 'react-icons/fi';
import { Palette, Trash2 } from 'lucide-react';
import './ContextMenu.css';

const ContextMenu = ({ 
  visible, 
  position, 
  onClose, 
  currentSlide, 
  updateSlide,
  onOpenDesignTab
}) => {
  const menuRef = useRef(null);

  const backgroundColors = [
    { color: '#ffffff', title: 'White' },
    { color: '#f3f4f6', title: 'Light Gray' },
    { color: '#0ea5e9', title: 'Sky Blue' },
    { color: '#1e293b', title: 'Dark Slate' },
    { color: '#8b5cf6', title: 'Purple' },
    { color: '#10b981', title: 'Emerald' },
    { color: '#f59e0b', title: 'Amber' },
    { color: '#f43f5e', title: 'Rose' },
    { color: '#ec4899', title: 'Pink' },
    { color: '#6366f1', title: 'Indigo' },
  ];

  // Close menu when clicking outside - works for clicks on toolbar, sidebar, anywhere
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        // Don't close if clicking on color picker dropdown (native browser UI)
        // Check if the target is within a color input or its parent
        let target = e.target;
        let isColorPicker = false;
        
        // Traverse up the DOM tree to check if we're in a color picker
        while (target && target !== document.body) {
          if (target.tagName === 'INPUT' && target.type === 'color') {
            isColorPicker = true;
            break;
          }
          target = target.parentElement;
        }
        
        // Additional check: if color picker is active (has focus), don't close
        const activeColorInput = document.activeElement;
        if (activeColorInput && activeColorInput.type === 'color') {
          isColorPicker = true;
        }
        
        if (!isColorPicker) {
          onClose();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Use setTimeout to avoid immediate closure on the click that opened the menu
    const timeoutId = setTimeout(() => {
      // Listen to all clicks and context menu clicks anywhere on the page
      // Use capture phase to catch events early
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('contextmenu', handleClickOutside, true);
      // Also listen to mouseup in case color picker needs it
      document.addEventListener('mouseup', handleClickOutside, true);
    }, 0);

    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('contextmenu', handleClickOutside, true);
      document.removeEventListener('mouseup', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  // Position menu
  useEffect(() => {
    if (!visible || !menuRef.current || !position) return;

    const menu = menuRef.current;
    const { x, y } = position;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get menu dimensions
    const menuRect = menu.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;

    // Calculate position with boundary checks
    let left = x;
    let top = y;

    // Adjust if menu would go off right edge
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 10;
    }

    // Adjust if menu would go off bottom edge
    if (top + menuHeight > viewportHeight) {
      top = viewportHeight - menuHeight - 10;
    }

    // Ensure menu stays within viewport
    left = Math.max(10, left);
    top = Math.max(10, top);

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }, [visible, position]);

  if (!visible || !position) return null;

  const applyBackgroundColor = (color) => {
    updateSlide && updateSlide({
      backgroundColor: color,
      backgroundImage: null,
      backgroundSize: null,
      backgroundPosition: null,
      backgroundRepeat: null
    });
    onClose();
  };

  const handleImageUpload = (e) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateSlide && updateSlide({ backgroundImage: ev.target.result });
      };
      reader.readAsDataURL(file);
    };
    input.click();
    onClose();
  };

  const clearBackground = (e) => {
    e.stopPropagation();
    updateSlide && updateSlide({
      backgroundColor: undefined,
      backgroundImage: null,
      backgroundSize: null,
      backgroundPosition: null,
      backgroundRepeat: null
    });
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="context-menu"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="context-menu-section">
        <div className="context-menu-title">
          <FiDroplet style={{ marginRight: 8 }} />
          Background
        </div>
        <div className="context-menu-colors-container">
          <div className="quick-colors-grid">
            {backgroundColors.map(({ color, title }) => (
              <div
                key={color}
                className="color-swatch-small"
                style={{
                  backgroundColor: color,
                  ...(color === '#ffffff' && { border: '1.5px solid #e5e7eb' })
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  applyBackgroundColor(color);
                }}
                title={title}
              />
            ))}
          </div>
          <div className="context-menu-buttons-row">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                // Open Design tab in RightToolbar
                if (onOpenDesignTab) {
                  onOpenDesignTab();
                }
              }}
              style={{
                width: '32px',
                height: '32px',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
              title="Open color picker in Design tab"
            >
              <Palette size={14} />
            </button>
            <button
              onClick={handleImageUpload}
              style={{
                width: '32px',
                height: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
              title="Upload background image"
            >
              <FiImage />
            </button>
            <button
              onClick={clearBackground}
              style={{
                width: '32px',
                height: '32px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
              title="Remove background"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      </div>
  );
};

export default ContextMenu;

