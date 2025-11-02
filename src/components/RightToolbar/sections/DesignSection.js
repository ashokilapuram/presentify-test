import React from 'react';
import { FiImage, FiDroplet } from 'react-icons/fi';
import { Palette, Trash2 } from 'lucide-react';
import SectionTitle from '../shared/SectionTitle';

const DesignSection = ({ updateSlide, currentSlide }) => {
  const themes = [
    { id: 1, src: '/images/themes/theme1.jpg', alt: 'Theme 1' },
    { id: 2, src: '/images/themes/theme2.jpg', alt: 'Theme 2' },
    { id: 3, src: '/images/themes/theme3.jpg', alt: 'Theme 3' },
    { id: 4, src: '/images/themes/theme4.jpg', alt: 'Theme 4' },
    { id: 5, src: '/images/themes/theme5.jpg', alt: 'Theme 5' },
    { id: 6, src: '/images/themes/theme6.jpg', alt: 'Theme 6' },
  ];

  const backgroundColors = [
    { color: '#ffffff', title: 'White' },
    { color: '#f3f4f6', title: 'Light Gray' },
    { color: '#0ea5e9', title: 'Sky Blue' },
    { color: '#1e293b', title: 'Dark Slate' },
    { color: '#8b5cf6', title: 'Purple' },
    { color: '#10b981', title: 'Emerald' },
    { color: '#f59e0b', title: 'Amber' },
    { color: '#f43f5e', title: 'Rose' },
  ];

  const applyTheme = (themeSrc) => {
    updateSlide && updateSlide({
      backgroundImage: themeSrc,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    });
  };

  const applyBackgroundColor = (color) => {
    updateSlide && updateSlide({
      backgroundColor: color,
      backgroundImage: null,
      backgroundSize: null,
      backgroundPosition: null,
      backgroundRepeat: null
    });
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
  };

  return (
    <div className="right-toolbar-section">
      <div className="section-title">Themes</div>
      <div className="theme-images-grid">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="theme-image-placeholder"
            onClick={() => applyTheme(theme.src)}
          >
            <img
              src={theme.src}
              alt={theme.alt}
              className="theme-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="theme-fallback" style={{ display: 'none' }}>
              <FiImage style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
            </div>
          </div>
        ))}
      </div>

      <SectionTitle icon={<FiDroplet />} text="Background" />
      <div className="option-group">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Quick Colors Grid */}
          <div className="quick-colors-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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

          {/* Color Picker, Image Upload, and Delete */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px' }}>
              <input
                type="color"
                value={currentSlide?.backgroundColor || '#ffffff'}
                onChange={(e) => {
                  e.stopPropagation();
                  applyBackgroundColor(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                data-design-section-color-picker="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2
                }}
                title="Pick custom color"
              />
              <div style={{
                width: '36px',
                height: '36px',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Palette size={16} />
              </div>
            </div>
            <button
              onClick={handleImageUpload}
              style={{
                width: '36px',
                height: '36px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '16px',
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
                width: '36px',
                height: '36px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                fontSize: '16px',
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
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSection;

