import React, { useState, useEffect, useRef } from 'react';

interface CarouselItem {
  id: string;
  label: string;
  path: string;
}

interface VerticalCarouselProps {
  items: CarouselItem[];
  initialIndex?: number;
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ 
  items, 
  initialIndex = 0 
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  // No router for Vite + React

  // Track if we should prevent a click after dragging
  const draggedRecently = useRef(false);
  
  // Handle wheel scrolling - now defined but will be added to window
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      // Scrolling down
      setActiveIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
    } else {
      // Scrolling up
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Handle mouse/touch down for dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setScrollDistance(0);
    draggedRecently.current = false;
  };

  // Handle mouse/touch move for dragging
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newDistance = clientY - startY;
    
    setScrollDistance(newDistance);
    
    // If drag distance exceeds threshold, consider it a significant drag
    if (Math.abs(newDistance) > 50) {
      draggedRecently.current = true;
    }
  };

  // Handle mouse/touch up to end dragging
  const handleDragEnd = () => {
    if (isDragging) {
      // If scroll distance is significant, change the active index
      if (scrollDistance > 50 && activeIndex > 0) {
        // Dragged down, go to previous
        setActiveIndex(prev => prev - 1);
      } else if (scrollDistance < -50 && activeIndex < items.length - 1) {
        // Dragged up, go to next
        setActiveIndex(prev => prev + 1);
      }
      
      setIsDragging(false);
    }
  };

  // Handle click on carousel item
  const handleItemClick = (index: number, path: string) => {
    // If we recently dragged significantly, prevent navigation
    if (draggedRecently.current) {
      draggedRecently.current = false;
      return;
    }
    
    if (index === activeIndex) {
      // Only navigate if clicking the active item
      window.location.href = path;
    } else {
      // Otherwise, make this item active
      setActiveIndex(index);
    }
  };

  // Set up listeners for drag events and wheel scrolling on the entire document
  useEffect(() => {
    // Mouse/touch drag handling
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDragMove(e as unknown as React.MouseEvent);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    // Add the wheel event listener to the window to capture scroll events anywhere
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalMouseMove as unknown as EventListener);
    document.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      // Clean up all event listeners when component unmounts
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalMouseMove as unknown as EventListener);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, items.length]); // Added items.length as dependency for handleWheel

  // Reset draggedRecently after a short timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      draggedRecently.current = false;
    }, 300);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  return (
    <div 
      className="relative h-50 cursor-grab"
      ref={carouselRef}
      // Wheel events now handled at window level
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{ touchAction: 'none' }} // Prevents default touch behaviors
    >
      <div 
        className="w-140 transition-transform duration-500 ease-out"
        style={{ 
          transform: `translateY(${-(activeIndex * 100) + (isDragging ? scrollDistance / 2 : 0)}px)`,
        }}
      >
        {items.map((item, index) => {
          
          return (
            <div 
              key={item.id}
              className={`
                h-30 flex items-center justify-start space-y-7 font-watch font-bold
                ${index === activeIndex ? 'opacity-100 text-white cursor-pointer' : 'opacity-100 text-white/0'} 
              `}
              style={{ 
                // Apply stroke effect for inactive items
                WebkitTextStroke: index === activeIndex ? 'initial' : '0.2px white',
                transformOrigin: 'left center',
              }}
              onClick={() => handleItemClick(index, item.path)}
            >
              <span className="block text-6xl">{item.label}</span>
            </div>
          );
        })}
      </div>
      
      {/* Optional navigation indicators */}
      {/* <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2 mr-4">
        {items.map((_, index) => (
          <div
            key={`indicator-${index}`}
            className={`w-2 h-2 rounded-full cursor-pointer
              ${index === activeIndex ? 'bg-white' : 'bg-white/30'}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default VerticalCarousel;