import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import './ChartDataModal.css';
import { useModalDrag } from './hooks/useModalDrag';
import { useModalResize } from './hooks/useModalResize';
import { useDataInitialization } from './hooks/useDataInitialization';
import { useLiveUpdates } from './hooks/useLiveUpdates';
import { useDataOperations } from './hooks/useDataOperations';
import ModalHeader from './components/ModalHeader';
import DataTable from './components/DataTable';
import ActionsBar from './components/ActionsBar';

const ChartDataModal = ({ isOpen, onClose, element, onSave }) => {
  const modalRef = useRef(null);

  // Initialize data from element
  const { labels, series, setLabels, setSeries } = useDataInitialization(isOpen, element);

  // Handle modal dragging
  const { position, setPosition, isDragging, handleMouseDown } = useModalDrag(isOpen, modalRef);

  // Handle modal resizing
  const { modalHeight, isResizing, handleResizeMouseDown, setIsResizing } = useModalResize(
    isOpen, 
    modalRef, 
    position,
    setPosition
  );

  // Handle live updates for bar/line charts
  useLiveUpdates(isOpen, element, labels, series, onSave);

  // Handle data operations
  const {
    handleLabelChange,
    handleSeriesNameChange,
    handleValueChange,
    addRow,
    removeRow,
    addSeries,
    removeSeries,
    handleSave,
    handleKeyDown
  } = useDataOperations(element, labels, series, setLabels, setSeries);

  if (!isOpen) return null;

  return createPortal(
    <div className="chart-data-modal-overlay" onClick={onClose}>
      <div 
        ref={modalRef}
        className="chart-data-modal" 
        data-animate={!position ? 'true' : 'false'}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: position ? 'fixed' : 'absolute',
          left: position ? `${position.x}px` : '50%',
          top: position ? `${position.y}px` : '50%',
          transform: position ? 'none' : 'translate(-50%, -50%)',
          cursor: isDragging ? 'grabbing' : 'default',
          margin: 0,
          pointerEvents: 'auto',
          opacity: position ? 1 : undefined,
          height: modalHeight ? `${modalHeight}px` : undefined
        }}
      >
        <ModalHeader 
          onClose={onClose} 
          onMouseDown={handleMouseDown}
        />
        
        <div className="chart-data-modal-content">
          <DataTable
            labels={labels}
            series={series}
            chartType={element?.chartType}
            onLabelChange={handleLabelChange}
            onValueChange={handleValueChange}
            onRemoveRow={removeRow}
            onSeriesNameChange={handleSeriesNameChange}
            onRemoveSeries={removeSeries}
            onAddSeries={addSeries}
            onKeyDown={handleKeyDown}
          />
          
          <ActionsBar
            onAddRow={addRow}
            onCancel={onClose}
            onSave={() => handleSave(onSave, onClose)}
          />
        </div>
        
        <div 
          className="chart-data-modal-resize-handle"
          onMouseDown={handleResizeMouseDown}
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => {
            e.stopPropagation();
            // Stop resizing and reset cursor when mouse is released on handle
            setIsResizing(false);
            if (document.body) {
              document.body.style.cursor = '';
              document.body.style.userSelect = '';
            }
          }}
        />
      </div>
    </div>,
    document.body
  );
};

export default ChartDataModal;
