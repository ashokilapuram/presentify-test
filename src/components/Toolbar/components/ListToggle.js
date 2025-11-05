import React from 'react';
import { List, ListOrdered } from 'lucide-react';

/**
 * List toggle button component
 */
const ListToggle = ({ 
  selectedElement, 
  textFormatting, 
  onToggleList 
}) => {
  const current = selectedElement?.listType || textFormatting.listType || 'none';
  
  const getIcon = () => {
    if (current === 'none' || current === 'bullet') {
      return <List size={16} strokeWidth={2} />;
    } else {
      return <ListOrdered size={16} strokeWidth={2} />;
    }
  };

  const getTitle = () => {
    if (current === 'none') return 'Bullet List';
    if (current === 'bullet') return 'Numbered List';
    return 'Turn Off List';
  };

  return (
    <button
      className={`toolbar-button ${current !== 'none' ? 'active' : ''}`}
      title={getTitle()}
      onClick={(e) => {
        e.stopPropagation();
        onToggleList();
      }}
    >
      {getIcon()}
    </button>
  );
};

export default ListToggle;

