import React, { useState } from 'react';
import { 
  FiLayout, 
  FiImage, 
  FiType, 
  FiBarChart2, 
  FiUsers, 
  FiTrendingUp,
  FiStar,
  FiCheck
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

const Templates = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateCategories = [
    { id: 'all', name: 'All Templates', icon: FiLayout },
    { id: 'business', name: 'Business', icon: FiTrendingUp },
    { id: 'education', name: 'Education', icon: FiUsers },
    { id: 'marketing', name: 'Marketing', icon: FiBarChart2 },
    { id: 'creative', name: 'Creative', icon: FiStar }
  ];

  const slideTemplates = [
    {
      id: 'title-slide',
      name: 'Title Slide',
      category: 'business',
      premium: false,
      thumbnail: '/api/placeholder/300/200',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Your Presentation Title',
          x: 150,
          y: 150,
          width: 600,
          height: 90,
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1e293b',
          fontFamily: 'Playfair Display'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Subtitle or tagline goes here',
          x: 225,
          y: 260,
          width: 450,
          height: 45,
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
          y: 340,
          width: 300,
          height: 3,
          fillColor: '#0ea5e9',
          borderColor: 'transparent',
          borderWidth: 0
        }
      ]
    },
    {
      id: 'content-layout',
      name: 'Content & Image',
      category: 'business',
      premium: false,
      thumbnail: '/api/placeholder/300/200',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Section Title',
          x: 100,
          y: 80,
          width: 500,
          height: 80,
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'left',
          color: '#1e293b',
          fontFamily: 'Playfair Display'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: '• Key point one\n• Key point two\n• Key point three\n• Key point four',
          x: 100,
          y: 200,
          width: 500,
          height: 300,
          fontSize: 24,
          fontWeight: 'normal',
          textAlign: 'left',
          color: '#475569',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'shape',
          shapeType: 'rectangle',
          x: 650,
          y: 150,
          width: 400,
          height: 300,
          fillColor: '#f1f5f9',
          borderColor: '#e2e8f0',
          borderWidth: 2
        }
      ]
    },
    {
      id: 'quote-slide',
      name: 'Quote Slide',
      category: 'creative',
      premium: true,
      thumbnail: '/api/placeholder/300/200',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: '"Innovation distinguishes between a leader and a follower."',
          x: 200,
          y: 250,
          width: 800,
          height: 150,
          fontSize: 42,
          fontWeight: '500',
          textAlign: 'center',
          color: '#1e293b',
          fontFamily: 'Playfair Display',
          fontStyle: 'italic'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: '— Steve Jobs',
          x: 200,
          y: 420,
          width: 800,
          height: 60,
          fontSize: 24,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'shape',
          shapeType: 'rectangle',
          x: 150,
          y: 240,
          width: 6,
          height: 180,
          fillColor: '#0ea5e9',
          borderColor: 'transparent',
          borderWidth: 0
        }
      ]
    },
    {
      id: 'stats-slide',
      name: 'Statistics',
      category: 'marketing',
      premium: true,
      thumbnail: '/api/placeholder/300/200',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Key Statistics',
          x: 100,
          y: 80,
          width: 600,
          height: 80,
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'left',
          color: '#1e293b',
          fontFamily: 'Playfair Display'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: '85%',
          x: 150,
          y: 200,
          width: 200,
          height: 120,
          fontSize: 72,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#0ea5e9',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Customer Satisfaction',
          x: 150,
          y: 320,
          width: 200,
          height: 60,
          fontSize: 18,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: '2.5M+',
          x: 450,
          y: 200,
          width: 200,
          height: 120,
          fontSize: 72,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#10b981',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Active Users',
          x: 450,
          y: 320,
          width: 200,
          height: 60,
          fontSize: 18,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: '150+',
          x: 750,
          y: 200,
          width: 200,
          height: 120,
          fontSize: 72,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#f59e0b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Countries',
          x: 750,
          y: 320,
          width: 200,
          height: 60,
          fontSize: 18,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        }
      ]
    },
    {
      id: 'team-slide',
      name: 'Team Introduction',
      category: 'business',
      premium: true,
      thumbnail: '/api/placeholder/300/200',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Meet Our Team',
          x: 100,
          y: 80,
          width: 600,
          height: 80,
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'left',
          color: '#1e293b',
          fontFamily: 'Playfair Display'
        },
        {
          id: uuidv4(),
          type: 'shape',
          shapeType: 'circle',
          x: 200,
          y: 200,
          width: 150,
          height: 150,
          fillColor: '#e2e8f0',
          borderColor: '#cbd5e1',
          borderWidth: 2
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'John Doe',
          x: 150,
          y: 370,
          width: 250,
          height: 40,
          fontSize: 24,
          fontWeight: '600',
          textAlign: 'center',
          color: '#1e293b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'CEO & Founder',
          x: 150,
          y: 410,
          width: 250,
          height: 30,
          fontSize: 16,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'shape',
          shapeType: 'circle',
          x: 500,
          y: 200,
          width: 150,
          height: 150,
          fillColor: '#e2e8f0',
          borderColor: '#cbd5e1',
          borderWidth: 2
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Jane Smith',
          x: 450,
          y: 370,
          width: 250,
          height: 40,
          fontSize: 24,
          fontWeight: '600',
          textAlign: 'center',
          color: '#1e293b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'CTO',
          x: 450,
          y: 410,
          width: 250,
          height: 30,
          fontSize: 16,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        }
      ]
    },
    {
      id: 'thank-you',
      name: 'Thank You',
      category: 'business',
      premium: false,
      thumbnail: '/api/placeholder/300/200',
      elements: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Thank You',
          x: 300,
          y: 200,
          width: 600,
          height: 120,
          fontSize: 72,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1e293b',
          fontFamily: 'Playfair Display'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Questions & Discussion',
          x: 300,
          y: 350,
          width: 600,
          height: 60,
          fontSize: 28,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'Inter'
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'contact@company.com',
          x: 300,
          y: 450,
          width: 600,
          height: 40,
          fontSize: 20,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#0ea5e9',
          fontFamily: 'Inter'
        }
      ]
    }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? slideTemplates 
    : slideTemplates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="templates-overlay">
      <div className="templates-modal">
        <div className="templates-header">
          <h2 className="templates-title">Choose a Template</h2>
          <button className="templates-close" onClick={onClose}>×</button>
        </div>
        
        <div className="templates-categories">
          {templateCategories.map(category => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <IconComponent size={20} />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className={`template-card ${template.premium ? 'premium' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-preview">
                <div className="template-canvas">
                  {template.elements.map((element, index) => (
                    <div
                      key={index}
                      className="template-element"
                      style={{
                        position: 'absolute',
                        left: `${(element.x / 900) * 100}%`,
                        top: `${(element.y / 506) * 100}%`,
                        width: `${(element.width / 900) * 100}%`,
                        height: `${(element.height / 506) * 100}%`,
                        fontSize: `${element.fontSize * 0.1}px`,
                        fontWeight: element.fontWeight,
                        textAlign: element.textAlign,
                        color: element.color,
                        fontFamily: element.fontFamily,
                        fontStyle: element.fontStyle,
                        backgroundColor: element.type === 'shape' ? element.fillColor : 'transparent',
                        borderRadius: element.type === 'shape' && element.shapeType === 'circle' ? '50%' : '0',
                        border: element.type === 'shape' && element.borderWidth > 0 
                          ? `${element.borderWidth * 0.1}px solid ${element.borderColor}` 
                          : 'none',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: element.textAlign === 'center' ? 'center' : 'flex-start'
                      }}
                    >
                      {element.type === 'text' && (
                        <span style={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.2,
                          fontSize: 'inherit'
                        }}>
                          {element.content}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {template.premium && (
                  <div className="premium-badge">
                    <FiStar size={12} />
                    Premium
                  </div>
                )}
              </div>
              <div className="template-info">
                <h3 className="template-name">{template.name}</h3>
                <button className="use-template-btn">
                  <FiCheck size={16} />
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
