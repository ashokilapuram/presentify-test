import html2canvas from 'html2canvas';

export const downloadPresentation = async (slides, currentSlideIndex) => {
  try {
    // Dynamically import PptxGenJS to avoid webpack issues
    const { default: PptxGenJS } = await import('pptxgenjs');
    
    // Create a new presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.defineLayout({ name: 'PRES_16x9', width: 10, height: 5.625 });
    pptx.layout = 'PRES_16x9';
    
    // Set presentation metadata
    pptx.author = 'Presentify';
    pptx.company = 'Presentify';
    pptx.title = 'Presentation';
    pptx.subject = 'Created with Presentify';
    
    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      // Create a new slide
      const pptxSlide = pptx.addSlide();
      
      // Set slide background
      if (slide.backgroundColor) {
        pptxSlide.background = { fill: slide.backgroundColor };
      }
      
      if (slide.backgroundImage) {
        try {
          pptxSlide.background = { 
            fill: { 
              type: 'picture', 
              data: slide.backgroundImage 
            } 
          };
        } catch (error) {
          console.warn('Could not set background image:', error);
        }
      }
      
      // Process each element in the slide
      for (const element of slide.elements) {
        try {
          switch (element.type) {
            case 'text':
              // Clean HTML content for PowerPoint
              const cleanContent = element.content
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
                .replace(/&amp;/g, '&') // Replace &amp; with &
                .replace(/&lt;/g, '<') // Replace &lt; with <
                .replace(/&gt;/g, '>') // Replace &gt; with >
                .replace(/&quot;/g, '"') // Replace &quot; with "
                .trim();
              
              // Add text element
              pptxSlide.addText(cleanContent, {
                x: (element.x / 800) * 10, // Convert to inches (assuming 800px width)
                y: (element.y / 450) * 5.625, // Convert to inches (assuming 450px height)
                w: (element.width / 800) * 10,
                h: (element.height / 450) * 5.625,
                fontSize: Math.max(8, (element.fontSize || 16) * 0.75), // Scale down font size
                fontFace: element.fontFamily || 'Arial',
                color: element.color || '#000000',
                bold: element.fontWeight === 'bold',
                italic: element.fontStyle === 'italic',
                underline: element.textDecoration === 'underline',
                align: element.textAlign || 'left',
                valign: 'top',
                wrap: 'overflow'
              });
              break;
              
            case 'shape':
              // Add shape element
              const shapeProps = {
                x: (element.x / 800) * 10,
                y: (element.y / 450) * 5.625,
                w: (element.width / 800) * 10,
                h: (element.height / 450) * 5.625,
                fill: { color: element.fillColor || '#2d9cdb' },
                line: { 
                  color: element.borderColor || '#1e7bb8', 
                  width: Math.max(0.1, (element.borderWidth || 2) * 0.1) // Convert px to inches
                }
              };
              
              switch (element.shapeType) {
                case 'rectangle':
                  pptxSlide.addShape('rect', shapeProps);
                  break;
                case 'circle':
                  pptxSlide.addShape('ellipse', shapeProps);
                  break;
                case 'triangle':
                  pptxSlide.addShape('triangle', shapeProps);
                  break;
                default:
                  pptxSlide.addShape('rect', shapeProps);
              }
              break;
              
            case 'image':
              // Add image element
              try {
                pptxSlide.addImage({
                  data: element.src,
                  x: (element.x / 800) * 10,
                  y: (element.y / 450) * 5.625,
                  w: (element.width / 800) * 10,
                  h: (element.height / 450) * 5.625
                });
              } catch (error) {
                console.warn('Could not add image:', error);
                // Add placeholder text instead
                pptxSlide.addText('Image', {
                  x: (element.x / 800) * 10,
                  y: (element.y / 450) * 5.625,
                  w: (element.width / 800) * 10,
                  h: (element.height / 450) * 5.625,
                  fontSize: 12,
                  color: '#666666',
                  align: 'center',
                  valign: 'middle',
                  fill: { color: '#f0f0f0' }
                });
              }
              break;
              
            case 'chart':
              // Add chart element (simplified representation)
              pptxSlide.addText(`Chart: ${element.chartType || 'bar'}`, {
                x: (element.x / 800) * 10,
                y: (element.y / 450) * 5.625,
                w: (element.width / 800) * 10,
                h: (element.height / 450) * 5.625,
                fontSize: 14,
                color: '#6b7280',
                align: 'center',
                valign: 'middle',
                fill: { color: '#f3f4f6' },
                line: { color: '#9ca3af', width: 0.1, dashType: 'dash' }
              });
              break;
          }
        } catch (elementError) {
          console.warn(`Error processing element ${element.type}:`, elementError);
        }
      }
    }
    
    // Generate and download the presentation
    const filename = `presentation-${new Date().toISOString().split('T')[0]}.pptx`;
    await pptx.writeFile({ fileName: filename });
    
    console.log('PowerPoint presentation downloaded successfully!');
    
  } catch (error) {
    console.error('Error downloading PowerPoint presentation:', error);
    console.log('Falling back to HTML export...');
    
    // Fallback to HTML export
    try {
      const presentationHTML = generatePresentationHTML(slides);
      
      // Create and download HTML file
      const blob = new Blob([presentationHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `presentation-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Presentation downloaded as HTML! You can open this in PowerPoint or any presentation software.');
      alert('PowerPoint generation failed, but presentation has been downloaded as HTML. You can open this in PowerPoint or any presentation software.');
    } catch (htmlError) {
      console.error('Error downloading HTML presentation:', htmlError);
      alert('Error downloading presentation. Please try again.');
    }
  }
};

const generatePresentationHTML = (slides) => {
  const slideHTML = slides.map((slide, index) => {
    const elementsHTML = slide.elements.map(element => {
      switch (element.type) {
        case 'text':
          return `
            <div style="
              position: absolute;
              left: ${element.x}px;
              top: ${element.y}px;
              width: ${element.width}px;
              height: ${element.height}px;
              font-size: ${element.fontSize || 16}px;
              font-family: ${element.fontFamily || 'Arial'};
              color: ${element.color || '#000000'};
              font-weight: ${element.fontWeight || 'normal'};
              font-style: ${element.fontStyle || 'normal'};
              text-decoration: ${element.textDecoration || 'none'};
              text-align: ${element.textAlign || 'left'};
              background-color: ${element.backgroundColor || 'transparent'};
              padding: 8px;
              overflow: hidden;
            ">${element.content}</div>
          `;
        case 'shape':
          return `
            <div style="
              position: absolute;
              left: ${element.x}px;
              top: ${element.y}px;
              width: ${element.width}px;
              height: ${element.height}px;
              background-color: ${element.fillColor || '#2d9cdb'};
              border: ${element.borderWidth || 2}px solid ${element.borderColor || '#1e7bb8'};
              border-radius: ${element.shapeType === 'circle' ? '50%' : '0'};
            "></div>
          `;
        case 'image':
          return `
            <img src="${element.src}" alt="" style="
              position: absolute;
              left: ${element.x}px;
              top: ${element.y}px;
              width: ${element.width}px;
              height: ${element.height}px;
              object-fit: contain;
            " />
          `;
        case 'chart':
          return `
            <div style="
              position: absolute;
              left: ${element.x}px;
              top: ${element.y}px;
              width: ${element.width}px;
              height: ${element.height}px;
              background-color: #f3f4f6;
              border: 2px dashed #9ca3af;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #6b7280;
              font-size: 14px;
              font-weight: 500;
            ">Chart: ${element.chartType || 'bar'}</div>
          `;
        default:
          return '';
      }
    }).join('');
    
    return `
      <div class="slide" style="
        width: 800px;
        height: 450px;
        position: relative;
        background-color: ${slide.backgroundColor || '#ffffff'};
        background-image: ${slide.backgroundImage ? `url(${slide.backgroundImage})` : 'none'};
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        margin: 20px auto;
        border: 1px solid #ddd;
        page-break-after: always;
      ">
        ${elementsHTML}
      </div>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Presentation Export</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .presentation {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .slide {
          margin-bottom: 40px;
        }
        .slide:last-child {
          margin-bottom: 0;
        }
        @media print {
          body { background: white; }
          .presentation { box-shadow: none; }
          .slide { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <div class="presentation">
        <h1 style="text-align: center; margin-bottom: 30px;">Presentation Export</h1>
        ${slideHTML}
      </div>
    </body>
    </html>
  `;
};

// Alternative method using html2canvas for more accurate visual representation
export const downloadPresentationAsImages = async (slides, currentSlideIndex) => {
  try {
    const canvas = document.querySelector('.canvas');
    if (!canvas) {
      throw new Error('Canvas not found');
    }
    
    const images = [];
    
    // Capture each slide
    for (let i = 0; i < slides.length; i++) {
      // Switch to the slide (this would need to be handled by the parent component)
      // For now, we'll capture the current slide
      if (i === currentSlideIndex) {
        const canvasElement = canvas.cloneNode(true);
        canvasElement.style.position = 'absolute';
        canvasElement.style.top = '0';
        canvasElement.style.left = '0';
        canvasElement.style.zIndex = '9999';
        document.body.appendChild(canvasElement);
        
        const canvasData = await html2canvas(canvasElement, {
          width: 800,
          height: 450,
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        document.body.removeChild(canvasElement);
        images.push(canvasData.toDataURL('image/png'));
      }
    }
    
    // Create a zip file with images (simplified approach - just download first image)
    if (images.length > 0) {
      const link = document.createElement('a');
      link.download = `slide-${currentSlideIndex + 1}.png`;
      link.href = images[0];
      link.click();
    }
    
  } catch (error) {
    console.error('Error capturing slide:', error);
    alert('Error capturing slide. Please try again.');
  }
};
