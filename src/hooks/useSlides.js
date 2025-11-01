import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useSlides = () => {
  const [slides, setSlides] = useState([
    {
      id: uuidv4(),
      elements: []
    }
  ]);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);

  const addSlide = useCallback((onSnapshot) => {
    // snapshot BEFORE
    onSnapshot({ slides, selectedElement, currentSlideIndex });

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
  }, [slides, selectedElement, currentSlideIndex]);

  const duplicateSlide = useCallback((slideIndex, onSnapshot) => {
    // --- Save current state before action ---
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    const slideToDuplicate = slides[slideIndex];
    const duplicatedSlide = {
      ...slideToDuplicate,
      id: uuidv4(),
      elements: slideToDuplicate.elements.map(element => ({
        ...element,
        id: uuidv4()
      }))
    };

    setSlides(prev => {
      const newSlides = [...prev];
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide);
      return newSlides;
    });

    // make duplicated slide active
    setCurrentSlideIndex(slideIndex + 1);
  }, [slides, selectedElement, currentSlideIndex]);

  const deleteSlide = useCallback((slideIndex, onSnapshot) => {
    // --- Save current state before delete ---
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    // perform delete
    if (slides.length > 1) {
      setSlides(prev => prev.filter((_, index) => index !== slideIndex));
      if (currentSlideIndex >= slideIndex && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      }
    } else {
      // if only one slide → reset to fresh one
      setSlides([{ id: uuidv4(), elements: [] }]);
      setCurrentSlideIndex(0);
    }
  }, [slides, selectedElement, currentSlideIndex]);

  const reorderSlides = useCallback((fromIndex, toIndex, onSnapshot) => {
    // Snapshot BEFORE the reorder for undo functionality
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    // Perform the reorder
    setSlides(prev => {
      const newSlides = [...prev];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      return newSlides;
    });

    // Make the moved slide active on canvas
    setCurrentSlideIndex(toIndex);
  }, [slides, selectedElement, currentSlideIndex]);

  const updateSlideElement = useCallback((elementId, rawUpdates, onSnapshot) => {
    const { __internal, ...updates } = rawUpdates || {};
    if (!__internal) {
      // one clean snapshot BEFORE applying the change
      onSnapshot({ slides, selectedElement, currentSlideIndex });
    }

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

  const updateSlide = useCallback((updates, onSnapshot) => {
    // Save current state to undo stack with debouncing
    onSnapshot({ slides, selectedElement, currentSlideIndex });
    
    setSlides(prev => prev.map((slide, index) => {
      if (index === currentSlideIndex) {
        return { ...slide, ...updates };
      }
      return slide;
    }));
  }, [currentSlideIndex, slides, selectedElement]);

  const addTextBox = useCallback((textType = 'content', textFormatting, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

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
  }, [slides, selectedElement, currentSlideIndex]);

  const deleteElement = useCallback((elementId, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

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
  }, [slides, selectedElement, currentSlideIndex]);

  const addShape = useCallback((shapeType, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

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
  }, [slides, selectedElement, currentSlideIndex]);

  const addImage = useCallback((onSnapshot) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // snapshot BEFORE inserting the image
          onSnapshot({ slides, selectedElement, currentSlideIndex });

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
  }, [slides, selectedElement, currentSlideIndex]);

  const addChart = useCallback((chartType, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

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
  }, [slides, selectedElement, currentSlideIndex]);

  // Layer reordering for elements
  const bringForward = useCallback((elementId, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    setSlides(prev => prev.map((slide, i) => {
      if (i === currentSlideIndex) {
        const newElements = [...slide.elements];
        const index = newElements.findIndex(el => el.id === elementId);
        if (index > -1 && index < newElements.length - 1) {
          [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
        }
        return { ...slide, elements: newElements };
      }
      return slide;
    }));
  }, [slides, selectedElement, currentSlideIndex]);

  const sendBackward = useCallback((elementId, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    setSlides(prev => prev.map((slide, i) => {
      if (i === currentSlideIndex) {
        const newElements = [...slide.elements];
        const index = newElements.findIndex(el => el.id === elementId);
        if (index > 0) {
          [newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]];
        }
        return { ...slide, elements: newElements };
      }
      return slide;
    }));
  }, [slides, selectedElement, currentSlideIndex]);

  const bringToFront = useCallback((elementId, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    setSlides(prev => prev.map((slide, i) => {
      if (i === currentSlideIndex) {
        const newElements = slide.elements.filter(el => el.id !== elementId);
        const element = slide.elements.find(el => el.id === elementId);
        if (element) newElements.push(element);
        return { ...slide, elements: newElements };
      }
      return slide;
    }));
  }, [slides, selectedElement, currentSlideIndex]);

  const sendToBack = useCallback((elementId, onSnapshot) => {
    onSnapshot({ slides, selectedElement, currentSlideIndex });

    setSlides(prev => prev.map((slide, i) => {
      if (i === currentSlideIndex) {
        const newElements = slide.elements.filter(el => el.id !== elementId);
        const element = slide.elements.find(el => el.id === elementId);
        if (element) newElements.unshift(element);
        return { ...slide, elements: newElements };
      }
      return slide;
    }));
  }, [slides, selectedElement, currentSlideIndex]);

  return {
    // State
    slides,
    setSlides,
    currentSlideIndex,
    setCurrentSlideIndex,
    selectedElement,
    setSelectedElement,
    
    // Actions
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    updateSlideElement,
    updateSlide,
    addTextBox,
    deleteElement,
    addShape,
    addImage,
    addChart,
    
    // Layer ordering
    bringForward,
    bringToFront,
    sendBackward,
    sendToBack
  };
};
