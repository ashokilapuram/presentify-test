import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../Sidebar/Sidebar';
import Toolbar from '../Toolbar/Toolbar';
import KonvaCanvas from '../KonvaCanvas/KonvaCanvas';
import Templates from '../Templates/Templates';
import RightToolbar from '../RightToolbar/RightToolbar';
import FullScreenSlideshow from '../FullScreenSlideshow/FullScreenSlideshow';

// Import custom hooks
import { useSlides } from '../../hooks/useSlides';
import { useHistory } from '../../hooks/useHistory';
import { useTemplates } from '../../hooks/useTemplates';
import { useSlideshow } from '../../hooks/useSlideshow';
import { useUIState } from '../../hooks/useUIState';
import { useFileManager } from '../../hooks/useFileManager';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

function EditorApp() {
  // Initialize all custom hooks
  const slidesHook = useSlides();
  const historyHook = useHistory();
  const templatesHook = useTemplates(
    slidesHook.slides,
    slidesHook.setSlides,
    slidesHook.setCurrentSlideIndex,
    slidesHook.setSelectedElement
  );
  const slideshowHook = useSlideshow(
    slidesHook.setCurrentSlideIndex,
    slidesHook.setSelectedElement
  );
  const uiStateHook = useUIState(slidesHook.setSelectedElement);
  const fileManagerHook = useFileManager();

  // Text formatting state
  const [textFormatting, setTextFormatting] = useState({
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 1.2,
    textTransform: 'none',
    listType: 'none'
  });

  // Sync toolbar formatting with the currently selected text element
  useEffect(() => {
    if (slidesHook.selectedElement && slidesHook.selectedElement.type === 'text') {
      setTextFormatting(prev => ({
        ...prev,
        fontSize: slidesHook.selectedElement.fontSize ?? prev.fontSize,
        fontWeight: slidesHook.selectedElement.fontWeight ?? prev.fontWeight,
        fontStyle: slidesHook.selectedElement.fontStyle ?? prev.fontStyle,
        textDecoration: slidesHook.selectedElement.textDecoration ?? prev.textDecoration,
        textAlign: slidesHook.selectedElement.textAlign ?? prev.textAlign,
        color: slidesHook.selectedElement.color ?? prev.color,
        letterSpacing: slidesHook.selectedElement.letterSpacing ?? prev.letterSpacing,
        lineHeight: slidesHook.selectedElement.lineHeight ?? prev.lineHeight,
        textTransform: slidesHook.selectedElement.textTransform ?? prev.textTransform,
        listType: slidesHook.selectedElement.listType ?? prev.listType,
      }));
    }
  }, [slidesHook.selectedElement, setTextFormatting]);

  // Wrapper functions that include history snapshots
  const addSlideWithHistory = useCallback(() => {
    slidesHook.addSlide(historyHook.pushSnapshot);
    // Force RightToolbar to show Insert tab
    uiStateHook.setForceRightToolbarTab('Insert');
  }, [slidesHook.addSlide, historyHook.pushSnapshot, uiStateHook.setForceRightToolbarTab]);

  const duplicateSlideWithHistory = useCallback((slideIndex) => {
    slidesHook.duplicateSlide(slideIndex, historyHook.pushSnapshot);
  }, [slidesHook.duplicateSlide, historyHook.pushSnapshot]);

  const deleteSlideWithHistory = useCallback((slideIndex) => {
    slidesHook.deleteSlide(slideIndex, historyHook.pushSnapshot);
  }, [slidesHook.deleteSlide, historyHook.pushSnapshot]);

  const reorderSlidesWithHistory = useCallback((fromIndex, toIndex) => {
    slidesHook.reorderSlides(fromIndex, toIndex, historyHook.pushSnapshot);
  }, [slidesHook.reorderSlides, historyHook.pushSnapshot]);

  const updateSlideElementWithHistory = useCallback((elementId, updates) => {
    slidesHook.updateSlideElement(elementId, updates, historyHook.pushSnapshot);
  }, [slidesHook.updateSlideElement, historyHook.pushSnapshot]);

  const updateSlideWithHistory = useCallback((updates) => {
    slidesHook.updateSlide(updates, historyHook.pushSnapshot);
  }, [slidesHook.updateSlide, historyHook.pushSnapshot]);

  const addTextBoxWithHistory = useCallback((textType = 'content') => {
    slidesHook.addTextBox(textType, textFormatting, historyHook.pushSnapshot);
  }, [slidesHook.addTextBox, textFormatting, historyHook.pushSnapshot]);

  const deleteElementWithHistory = useCallback((elementId) => {
    slidesHook.deleteElement(elementId, historyHook.pushSnapshot);
  }, [slidesHook.deleteElement, historyHook.pushSnapshot]);

  const addShapeWithHistory = useCallback((shapeType) => {
    slidesHook.addShape(shapeType, historyHook.pushSnapshot);
  }, [slidesHook.addShape, historyHook.pushSnapshot]);

  const addImageWithHistory = useCallback(() => {
    slidesHook.addImage(historyHook.pushSnapshot);
  }, [slidesHook.addImage, historyHook.pushSnapshot]);

  const addChartWithHistory = useCallback((chartType) => {
    slidesHook.addChart(chartType, historyHook.pushSnapshot);
  }, [slidesHook.addChart, historyHook.pushSnapshot]);

  const bringForwardWithHistory = useCallback(() => {
    if (slidesHook.selectedElement) {
      slidesHook.bringForward(slidesHook.selectedElement.id, historyHook.pushSnapshot);
    }
  }, [slidesHook.selectedElement, slidesHook.bringForward, historyHook.pushSnapshot]);

  const bringToFrontWithHistory = useCallback(() => {
    if (slidesHook.selectedElement) {
      slidesHook.bringToFront(slidesHook.selectedElement.id, historyHook.pushSnapshot);
    }
  }, [slidesHook.selectedElement, slidesHook.bringToFront, historyHook.pushSnapshot]);

  const sendBackwardWithHistory = useCallback(() => {
    if (slidesHook.selectedElement) {
      slidesHook.sendBackward(slidesHook.selectedElement.id, historyHook.pushSnapshot);
    }
  }, [slidesHook.selectedElement, slidesHook.sendBackward, historyHook.pushSnapshot]);

  const sendToBackWithHistory = useCallback(() => {
    if (slidesHook.selectedElement) {
      slidesHook.sendToBack(slidesHook.selectedElement.id, historyHook.pushSnapshot);
    }
  }, [slidesHook.selectedElement, slidesHook.sendToBack, historyHook.pushSnapshot]);

  const handleTemplateSelectWithHistory = useCallback((template) => {
    templatesHook.handleTemplateSelect(template, historyHook.pushSnapshot);
  }, [templatesHook.handleTemplateSelect, historyHook.pushSnapshot]);

  // Undo/Redo functions
  const undo = useCallback(() => {
    historyHook.undo(
      slidesHook.slides,
      slidesHook.selectedElement,
      slidesHook.currentSlideIndex,
      slidesHook.setSlides,
      slidesHook.setSelectedElement,
      slidesHook.setCurrentSlideIndex
    );
  }, [historyHook.undo, slidesHook.slides, slidesHook.selectedElement, slidesHook.currentSlideIndex, slidesHook.setSlides, slidesHook.setSelectedElement, slidesHook.setCurrentSlideIndex]);

  const redo = useCallback(() => {
    historyHook.redo(
      slidesHook.slides,
      slidesHook.selectedElement,
      slidesHook.currentSlideIndex,
      slidesHook.setSlides,
      slidesHook.setSelectedElement,
      slidesHook.setCurrentSlideIndex
    );
  }, [historyHook.redo, slidesHook.slides, slidesHook.selectedElement, slidesHook.currentSlideIndex, slidesHook.setSlides, slidesHook.setSelectedElement, slidesHook.setCurrentSlideIndex]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    selectedElement: slidesHook.selectedElement,
    addSlide: addSlideWithHistory,
    addTextBox: addTextBoxWithHistory,
    updateSlideElement: updateSlideElementWithHistory,
    deleteElement: deleteElementWithHistory,
    setTextFormatting,
    undo,
    redo
  });

  // Load template from sessionStorage on mount (if user came from landing page with a template)
  useEffect(() => {
    const storedTemplate = sessionStorage.getItem('selectedTemplate');
    if (storedTemplate) {
      try {
        const template = JSON.parse(storedTemplate);
        templatesHook.loadTemplate(template);
        sessionStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Error loading template from sessionStorage:', error);
      }
    }
  }, []); // Only run once on mount

  const handleBackToLanding = () => {
    window.location.href = '/';
  };

  const handleReset = useCallback(() => {
    // Save current state to history
    historyHook.pushSnapshot({ 
      slides: slidesHook.slides, 
      selectedElement: slidesHook.selectedElement, 
      currentSlideIndex: slidesHook.currentSlideIndex 
    });
    
    // Reset to a new empty slide with a new UUID
    slidesHook.setSlides([{ id: uuidv4(), elements: [] }]);
    slidesHook.setCurrentSlideIndex(0);
    slidesHook.setSelectedElement(null);
  }, [historyHook, slidesHook]);

  return (
    <div className="app">
        <Toolbar 
          textFormatting={textFormatting}
          setTextFormatting={setTextFormatting}
          selectedElement={slidesHook.selectedElement}
          updateSlideElement={updateSlideElementWithHistory}
          addTextBox={addTextBoxWithHistory}
          addShape={addShapeWithHistory}
          addImage={addImageWithHistory}
          onShowTemplates={() => templatesHook.setShowTemplates(true)}
          onStartFullScreenSlideshow={slideshowHook.startFullScreenSlideshow}
          onDownloadPresentation={() => fileManagerHook.handleDownloadPresentation(slidesHook.slides, slidesHook.currentSlideIndex)}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyHook.undoStack.length > 0}
          canRedo={historyHook.redoStack.length > 0}
          isDarkMode={uiStateHook.isDarkMode}
          onToggleDarkMode={uiStateHook.handleToggleDarkMode}
          slides={slidesHook.slides}
          onBackToLanding={handleBackToLanding}
          setShowDragMessage={uiStateHook.setShowDragMessage}
          onReset={handleReset}
        />
        <div className="app-body">
          <Sidebar 
            slides={slidesHook.slides}
            currentSlideIndex={slidesHook.currentSlideIndex}
            setCurrentSlideIndex={slidesHook.setCurrentSlideIndex}
            addSlide={addSlideWithHistory}
            deleteSlide={deleteSlideWithHistory}
            onShowTemplates={() => templatesHook.setShowTemplates(true)}
            onReorderSlides={reorderSlidesWithHistory}
            onDuplicateSlide={duplicateSlideWithHistory}
            setSlides={slidesHook.setSlides}
            onSlideClick={() => {
              slidesHook.setSelectedElement(null);
              uiStateHook.setForceRightToolbarTab('Insert');
            }}
          />
          <KonvaCanvas 
            slide={slidesHook.slides[slidesHook.currentSlideIndex]}
            selectedElement={slidesHook.selectedElement}
            setSelectedElement={slidesHook.setSelectedElement}
            updateSlideElement={updateSlideElementWithHistory}
            updateSlide={updateSlideWithHistory}
            deleteElement={deleteElementWithHistory}
            textFormatting={textFormatting}
            isDarkMode={uiStateHook.isDarkMode}
            onToggleDarkMode={uiStateHook.handleToggleDarkMode}
            onOpenDesignTab={() => {
              uiStateHook.setForceRightToolbarTab('Design');
              slidesHook.setSelectedElement(null);
              // Wait for DOM to update, then trigger color picker
              setTimeout(() => {
                const colorInput = document.querySelector('[data-design-section-color-picker="true"]');
                if (colorInput) {
                  colorInput.click();
                }
              }, 100);
            }}
            onThumbnailUpdate={(slideId, img) => {
              slidesHook.setSlides((prev) =>
                prev.map((s) =>
                  s.id === slideId ? { ...s, thumbnail: img } : s
                )
              );
            }}
          />
          <RightToolbar 
            selectedElement={slidesHook.selectedElement}
            textFormatting={textFormatting}
            setTextFormatting={setTextFormatting}
            updateSlideElement={updateSlideElementWithHistory}
            updateSlide={updateSlideWithHistory}
            currentSlide={slidesHook.slides[slidesHook.currentSlideIndex]}
            addTextBox={addTextBoxWithHistory}
            addShape={addShapeWithHistory}
            addImage={addImageWithHistory}
            addChart={addChartWithHistory}
            bringForward={bringForwardWithHistory}
            bringToFront={bringToFrontWithHistory}
            sendBackward={sendBackwardWithHistory}
            sendToBack={sendToBackWithHistory}
            onTabChange={uiStateHook.handleTabChange}
            slides={slidesHook.slides}
            forceTab={uiStateHook.forceRightToolbarTab}
            onTabForced={() => uiStateHook.setForceRightToolbarTab(null)}
          />
        </div>
        {templatesHook.showTemplates && (
          <Templates 
            onSelectTemplate={handleTemplateSelectWithHistory}
            onClose={() => templatesHook.setShowTemplates(false)}
          />
        )}

        {slideshowHook.isSlideshowOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, background: '#000', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <button onClick={slideshowHook.stopSlideshow} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
            <div style={{ width: '90vw', height: '80vh', background: '#111', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              {/* Render current slide content in read-only mode */}
              <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: slidesHook.slides[slidesHook.currentSlideIndex]?.backgroundColor || '#fff', backgroundImage: slidesHook.slides[slidesHook.currentSlideIndex]?.backgroundImage ? `url(${slidesHook.slides[slidesHook.currentSlideIndex].backgroundImage})` : 'none', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                {(slidesHook.slides[slidesHook.currentSlideIndex]?.elements || []).map((el) => {
                  if (el.type === 'text') {
                    return (
                      <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y, width: el.width, height: el.height, color: el.color, fontSize: el.fontSize, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration, textAlign: el.textAlign, background: el.backgroundColor || 'transparent', padding: 8, overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: el.content }} />
                    );
                  }
                  if (el.type === 'shape') {
                    return (
                      <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y, width: el.width, height: el.height, backgroundColor: el.fillColor, border: `${el.borderWidth}px solid ${el.borderColor}`, borderRadius: el.shapeType === 'circle' ? '50%' : 0 }} />
                    );
                  }
                  if (el.type === 'image') {
                    return (
                      <img 
                        key={el.id} 
                        src={el.src} 
                        alt="" 
                        style={{ 
                          position: 'absolute', 
                          left: el.x, 
                          top: el.y, 
                          width: el.width, 
                          height: el.height, 
                          objectFit: 'contain',
                          border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor || '#000000'}` : 'none'
                        }} 
                      />
                    );
                  }
                  if (el.type === 'chart') {
                    return (
                      <div key={el.id} style={{ 
                        position: 'absolute', 
                        left: el.x, 
                        top: el.y, 
                        width: el.width, 
                        height: el.height,
                        backgroundColor: '#f3f4f6',
                        border: '2px dashed #9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        Chart: {el.chartType || 'bar'} ({el.labels?.length || 0} items)
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              {/* Navigation overlay */}
              <div style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)' }}>
                <button
                  onClick={() => slidesHook.setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                  style={{ padding: '10px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
                >
                  ◀
                </button>
              </div>
              <div style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)' }}>
                <button
                  onClick={() => slidesHook.setCurrentSlideIndex((i) => Math.min(slidesHook.slides.length - 1, i + 1))}
                  style={{ padding: '10px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}
        
        {slideshowHook.showFullScreenSlideshow && (
          <FullScreenSlideshow
            slides={slidesHook.slides}
            currentSlideIndex={slidesHook.currentSlideIndex}
            onClose={slideshowHook.closeFullScreenSlideshow}
            onSlideChange={slideshowHook.handleSlideshowSlideChange}
          />
        )}
        
        {/* Simple Drag Message */}
        {uiStateHook.showDragMessage && (
          <div className="drag-message-overlay">
            <div className="drag-message">
              Drag and adjust the position of canvas
            </div>
          </div>
        )}
      </div>
  );
}

export default EditorApp;
