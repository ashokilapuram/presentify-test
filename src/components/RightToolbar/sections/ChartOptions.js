import React, { useState } from 'react';
import LayerActions from '../shared/LayerActions';
import ChartDataModal from '../../ChartDataModal/ChartDataModal';
import ChartNameInput from './components/ChartNameInput';
import PieChartDataPoints from './components/PieChartDataPoints';
import BarLineColorPalettes from './components/BarLineColorPalettes';
import ChartOptionsControls from './components/ChartOptionsControls';
import { getBarColor, handleBarColorChange, removeDataPoint, addDataPoint } from './utils/chartHelpers';

const ChartOptions = ({
  selectedElement,
  updateSlideElement,
  bringForward,
  bringToFront,
  sendBackward,
  sendToBack,
  updateSlide,
  currentSlide,
  deleteElement
}) => {
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [modalInitialPosition, setModalInitialPosition] = useState(null);
  
  const handleSaveData = (updates) => {
    updateSlideElement(selectedElement.id, updates);
  };

  const handleEditDataClick = (position) => {
    setModalInitialPosition(position);
    setIsDataModalOpen(true);
  };

  // Helper functions that use the selectedElement
  const getBarColorForIndex = (index) => getBarColor(selectedElement, index);
  const handleBarColorChangeForIndex = (index, color) => handleBarColorChange(selectedElement, updateSlideElement, index, color);
  const removeDataPointAtIndex = (index) => removeDataPoint(selectedElement, updateSlideElement, index);
  const addDataPointHandler = () => addDataPoint(selectedElement, updateSlideElement);

  return (
    <div className="right-toolbar-section">
      <ChartNameInput
        selectedElement={selectedElement}
        updateSlideElement={updateSlideElement}
        onEditDataClick={handleEditDataClick}
      />

      {/* Data points - Only for pie charts */}
      {selectedElement.chartType === 'pie' && (
        <PieChartDataPoints
          selectedElement={selectedElement}
          updateSlideElement={updateSlideElement}
          getBarColor={getBarColorForIndex}
          handleBarColorChange={handleBarColorChangeForIndex}
          removeDataPoint={removeDataPointAtIndex}
          addDataPoint={addDataPointHandler}
        />
      )}

      {/* Color Palettes - Only for bar and line charts */}
      {(selectedElement.chartType === 'bar' || selectedElement.chartType === 'line') && (
        <BarLineColorPalettes
          selectedElement={selectedElement}
          updateSlideElement={updateSlideElement}
        />
      )}

      <ChartOptionsControls
        selectedElement={selectedElement}
        updateSlideElement={updateSlideElement}
      />

      <div className="section-title">Element Actions</div>
      <div className="option-group">
        <LayerActions
          selectedElement={selectedElement}
          currentSlide={currentSlide}
          bringForward={bringForward}
          bringToFront={bringToFront}
          sendBackward={sendBackward}
          sendToBack={sendToBack}
          updateSlide={updateSlide}
          deleteElement={deleteElement}
        />
      </div>

      <ChartDataModal
        isOpen={isDataModalOpen}
        onClose={() => {
          setIsDataModalOpen(false);
          setModalInitialPosition(null);
        }}
        element={selectedElement}
        onSave={handleSaveData}
        initialPosition={modalInitialPosition}
      />
    </div>
  );
};

export default ChartOptions;
