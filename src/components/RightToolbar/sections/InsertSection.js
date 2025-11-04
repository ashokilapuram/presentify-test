import React from 'react';
import { 
  FiType, 
  FiSquare, 
  FiCircle, 
  FiTriangle, 
  FiStar,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiImage
} from 'react-icons/fi';

const InsertSection = ({ addTextBox, addShape, addChart, addImage }) => {
  return (
    <div className="right-toolbar-section">
      <div className="section-title">Text elements</div>
      <div className="text-elements-row">
        <button className="text-element-button" onClick={() => addTextBox('title')}>
          <FiType />
          <span>Title</span>
        </button>
        <button className="text-element-button" onClick={() => addTextBox('subtitle')}>
          <FiType />
          <span>Subtitle</span>
        </button>
        <button className="text-element-button" onClick={() => addTextBox('content')}>
          <FiType />
          <span>Content</span>
        </button>
      </div>

      <div className="section-title">Shapes</div>
      <div className="shapes-row">
        <button className="shape-icon-button" onClick={() => addShape('square')} title="Square (resizable)">
          <FiSquare />
        </button>
        <button className="shape-icon-button" onClick={() => addShape('circle')}>
          <FiCircle />

        </button>
        <button className="shape-icon-button" onClick={() => addShape('triangle')}>
          <FiTriangle />
        </button>
        <button className="shape-icon-button" onClick={() => addShape('star')}>
          <FiStar />
        </button>
      </div>

      <div className="section-title">Charts</div>
      <div className="charts-row">
        <button className="chart-element-button" onClick={() => addChart('bar')}>
          <FiBarChart2 />
          <span>Bar</span>
        </button>
        <button className="chart-element-button" onClick={() => addChart('line')}>
          <FiTrendingUp />
          <span>Line</span>
        </button>
        <button className="chart-element-button" onClick={() => addChart('pie')}>
          <FiPieChart />
          <span>Pie</span>
        </button>
      </div>

      <div className="section-title">Media</div>
      <div className="media-row">
        <button className="media-element-button" onClick={addImage}>
          <FiImage />
          <span>Image</span>
        </button>
      </div>
    </div>
  );
};

export default InsertSection;


