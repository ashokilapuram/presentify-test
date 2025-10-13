import React, { useState } from 'react';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight,
  FiAlignJustify,
  FiList,
  FiType,
  FiRotateCcw,
  FiRotateCw,
  FiPrinter,
  FiShare2,
  FiUser,
  FiSquare,
  FiCircle,
  FiImage,
  FiPlay,
  FiLayout
} from 'react-icons/fi';

const Toolbar = ({ 
  textFormatting, 
  setTextFormatting, 
  selectedElement, 
  updateSlideElement, 
  addTextBox,
  addShape,
  addImage,
  onShowTemplates,
  onActiveTabChange
}) => {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onActiveTabChange) {
      onActiveTabChange(tab);
    }
  };

  const tabs = ['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Review', 'View'];

  const handleFormatChange = (property, value) => {
    const newFormatting = { ...textFormatting, [property]: value };
    setTextFormatting(newFormatting);
    
    if (selectedElement) {
      updateSlideElement(selectedElement.id, { [property]: value });
    }
  };

  const toggleFormat = (property) => {
    const currentValue = textFormatting[property];
    let newValue;
    
    switch (property) {
      case 'fontWeight':
        newValue = currentValue === 'bold' ? 'normal' : 'bold';
        break;
      case 'fontStyle':
        newValue = currentValue === 'italic' ? 'normal' : 'italic';
        break;
      case 'textDecoration':
        newValue = currentValue === 'underline' ? 'none' : 'underline';
        break;
      default:
        newValue = currentValue;
    }
    
    handleFormatChange(property, newValue);
  };

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  const renderFormattingContent = () => {
    if (activeTab === 'Home') {
      return (
        <div className="toolbar-formatting">
          <div className="formatting-group">
            <select
              className="formatting-select"
              value="Paragraph"
              onChange={() => {}}
            >
              <option>Paragraph</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Title</option>
            </select>
            <select
              className="formatting-select"
              value={textFormatting.fontSize}
              onChange={(e) => handleFormatChange('fontSize', parseInt(e.target.value))}
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="formatting-group">
            <button
              className={`formatting-button ${textFormatting.fontWeight === 'bold' ? 'active' : ''}`}
              onClick={() => toggleFormat('fontWeight')}
              title="Bold (Ctrl+B)"
            >
              <FiBold />
            </button>
            <button
              className={`formatting-button ${textFormatting.fontStyle === 'italic' ? 'active' : ''}`}
              onClick={() => toggleFormat('fontStyle')}
              title="Italic (Ctrl+I)"
            >
              <FiItalic />
            </button>
            <button
              className={`formatting-button ${textFormatting.textDecoration === 'underline' ? 'active' : ''}`}
              onClick={() => toggleFormat('textDecoration')}
              title="Underline (Ctrl+U)"
            >
              <FiUnderline />
            </button>
          </div>

          <div className="formatting-group">
            <input
              type="color"
              value={textFormatting.color}
              onChange={(e) => handleFormatChange('color', e.target.value)}
              className="color-picker"
              title="Text Color"
            />
            <button className="formatting-button">
              <span style={{ textDecoration: 'underline' }}>A</span>
            </button>
          </div>

          <div className="formatting-group">
            <button
              className={`formatting-button ${textFormatting.textAlign === 'left' ? 'active' : ''}`}
              onClick={() => handleFormatChange('textAlign', 'left')}
              title="Align Left"
            >
              <FiAlignLeft />
            </button>
            <button
              className={`formatting-button ${textFormatting.textAlign === 'center' ? 'active' : ''}`}
              onClick={() => handleFormatChange('textAlign', 'center')}
              title="Align Center"
            >
              <FiAlignCenter />
            </button>
            <button
              className={`formatting-button ${textFormatting.textAlign === 'right' ? 'active' : ''}`}
              onClick={() => handleFormatChange('textAlign', 'right')}
              title="Align Right"
            >
              <FiAlignRight />
            </button>
            <button
              className={`formatting-button ${textFormatting.textAlign === 'justify' ? 'active' : ''}`}
              onClick={() => handleFormatChange('textAlign', 'justify')}
              title="Justify"
            >
              <FiAlignJustify />
            </button>
          </div>

          <div className="formatting-group">
            <button className="formatting-button" title="Bullet List">
              <FiList />
            </button>
            <button className="formatting-button" onClick={addTextBox} title="Add Text Box (Ctrl+T)">
              <FiType />
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'Insert') {
      return (
        <div className="toolbar-formatting">
          <div className="formatting-group">
            <button className="formatting-button primary" onClick={onShowTemplates}>
              <FiLayout />
              Templates
            </button>
          </div>
          <div className="formatting-group">
            <button className="formatting-button" onClick={addTextBox}>
              <FiType />
              Text Box
            </button>
          </div>
          <div className="formatting-group">
            <button className="formatting-button" onClick={() => addShape && addShape('rectangle')}>
              <FiSquare />
            </button>
            <button className="formatting-button" onClick={() => addShape && addShape('circle')}>
              <FiCircle />
            </button>
          </div>
          <div className="formatting-group">
            <button className="formatting-button" onClick={() => addImage && addImage()}>
              <FiImage />
              Image
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'Slide Show') {
      return (
        <div className="toolbar-formatting">
          <div className="formatting-group">
            <button className="formatting-button primary">
              <FiPlay />
              Start Slideshow
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'View') {
      return (
        <div className="toolbar-formatting">
          <div className="formatting-group">
            <button className="formatting-button">
              Normal View
            </button>
            <button className="formatting-button">
              Slide Sorter
            </button>
            <button className="formatting-button">
              Reading View
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="toolbar">
      <div className="toolbar-top">
        <div className="toolbar-logo">
          <span style={{ color: '#2d9cdb' }}>📊</span>
          Presentify
        </div>
        
          <div className="toolbar-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`toolbar-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
        </div>

        <div className="toolbar-actions">
          <button className="toolbar-button">
            <FiRotateCcw size={16} />
          </button>
          <button className="toolbar-button">
            <FiRotateCw size={16} />
          </button>
          <button className="toolbar-button">
            <FiPrinter size={16} />
          </button>
          <button className="toolbar-button primary">
            <FiShare2 size={16} />
            Share
          </button>
          <div className="toolbar-user">
            <FiUser size={20} />
          </div>
        </div>
      </div>
      
      <div className="toolbar-bottom">
        <div className="toolbar-formatting-wrapper">
          {renderFormattingContent()}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
