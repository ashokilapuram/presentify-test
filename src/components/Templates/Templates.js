import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Templates.css';

const Templates = ({ onSelectTemplate, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/templates/index.json');
      const data = await response.json();
      setTemplates(data.templates);
      setLoading(false);
    } catch (error) {
      console.error('Error loading templates:', error);
      setLoading(false);
    }
  };

  const loadTemplate = async (templateFile) => {
    try {
      const response = await fetch(`/templates/${templateFile}`);
      const template = await response.json();
      return template;
    } catch (error) {
      console.error('Error loading template:', error);
      return null;
    }
  };

  const handleTemplateSelect = async (template) => {
    const templateData = await loadTemplate(template.file);
    if (templateData && onSelectTemplate) {
      onSelectTemplate(templateData);
    }
    if (onClose) {
      onClose();
    }
  };

  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const modalContent = (
    <div className="templates-modal-overlay" onClick={onClose}>
      <div className="templates-content" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <>
            <div className="templates-header">
              <h2>Loading Templates...</h2>
              <button className="templates-close" onClick={onClose}>×</button>
            </div>
            <div className="templates-loading">
              <div className="loading-spinner"></div>
            </div>
          </>
        ) : (
          <>
            <div className="templates-header">
              <h2>Choose a Template</h2>
              <button className="templates-close" onClick={onClose}>×</button>
            </div>
            
            <div className="templates-categories">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="templates-grid">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className={`template-card template-${template.category.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="template-thumbnail">
                    <div className="template-preview">
                      <div className="preview-slide">
                        <div className="preview-title">{template.name}</div>
                        <div className="preview-category">{template.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className="template-info">
                    <p>{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Templates;


