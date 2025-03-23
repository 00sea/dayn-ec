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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Track if we should prevent a click after dragging
  const draggedRecently = useRef(false);
  
  // Handle wheel scrolling - attached to window
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

  // Calculate the transform value to ensure consistent positioning
  const calculateTransform = () => {
    if (!itemRefs.current[0]) return 0;
    
    // Get the height of the container
    const containerHeight = carouselRef.current?.clientHeight || 0;
    
    // Calculate middle position of container
    const containerMiddle = containerHeight / 2;
    
    // Calculate offsets for each item to center it in the container
    const offsets = itemRefs.current.map(ref => {
      if (!ref) return 0;
      const itemHeight = ref.clientHeight;
      return containerMiddle - (itemHeight / 2);
    });
    
    // Calculate the position based on active index
    let position = 0;
    for (let i = 0; i < activeIndex; i++) {
      const itemHeight = itemRefs.current[i]?.clientHeight || 0;
      position -= itemHeight;
    }
    
    // Add offset for the active item to center it
    position += offsets[activeIndex] || 0;
    
    // Add drag offset if dragging
    if (isDragging) {
      position += scrollDistance / 2;
    }
    
    return position;
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
  }, [isDragging, items.length]);

  // Reset draggedRecently after a short timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      draggedRecently.current = false;
    }, 300);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  // Initialize refs array when items change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items]);

  // Force a re-render when window is resized to recalculate positions
  useEffect(() => {
    const handleResize = () => {
      // Just forcing a re-render
      setScrollDistance(0);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="relative h-60 cursor-grab"
      ref={carouselRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{ touchAction: 'none' }} // Prevents default touch behaviors
    >
      <div 
        className="w-140 transition-transform duration-800 ease-out"
        style={{ 
          transform: `translateY(${calculateTransform()}px)`,
        }}
      >
        {items.map((item, index) => (
          <div 
            key={item.id}
            ref={el => itemRefs.current[index] = el}
            className={`
              py-6 flex items-center justify-start font-watch font-bold
              ${index === activeIndex ? 'opacity-100 text-white cursor-pointer' : 'opacity-100 text-white/0'} 
            `}
            style={{ 
              // Apply stroke effect for inactive items
              WebkitTextStroke: index === activeIndex ? 'initial' : '0.2px white',
            }}
            onClick={() => handleItemClick(index, item.path)}
          >
            <span className="block text-6xl leading-normal">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalCarousel;