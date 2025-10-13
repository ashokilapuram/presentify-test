import React, { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import Templates from './components/Templates/Templates';
import RightToolbar from './components/RightToolbar/RightToolbar';
import FullScreenSlideshow from './components/FullScreenSlideshow/FullScreenSlideshow';
import CanvasFooter from './components/CanvasFooter/CanvasFooter';
import LandingPage from './components/LandingPage/LandingPage';
import ProfileModal from './components/ProfileModal/ProfileModal';
import { BarChart, LineChart, PieChart } from './components/ChartBox/ChartBox';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [slides, setSlides] = useState([
    {
      id: uuidv4(),
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Welcome to Presentify Pro',
          x: 150,
          y: 120,
          width: 600,
          height: 80,
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1e293b',
          fontFamily: 'Playfair Display'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Create stunning presentations with premium templates, advanced typography, and beautiful animations.',
          x: 100,
          y: 220,
          width: 700,
          height: 60,
          fontSize: 18,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'shape',
          shapeType: 'rectangle',
          x: 300,
          y: 300,
          width: 300,
          height: 3,
          fillColor: '#0ea5e9',
          borderColor: 'transparent',
          borderWidth: 0
        },
        {
          id: uuidv4(),
          type: 'text',
          content: '✨ Premium Features • 🎨 Beautiful Templates • 🚀 Export Options',
          x: 50,
          y: 350,
          width: 800,
          height: 45,
          fontSize: 14,
          fontWeight: '500',
          textAlign: 'center',
          color: '#0ea5e9',
          fontFamily: 'Inter'
        }
      ]
    },
    {
      id: uuidv4(),
      elements: []
    },
    {
      id: uuidv4(),
      elements: []
    },
    {
      id: uuidv4(),
      elements: []
    },
    {
      id: uuidv4(),
      elements: []
    }
  ]);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFullScreenSlideshow, setShowFullScreenSlideshow] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [documentTitle, setDocumentTitle] = useState('My Presentation');
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
  
  // Manual zoom state
  const [manualZoom, setManualZoom] = useState(0.55);
  
  // Pan mode state
  const [isPanning, setIsPanning] = useState(false);
  const [showDragMessage, setShowDragMessage] = useState(false);
  
  // Simple undo/redo state
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

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
    setSlides(prev => [...prev, newSlide]);
  }, []);

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
    // Save current state to undo stack
    setUndoStack(prev => [...prev, { slides, selectedElement }]);
    setRedoStack([]); // Clear redo stack when new action is performed
    
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
  }, [currentSlideIndex, slides, selectedElement]);

  const updateSlide = useCallback((updates) => {
    // Save current state to undo stack
    setUndoStack(prev => [...prev, { slides, selectedElement }]);
    setRedoStack([]); // Clear redo stack when new action is performed
    
    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return { ...slide, ...updates };
      }
      return slide;
    }));
  }, [currentSlideIndex, slides, selectedElement]);

  const addTextBox = useCallback((textType = 'content') => {
    // Set font size and weight based on text type
    let fontSize, fontWeight, content;
    
    switch (textType) {
      case 'title':
        fontSize = 60;
        fontWeight = 'bold';
        content = 'Click to edit title';
        break;
      case 'subtitle':
        fontSize = 36;
        fontWeight = 'bold';
        content = 'Click to edit subtitle';
        break;
      case 'content':
      default:
        fontSize = 24;
        fontWeight = 'normal';
        content = 'Click to edit content';
        break;
    }

    const newTextBox = {
      id: uuidv4(),
      type: 'text',
      content: content,
      x: 100,
      y: 100,
      width: textType === 'title' ? 400 : textType === 'subtitle' ? 300 : 250,
      height: textType === 'title' ? 80 : textType === 'subtitle' ? 50 : 40,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: textFormatting.fontStyle,
      textDecoration: textFormatting.textDecoration,
      textAlign: textFormatting.textAlign,
      color: textFormatting.color
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
    const newChart = {
      id: uuidv4(),
      type: 'chart',
      chartType: chartType || 'bar',
      x: 160,
      y: 160,
      width: 360,
      height: 220,
      labels: ['A', 'B', 'C', 'D'],
      values: [12, 25, 9, 18],
      color: '#0ea5e9'
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

  // Apply/remove dark mode class on body
  React.useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

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
  }, []);

  const handleLaunchPresentify = useCallback(() => {
    setShowLandingPage(false);
    // Automatically enter fullscreen when launching from landing page
    setTimeout(() => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      }
    }, 100);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setShowLandingPage(true);
  }, []);

  const handleProfileSave = useCallback((profileData) => {
    setUserName(profileData.userName);
    setDocumentTitle(profileData.documentTitle);
    setShowProfileModal(false);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, { slides, selectedElement }]);
      setSlides(lastState.slides);
      setSelectedElement(lastState.selectedElement);
      setUndoStack(prev => prev.slice(0, -1));
    }
  }, [undoStack, slides, selectedElement]);

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
        } else if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setManualZoom(z => Math.min(3, z + 0.1));
        } else if (e.key === '-') {
          e.preventDefault();
          setManualZoom(z => Math.max(0.25, z - 0.1));
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
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        slides={slides}
        manualZoom={manualZoom}
        setManualZoom={setManualZoom}
        isPanning={isPanning}
        setIsPanning={setIsPanning}
        onBackToLanding={handleBackToLanding}
        onShowProfile={() => setShowProfileModal(true)}
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
        />
        <Canvas 
          slide={slides[currentSlideIndex]}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          updateSlideElement={updateSlideElement}
          deleteElement={deleteElement}
          textFormatting={textFormatting}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          manualZoom={manualZoom}
          isPanning={isPanning}
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
        />
      </div>
      {showTemplates && (
        <Templates 
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal 
          onClose={() => setShowProfileModal(false)}
          userName={userName}
          documentTitle={documentTitle}
          onSave={handleProfileSave}
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
                  const props = { width: el.width, height: el.height, labels: el.labels, values: el.values, color: el.color };
                  if (el.chartType === 'line') return <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y }}><LineChart {...props} /></div>;
                  if (el.chartType === 'pie') return <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y }}><PieChart {...props} /></div>;
                  return <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y }}><BarChart {...props} /></div>;
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
      
      {/* Canvas Footer with Controls */}
      <CanvasFooter
        manualZoom={manualZoom}
        setManualZoom={setManualZoom}
        isPanning={isPanning}
        setIsPanning={setIsPanning}
        setShowDragMessage={setShowDragMessage}
      />
      
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