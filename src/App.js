import React, { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import Templates from './components/Templates';
import RightToolbar from './components/RightToolbar';
import { v4 as uuidv4 } from 'uuid';

function App() {
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
  const [activeToolbarTab, setActiveToolbarTab] = useState('Home');
  const [textFormatting, setTextFormatting] = useState({
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    color: '#000000'
  });

  const addSlide = useCallback(() => {
    const newSlide = {
      id: uuidv4(),
      elements: []
    };
    setSlides(prev => [...prev, newSlide]);
  }, []);

  const addSlideFromTemplate = useCallback((template) => {
    const newSlide = {
      id: uuidv4(),
      elements: template.elements.map(element => ({
        ...element,
        id: uuidv4()
      }))
    };
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(prev => prev + 1);
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

  const updateSlideElement = useCallback((elementId, updates) => {
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
  }, [currentSlideIndex]);

  const addTextBox = useCallback(() => {
    const newTextBox = {
      id: uuidv4(),
      type: 'text',
      content: 'Click to edit text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: textFormatting.fontSize,
      fontWeight: textFormatting.fontWeight,
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
        onActiveTabChange={setActiveToolbarTab}
      />
      <div className="app-body">
        <Sidebar 
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          addSlide={addSlide}
          deleteSlide={deleteSlide}
          onShowTemplates={() => setShowTemplates(true)}
        />
        <Canvas 
          slide={slides[currentSlideIndex]}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          updateSlideElement={updateSlideElement}
          deleteElement={deleteElement}
          textFormatting={textFormatting}
        />
        <RightToolbar 
          activeTab={activeToolbarTab}
          selectedElement={selectedElement}
          textFormatting={textFormatting}
          setTextFormatting={setTextFormatting}
          updateSlideElement={updateSlideElement}
          addTextBox={addTextBox}
          addShape={addShape}
          addImage={addImage}
        />
      </div>
      {showTemplates && (
        <Templates 
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

export default App;