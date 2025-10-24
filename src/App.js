import React, { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Toolbar from './components/Toolbar/Toolbar';
import KonvaCanvas from './components/KonvaCanvas/KonvaCanvas';
import Templates from './components/Templates/Templates';
import RightToolbar from './components/RightToolbar/RightToolbar';
import FullScreenSlideshow from './components/FullScreenSlideshow/FullScreenSlideshow';
import LandingPage from './components/LandingPage/LandingPage';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [slides, setSlides] = useState([
    {
      id: uuidv4(),
      elements: []
    }
  ]);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFullScreenSlideshow, setShowFullScreenSlideshow] = useState(false);
  const [textFormatting, setTextFormatting] = useState({
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    color: '#000000'
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  
  const [showDragMessage, setShowDragMessage] = useState(false);
  
  // State to control RightToolbar tab
  const [forceRightToolbarTab, setForceRightToolbarTab] = useState(null);
  
  // Simple undo/redo state
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Helper function to save undo state with debouncing
  const saveUndoState = useCallback(() => {
    const now = Date.now();
    // Mark that there are unsaved changes immediately
    setHasUnsavedChanges(true);
    
    // Only save if at least 300ms have passed since last save
    if (now - lastSaveTime > 300) {
      setUndoStack(prev => {
        const newStack = [...prev, { slides, selectedElement }];
        return newStack.length > 20 ? newStack.slice(-20) : newStack;
      });
      setLastSaveTime(now);
    }
  }, [slides, selectedElement, lastSaveTime]);

  // Sync toolbar formatting with the currently selected text element
  React.useEffect(() => {
    if (selectedElement && selectedElement.type === 'text') {
      setTextFormatting(prev => ({
        ...prev,
        fontSize: selectedElement.fontSize ?? prev.fontSize,
        fontWeight: selectedElement.fontWeight ?? prev.fontWeight,
        fontStyle: selectedElement.fontStyle ?? prev.fontStyle,
        textDecoration: selectedElement.textDecoration ?? prev.textDecoration,
        textAlign: selectedElement.textAlign ?? prev.textAlign,
        color: selectedElement.color ?? prev.color,
      }));
    }
  }, [selectedElement, setTextFormatting]);

  const addSlide = useCallback(() => {
    const newSlide = {
      id: uuidv4(),
      elements: []
    };
    // Insert the new slide after the current slide
    setSlides(prev => {
      const newSlides = [...prev];
      newSlides.splice(currentSlideIndex + 1, 0, newSlide);
      return newSlides;
    });
    // Automatically switch to the new slide
    setCurrentSlideIndex(prev => prev + 1);
    // Deselect any selected element
    setSelectedElement(null);
    // Force RightToolbar to show Insert tab
    setForceRightToolbarTab('Insert');
  }, [currentSlideIndex]);

  const duplicateSlide = useCallback((slideIndex) => {
    const slideToDuplicate = slides[slideIndex];
    const duplicatedSlide = {
      ...slideToDuplicate,
      id: uuidv4(),
      elements: slideToDuplicate.elements.map(element => ({
        ...element,
        id: uuidv4()
      }))
    };
    
    // Insert the duplicated slide after the current slide
    setSlides(prev => {
      const newSlides = [...prev];
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide);
      return newSlides;
    });
    
    // Switch to the duplicated slide
    setCurrentSlideIndex(slideIndex + 1);
  }, [slides]);



  const addSlideFromTemplate = useCallback((template) => {
    // Template has slides array, replace ALL existing slides with template slides
    const templateSlides = template.slides.map(slide => ({
      ...slide,
      id: uuidv4(),
      elements: slide.elements.map(element => ({
        ...element,
        id: uuidv4()
      }))
    }));
    
    // Replace all slides with template slides
    setSlides(templateSlides);
    setCurrentSlideIndex(0); // Start from first slide
  }, []);

  const handleTemplateSelect = useCallback((template) => {
    addSlideFromTemplate(template);
    setShowTemplates(false);
  }, [addSlideFromTemplate]);

  const deleteSlide = useCallback((slideIndex) => {
    if (slides.length > 1) {
      setSlides(prev => prev.filter((_, index) => index !== slideIndex));
      if (currentSlideIndex >= slideIndex && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      }
    }
  }, [slides.length, currentSlideIndex]);

  const reorderSlides = useCallback((fromIndex, toIndex) => {
    setSlides(prev => {
      const newSlides = [...prev];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      return newSlides;
    });
    
    // Update current slide index if needed
    if (currentSlideIndex === fromIndex) {
      setCurrentSlideIndex(toIndex);
    } else if (fromIndex < currentSlideIndex && toIndex >= currentSlideIndex) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (fromIndex > currentSlideIndex && toIndex <= currentSlideIndex) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex]);

  const updateSlideElement = useCallback((elementId, updates) => {
    // Save current state to undo stack with debouncing
    saveUndoState();
    setRedoStack([]); // Clear redo stack when new action is performed
    
    // Force save undo state after a delay to ensure it's available
    setTimeout(() => {
      setUndoStack(prev => {
        const newStack = [...prev, { slides, selectedElement }];
        return newStack.length > 20 ? newStack.slice(-20) : newStack;
      });
    }, 350);
    
    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return {
          ...slide,
          elements: slide.elements.map(element => 
            element.id === elementId ? { ...element, ...updates } : element
          )
        };
      }
      return slide;
    }));
    setSelectedElement(prev => (prev && prev.id === elementId) ? { ...prev, ...updates } : prev);
  }, [currentSlideIndex, slides, selectedElement, saveUndoState]);

  const updateSlide = useCallback((updates) => {
    // Save current state to undo stack with debouncing
    saveUndoState();
    setRedoStack([]); // Clear redo stack when new action is performed
    
    // Force save undo state after a delay to ensure it's available
    setTimeout(() => {
      setUndoStack(prev => {
        const newStack = [...prev, { slides, selectedElement }];
        return newStack.length > 20 ? newStack.slice(-20) : newStack;
      });
    }, 350);
    
    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return { ...slide, ...updates };
      }
      return slide;
    }));
  }, [currentSlideIndex, slides, selectedElement, saveUndoState]);

  const addTextBox = useCallback((textType = 'content') => {
    let fontSize, fontWeight, content, width, height;

    switch (textType) {
      case 'title':
        fontSize = 60;
        fontWeight = 'bold';
        content = 'Click to add title';
        width = 600;
        height = 80;
        break;

      case 'subtitle':
        fontSize = 36;
        fontWeight = 'bold';
        content = 'Click to add subtitle';
        width = 450;
        height = 50;
        break;

      case 'content':
      default:
        fontSize = 24;
        fontWeight = 'normal';
        content = 'Click to add content';
        width = 300;
        height = 40;
        break;
    }

    const newTextBox = {
      id: uuidv4(),
      type: 'text',
      content,
      x: 100,
      y: 100,
      width,
      height,
      fontSize,
      fontWeight,
      fontStyle: textFormatting.fontStyle,
      textDecoration: textFormatting.textDecoration,
      textAlign: textFormatting.textAlign,
      color: '#000000' // Always black for new textboxes
    };

    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return {
          ...slide,
          elements: [...slide.elements, newTextBox]
        };
      }
      return slide;
    }));
  }, [currentSlideIndex, textFormatting]);

  const deleteElement = useCallback((elementId) => {
    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return {
          ...slide,
          elements: slide.elements.filter(element => element.id !== elementId)
        };
      }
      return slide;
    }));
    setSelectedElement(null);
  }, [currentSlideIndex]);

  const addShape = useCallback((shapeType) => {
    const newShape = {
      id: uuidv4(),
      type: 'shape',
      shapeType: shapeType,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      fillColor: '#2d9cdb',
      borderColor: '#1e7bb8',
      borderWidth: 2
    };

    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return {
          ...slide,
          elements: [...slide.elements, newShape]
        };
      }
      return slide;
    }));
  }, [currentSlideIndex]);

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: uuidv4(),
            type: 'image',
            src: event.target.result,
            x: 150,
            y: 150,
            width: 200,
            height: 150
          };

          setSlides(prev => prev.map((slide, index) => {
            if (index === currentSlideIndex) {
              return {
                ...slide,
                elements: [...slide.elements, newImage]
              };
            }
            return slide;
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [currentSlideIndex]);

  const addChart = useCallback((chartType) => {
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth >= 1024 && screenWidth <= 1150;

    const newChart = {
      id: uuidv4(),
      type: 'chart',
      chartType: chartType || 'bar',
      x: 160,
      y: 160,
      width: isSmallScreen ? 192 : 360,
      height: isSmallScreen ? 157 : 220,
      labels: ['A', 'B', 'C', 'D'],
      values: [12, 25, 9, 18],
      color: '#0ea5e9',
      backgroundColor: 'transparent',
      barColors: (chartType === 'pie' || chartType === 'line')
        ? ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'] 
        : ['#0ea5e9', '#0ea5e9', '#0ea5e9', '#0ea5e9']
    };

    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return {
          ...slide,
          elements: [...slide.elements, newChart]
        };
      }
      return slide;
    }));
  }, [currentSlideIndex]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            addSlide();
            break;
          case 't':
            e.preventDefault();
            addTextBox();
            break;
          case 'b':
            if (selectedElement) {
              e.preventDefault();
              const newWeight = selectedElement.fontWeight === 'bold' ? 'normal' : 'bold';
              updateSlideElement(selectedElement.id, { fontWeight: newWeight });
              setTextFormatting(prev => ({ ...prev, fontWeight: newWeight }));
            }
            break;
          case 'i':
            if (selectedElement) {
              e.preventDefault();
              const newStyle = selectedElement.fontStyle === 'italic' ? 'normal' : 'italic';
              updateSlideElement(selectedElement.id, { fontStyle: newStyle });
              setTextFormatting(prev => ({ ...prev, fontStyle: newStyle }));
            }
            break;
          case 'u':
            if (selectedElement) {
              e.preventDefault();
              const newDecoration = selectedElement.textDecoration === 'underline' ? 'none' : 'underline';
              updateSlideElement(selectedElement.id, { textDecoration: newDecoration });
              setTextFormatting(prev => ({ ...prev, textDecoration: newDecoration }));
            }
            break;
          default:
            break;
        }
      }
      
      if (e.key === 'Delete' && selectedElement) {
        deleteElement(selectedElement.id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, addSlide, addTextBox, updateSlideElement, deleteElement, setTextFormatting]);

  // Smart deselection handler
  const handleSmartDeselection = useCallback((e) => {
    // Check if click is on RightToolbar, ToolbarBottom, or ToolbarTop
    const rightToolbar = document.querySelector('.right-toolbar');
    const toolbarBottom = document.querySelector('.toolbar-bottom');
    const toolbarTop = document.querySelector('.toolbar-top');
    const canvas = document.querySelector('.canvas');
    
    // If clicking on RightToolbar, ToolbarBottom, or ToolbarTop, don't deselect
    if (rightToolbar && rightToolbar.contains(e.target)) {
      return; // Don't deselect
    }
    
    if (toolbarBottom && toolbarBottom.contains(e.target)) {
      return; // Don't deselect
    }
    
    if (toolbarTop && toolbarTop.contains(e.target)) {
      return; // Don't deselect
    }
    
    // If clicking outside canvas, deselect both selection and editing
    if (canvas && !canvas.contains(e.target)) {
      setSelectedElement(null);
      // Also clear any text editing state by dispatching a custom event
      // that the Canvas component can listen to
      const clearEditingEvent = new CustomEvent('clearTextEditing');
      document.dispatchEvent(clearEditingEvent);
    }
  }, []);

  // Handle tab changes in RightToolbar
  const handleTabChange = useCallback((tabName) => {
    // Deselect element when switching tabs
    setSelectedElement(null);
    // Also clear text editing state
    const clearEditingEvent = new CustomEvent('clearTextEditing');
    document.dispatchEvent(clearEditingEvent);
  }, []);

  // Apply/remove dark mode class on body
  React.useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Add global click listener for smart deselection
  React.useEffect(() => {
    document.addEventListener('click', handleSmartDeselection);
    return () => document.removeEventListener('click', handleSmartDeselection);
  }, [handleSmartDeselection]);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const startFullScreenSlideshow = useCallback(() => {
    setShowFullScreenSlideshow(true);
  }, []);

  const closeFullScreenSlideshow = useCallback(() => {
    setShowFullScreenSlideshow(false);
  }, []);

  const stopSlideshow = useCallback(() => {
    setIsSlideshowOpen(false);
  }, []);

  const handleSlideshowSlideChange = useCallback((newSlideIndex) => {
    setCurrentSlideIndex(newSlideIndex);
    // Deselect element when changing slides
    setSelectedElement(null);
    // Also clear text editing state
    const clearEditingEvent = new CustomEvent('clearTextEditing');
    document.dispatchEvent(clearEditingEvent);
  }, []);

  const loadTemplate = useCallback(async (template) => {
    try {
      // If template has a jsonFile property, fetch it
      if (template.jsonFile) {
        const response = await fetch(template.jsonFile);
        const templateData = await response.json();
        
        // Load the template data into slides
        if (templateData.slides) {
          setSlides(templateData.slides);
          setCurrentSlideIndex(0);
          setSelectedElement(null);
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }, []);

  const handleLaunchPresentify = useCallback((template) => {
    setShowLandingPage(false);
    
    // If a template is provided, load it
    if (template) {
      loadTemplate(template);
    }
  }, [loadTemplate]);

  const handleBackToLanding = useCallback(() => {
    setShowLandingPage(true);
  }, []);


  const undo = useCallback(() => {
    // Always save current state to redo stack before undoing
    setRedoStack(prev => [...prev, { slides, selectedElement }]);
    
    if (undoStack.length > 0) {
      // Get the most recent state from undo stack
      const lastState = undoStack[undoStack.length - 1];
      
      // Restore the state
      setSlides(lastState.slides);
      setSelectedElement(lastState.selectedElement);
      
      // Remove the used state from undo stack
      setUndoStack(prev => prev.slice(0, -1));
    }
    
    // Reset unsaved changes flag
    setHasUnsavedChanges(false);
  }, [undoStack, slides, selectedElement, hasUnsavedChanges]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, { slides, selectedElement }]);
      setSlides(nextState.slides);
      setSelectedElement(nextState.selectedElement);
      setRedoStack(prev => prev.slice(0, -1));
    }
  }, [redoStack, slides, selectedElement]);

  // Keyboard shortcuts for undo/redo and zoom
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Show landing page by default
  if (showLandingPage) {
    return <LandingPage onLaunchPresentify={handleLaunchPresentify} />;
  }

  return (
    <div className="app">
        <Toolbar 
          textFormatting={textFormatting}
          setTextFormatting={setTextFormatting}
          selectedElement={selectedElement}
          updateSlideElement={updateSlideElement}
          addTextBox={addTextBox}
          addShape={addShape}
          addImage={addImage}
          onShowTemplates={() => setShowTemplates(true)}
          onStartFullScreenSlideshow={startFullScreenSlideshow}
          onUndo={undo}
          onRedo={redo}
          canUndo={true}
          canRedo={redoStack.length > 0}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          slides={slides}
          onBackToLanding={handleBackToLanding}
          setShowDragMessage={setShowDragMessage}
        />
        <div className="app-body">
          <Sidebar 
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            setCurrentSlideIndex={setCurrentSlideIndex}
            addSlide={addSlide}
            deleteSlide={deleteSlide}
            onShowTemplates={() => setShowTemplates(true)}
            onReorderSlides={reorderSlides}
            onDuplicateSlide={duplicateSlide}
            setSlides={setSlides}
          />
          <KonvaCanvas 
            slide={slides[currentSlideIndex]}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            updateSlideElement={updateSlideElement}
            deleteElement={deleteElement}
            textFormatting={textFormatting}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onThumbnailUpdate={(img) => {
              setSlides((prev) =>
                prev.map((s, i) =>
                  i === currentSlideIndex ? { ...s, thumbnail: img } : s
                )
              );
            }}
          />
          <RightToolbar 
            selectedElement={selectedElement}
            textFormatting={textFormatting}
            setTextFormatting={setTextFormatting}
            updateSlideElement={updateSlideElement}
            updateSlide={updateSlide}
            currentSlide={slides[currentSlideIndex]}
            addTextBox={addTextBox}
            addShape={addShape}
            addImage={addImage}
            addChart={addChart}
            onTabChange={handleTabChange}
            slides={slides}
            forceTab={forceRightToolbarTab}
            onTabForced={() => setForceRightToolbarTab(null)}
          />
        </div>
        {showTemplates && (
          <Templates 
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        )}


        {isSlideshowOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, background: '#000', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <button onClick={stopSlideshow} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
            <div style={{ width: '90vw', height: '80vh', background: '#111', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              {/* Render current slide content in read-only mode */}
              <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: slides[currentSlideIndex]?.backgroundColor || '#fff', backgroundImage: slides[currentSlideIndex]?.backgroundImage ? `url(${slides[currentSlideIndex].backgroundImage})` : 'none', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                {(slides[currentSlideIndex]?.elements || []).map((el) => {
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
                      <img key={el.id} src={el.src} alt="" style={{ position: 'absolute', left: el.x, top: el.y, width: el.width, height: el.height, objectFit: 'contain' }} />
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
                  onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                  style={{ padding: '10px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
                >
                  ◀
                </button>
              </div>
              <div style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)' }}>
                <button
                  onClick={() => setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                  style={{ padding: '10px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showFullScreenSlideshow && (
          <FullScreenSlideshow
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onClose={closeFullScreenSlideshow}
            onSlideChange={handleSlideshowSlideChange}
          />
        )}
        
        
        {/* Simple Drag Message */}
        {showDragMessage && (
          <div className="drag-message-overlay">
            <div className="drag-message">
              Drag and adjust the position of canvas
            </div>
          </div>
        )}
      </div>
  );
}

export default App;