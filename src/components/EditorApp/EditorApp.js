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

  // Zoom state
  const [zoom, setZoom] = useState(100);

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

  const addTableWithHistory = useCallback((style) => {
    slidesHook.addTable(historyHook.pushSnapshot, style);
  }, [slidesHook.addTable, historyHook.pushSnapshot]);

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

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(200, prev + 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(50, prev - 10));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle slideshow close - exit fullscreen and reset
  const handleCloseSlideshow = useCallback(async () => {
    try {
      // Exit fullscreen if we're in it
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    } finally {
      // Always reset zoom and close slideshow
      setZoom(100);
      slideshowHook.stopSlideshow();
    }
  }, [slideshowHook]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If fullscreen was exited and slideshow is active, close slideshow
      if (!isCurrentlyFullscreen && slideshowHook.isSlideshowActive) {
        setZoom(100);
        slideshowHook.stopSlideshow();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [slideshowHook.isSlideshowActive, slideshowHook]);

  // Handle slideshow start - enter fullscreen and start slideshow
  const handleStartSlideshow = useCallback(async () => {
    // Immediately hide the editor UI and show transition overlay
    slideshowHook.startTransition();
    
    // Small delay to ensure transition overlay is visible
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      // Set zoom before entering fullscreen (so it's ready)
      setZoom(165);
      
      // Enter fullscreen
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      
      // Wait a bit for fullscreen to settle, then show slideshow
      setTimeout(() => {
        slideshowHook.startSlideshow();
      }, 100);
    } catch (error) {
      console.error('Failed to start slideshow:', error);
      // If fullscreen fails, still start slideshow (it will work in windowed mode)
      setZoom(165);
      setTimeout(() => {
        slideshowHook.startSlideshow();
      }, 100);
    }
  }, [slideshowHook]);

  // Handle regular fullscreen toggle (not slideshow)
  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    selectedElement: slidesHook.selectedElement,
    addSlide: addSlideWithHistory,
    addTextBox: addTextBoxWithHistory,
    updateSlideElement: updateSlideElementWithHistory,
    deleteElement: deleteElementWithHistory,
    setTextFormatting,
    undo,
    redo,
    isSlideshowActive: slideshowHook.isSlideshowActive,
    onCloseSlideshow: handleCloseSlideshow,
    onToggleFullscreen: handleToggleFullscreen,
    onStartSlideshow: handleStartSlideshow
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
    <div className="app" style={{ 
      opacity: slideshowHook.isTransitioning || slideshowHook.isSlideshowActive ? 0 : 1,
      transition: 'opacity 0.15s ease-out',
      pointerEvents: slideshowHook.isTransitioning || slideshowHook.isSlideshowActive ? 'none' : 'auto',
      backgroundColor: slideshowHook.isTransitioning || slideshowHook.isSlideshowActive ? '#000' : 'transparent',
    }}>
        <Toolbar 
          textFormatting={textFormatting}
          setTextFormatting={setTextFormatting}
          selectedElement={slidesHook.selectedElement}
          updateSlideElement={updateSlideElementWithHistory}
          addTextBox={addTextBoxWithHistory}
          addShape={addShapeWithHistory}
          addImage={addImageWithHistory}
          onShowTemplates={() => templatesHook.setShowTemplates(true)}
          onStartFullScreenSlideshow={handleStartSlideshow}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
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
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
        />
        <div 
          className="app-body"
          style={{
            backgroundColor: slideshowHook.isTransitioning || slideshowHook.isSlideshowActive ? '#000' : 'transparent',
            transition: 'background-color 0.15s ease-out',
          }}
        >
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
            zoom={zoom}
            onOpenDesignTab={() => {
              uiStateHook.setForceRightToolbarTab('Design');
              slidesHook.setSelectedElement(null);
              // Wait for DOM to update, then trigger color picker button
              setTimeout(() => {
                const colorPickerButton = document.querySelector('[data-design-section-color-picker="true"]');
                if (colorPickerButton) {
                  colorPickerButton.click();
                }
              }, 150);
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
            addTable={addTableWithHistory}
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

        {/* Transition overlay - shows immediately when starting slideshow */}
        {slideshowHook.isTransitioning && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#000',
              zIndex: 99998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeInBlack 0.2s ease-out',
            }}
          />
        )}
        
        <style>{`
          @keyframes fadeInBlack {
            from {
              opacity: 0;
              background-color: rgba(0, 0, 0, 0);
            }
            to {
              opacity: 1;
              background-color: #000;
            }
          }
        `}</style>
        
        {slideshowHook.isSlideshowActive && (
          <FullScreenSlideshow
            slides={slidesHook.slides}
            currentSlideIndex={slidesHook.currentSlideIndex}
            onClose={handleCloseSlideshow}
            onSlideChange={slideshowHook.handleSlideshowSlideChange}
            zoom={165}
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
