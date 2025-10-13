import React from 'react';
import './RightToolbar.css';
import { 
  FiType, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight,
  FiAlignJustify,
  FiBold,
  FiItalic,
  FiUnderline,
  FiEye,
  FiEyeOff,
  FiRotateCw,
  FiRotateCcw,
  FiCopy,
  FiTrash2,
  FiLayers,
  FiMove,
  FiSquare,
  FiCircle,
  FiImage,
  FiVideo,
  FiMusic,
  FiBarChart2,
  FiPieChart,
  FiTable,
  FiCalendar,
  FiMap,
  FiStar,
  FiHeart,
  FiSmile,
  FiTrendingUp,
  FiZap,
  FiSun,
  FiMoon,
  FiDroplet,
  FiFeather
} from 'react-icons/fi';

const RightToolbar = ({ 
  activeTab, 
  selectedElement, 
  textFormatting, 
  setTextFormatting, 
  updateSlideElement,
  addTextBox,
  addShape,
  addImage
}) => {
  
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

  const renderHomeOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Text Formatting</div>
      <div className="option-group">
        <div className="option-row">
          <button
            className={`option-button ${textFormatting.fontWeight === 'bold' ? 'active' : ''}`}
            onClick={() => toggleFormat('fontWeight')}
            title="Bold"
          >
            <FiBold />
          </button>
          <button
            className={`option-button ${textFormatting.fontStyle === 'italic' ? 'active' : ''}`}
            onClick={() => toggleFormat('fontStyle')}
            title="Italic"
          >
            <FiItalic />
          </button>
          <button
            className={`option-button ${textFormatting.textDecoration === 'underline' ? 'active' : ''}`}
            onClick={() => toggleFormat('textDecoration')}
            title="Underline"
          >
            <FiUnderline />
          </button>
        </div>
        
        <div className="option-row">
          <button
            className={`option-button ${textFormatting.textAlign === 'left' ? 'active' : ''}`}
            onClick={() => handleFormatChange('textAlign', 'left')}
            title="Align Left"
          >
            <FiAlignLeft />
          </button>
          <button
            className={`option-button ${textFormatting.textAlign === 'center' ? 'active' : ''}`}
            onClick={() => handleFormatChange('textAlign', 'center')}
            title="Align Center"
          >
            <FiAlignCenter />
          </button>
          <button
            className={`option-button ${textFormatting.textAlign === 'right' ? 'active' : ''}`}
            onClick={() => handleFormatChange('textAlign', 'right')}
            title="Align Right"
          >
            <FiAlignRight />
          </button>
        </div>
      </div>

      <div className="section-title">Font Size</div>
      <div className="option-group">
        <input
          type="range"
          min="8"
          max="72"
          value={textFormatting.fontSize}
          onChange={(e) => handleFormatChange('fontSize', parseInt(e.target.value))}
          className="size-slider"
        />
        <div className="size-display">{textFormatting.fontSize}px</div>
      </div>

      <div className="section-title">Text Color</div>
      <div className="option-group">
        <input
          type="color"
          value={textFormatting.color}
          onChange={(e) => handleFormatChange('color', e.target.value)}
          className="color-input"
        />
      </div>

      {selectedElement && (
        <>
          <div className="section-title">Element Actions</div>
          <div className="option-group">
            <button className="action-button">
              <FiCopy />
              Duplicate
            </button>
            <button className="action-button danger">
              <FiTrash2 />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderInsertOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Text Elements</div>
      <div className="option-group">
        <button className="insert-button" onClick={addTextBox}>
          <FiType />
          <span>Text Box</span>
        </button>
      </div>

      <div className="section-title">Shapes</div>
      <div className="option-group">
        <div className="shape-grid">
          <button className="shape-button" onClick={() => addShape('rectangle')}>
            <FiSquare />
          </button>
          <button className="shape-button" onClick={() => addShape('circle')}>
            <FiCircle />
          </button>
        </div>
      </div>

      <div className="section-title">Media</div>
      <div className="option-group">
        <button className="insert-button" onClick={addImage}>
          <FiImage />
          <span>Image</span>
        </button>
        <button className="insert-button">
          <FiVideo />
          <span>Video</span>
        </button>
        <button className="insert-button">
          <FiMusic />
          <span>Audio</span>
        </button>
      </div>

      <div className="section-title">Charts</div>
      <div className="option-group">
        <button className="insert-button">
          <FiBarChart2 />
          <span>Bar Chart</span>
        </button>
        <button className="insert-button">
          <FiPieChart />
          <span>Pie Chart</span>
        </button>
        <button className="insert-button">
          <FiTrendingUp />
          <span>Line Chart</span>
        </button>
      </div>

      <div className="section-title">Other</div>
      <div className="option-group">
        <button className="insert-button">
          <FiTable />
          <span>Table</span>
        </button>
        <button className="insert-button">
          <FiCalendar />
          <span>Calendar</span>
        </button>
        <button className="insert-button">
          <FiMap />
          <span>Map</span>
        </button>
      </div>
    </div>
  );

  const renderDesignOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Themes</div>
      <div className="option-group">
        <div className="theme-grid">
          <div className="theme-option modern">
            <div className="theme-preview"></div>
            <span>Modern</span>
          </div>
          <div className="theme-option classic">
            <div className="theme-preview"></div>
            <span>Classic</span>
          </div>
          <div className="theme-option minimal">
            <div className="theme-preview"></div>
            <span>Minimal</span>
          </div>
          <div className="theme-option dark">
            <div className="theme-preview"></div>
            <span>Dark</span>
          </div>
        </div>
      </div>

      <div className="section-title">Colors</div>
      <div className="option-group">
        <div className="color-palette">
          <div className="color-swatch" style={{ backgroundColor: '#0ea5e9' }}></div>
          <div className="color-swatch" style={{ backgroundColor: '#8b5cf6' }}></div>
          <div className="color-swatch" style={{ backgroundColor: '#10b981' }}></div>
          <div className="color-swatch" style={{ backgroundColor: '#f59e0b' }}></div>
          <div className="color-swatch" style={{ backgroundColor: '#f43f5e' }}></div>
          <div className="color-swatch" style={{ backgroundColor: '#6b7280' }}></div>
        </div>
      </div>

      <div className="section-title">Fonts</div>
      <div className="option-group">
        <select className="font-select">
          <option value="Inter">Inter</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="JetBrains Mono">JetBrains Mono</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>
    </div>
  );

  const renderViewOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">View Options</div>
      <div className="option-group">
        <button className="view-button active">
          <FiEye />
          <span>Show Grid</span>
        </button>
        <button className="view-button">
          <FiEyeOff />
          <span>Hide Guides</span>
        </button>
      </div>

      <div className="section-title">Zoom</div>
      <div className="option-group">
        <input
          type="range"
          min="25"
          max="200"
          defaultValue="100"
          className="zoom-slider"
        />
        <div className="zoom-display">100%</div>
      </div>

      <div className="section-title">Layers</div>
      <div className="option-group">
        <button className="layer-button">
          <FiLayers />
          <span>Bring Forward</span>
        </button>
        <button className="layer-button">
          <FiLayers />
          <span>Send Backward</span>
        </button>
      </div>
    </div>
  );

  const renderDefaultOptions = () => (
    <div className="right-toolbar-section">
      <div className="section-title">Quick Actions</div>
      <div className="option-group">
        <button className="quick-button" onClick={addTextBox}>
          <FiType />
          <span>Add Text</span>
        </button>
        <button className="quick-button" onClick={() => addShape('rectangle')}>
          <FiSquare />
          <span>Add Shape</span>
        </button>
        <button className="quick-button" onClick={addImage}>
          <FiImage />
          <span>Add Image</span>
        </button>
      </div>

      <div className="section-title">Properties</div>
      <div className="option-group">
        {selectedElement ? (
          <div className="element-info">
            <div className="info-row">
              <span>Type:</span>
              <span>{selectedElement.type}</span>
            </div>
            <div className="info-row">
              <span>X:</span>
              <span>{Math.round(selectedElement.x)}px</span>
            </div>
            <div className="info-row">
              <span>Y:</span>
              <span>{Math.round(selectedElement.y)}px</span>
            </div>
            <div className="info-row">
              <span>Width:</span>
              <span>{Math.round(selectedElement.width)}px</span>
            </div>
            <div className="info-row">
              <span>Height:</span>
              <span>{Math.round(selectedElement.height)}px</span>
            </div>
          </div>
        ) : (
          <div className="no-selection">
            No element selected
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return renderHomeOptions();
      case 'Insert':
        return renderInsertOptions();
      case 'Design':
        return renderDesignOptions();
      case 'View':
        return renderViewOptions();
      default:
        return renderDefaultOptions();
    }
  };

  return (
    <div className="right-toolbar">
      <div className="right-toolbar-header">
        <h3 className="toolbar-title">{activeTab} Options</h3>
      </div>
      <div className="right-toolbar-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default RightToolbar;
