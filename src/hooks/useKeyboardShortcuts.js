import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  selectedElement,
  addSlide,
  addTextBox,
  updateSlideElement,
  deleteElement,
  setTextFormatting,
  undo,
  redo
}) => {
  useEffect(() => {
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
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              undo();
            } else {
              e.preventDefault();
              redo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
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
  }, [selectedElement, addSlide, addTextBox, updateSlideElement, deleteElement, setTextFormatting, undo, redo]);
};
