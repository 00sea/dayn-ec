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
  // Core carousel state
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  
  // New state for interactive behaviors
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [isFocusedLinkHovered, setIsFocusedLinkHovered] = useState(false);
  
  // Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggedRecently = useRef(false);
  
  // Handle wheel scrolling - only when carousel is active
  const handleWheel = (e: WheelEvent) => {
    // Only handle wheel events if the carousel is active
    if (!isCarouselActive) return;
    
    e.preventDefault();
    if (e.deltaY > 0) {
      // Scrolling down
      setActiveIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
    } else {
      // Scrolling up
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Handle mouse/touch down for dragging - only when carousel is active
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Only allow dragging if the carousel is active
    if (!isCarouselActive) return;
    
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
    
    // Only process clicks when carousel is active
    if (!isCarouselActive) return;
    
    // Only allow clicks on focused item or adjacent items
    if (index === activeIndex) {
      // Navigate if clicking the active item
      window.location.href = path;
    } else if (isAdjacent(index)) {
      // Make adjacent item active
      setActiveIndex(index);
    }
    // Ignore clicks on non-adjacent items
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
  
  // Determine if an item is adjacent to the active item
  const isAdjacent = (index: number) => {
    return index === activeIndex - 1 || index === activeIndex + 1;
  };
  
  // Determine item visibility class based on its state
  const getItemVisibilityClass = (index: number) => {
    if (index === activeIndex) {
      // Always visible
      return 'opacity-100';
    } else if (isAdjacent(index) && isCarouselActive) {
      // Adjacent items are visible when carousel is active
      return 'opacity-100 transition-opacity duration-300';
    } else {
      // Non-adjacent items or when carousel is inactive
      return 'opacity-0 transition-opacity duration-300';
    }
  };
  
  // Calculate slide offset for each item (in pixels for more precise control)
  const getItemSlideOffset = (index: number) => {
    if (index === activeIndex) {
      // Focused item doesn't slide
      return 0;
    } else if (index === activeIndex - 1) {
      // Item above focused (slides down when active)
      return isCarouselActive ? 20 : -100;  // 30px slide distance
    } else if (index === activeIndex + 1) {
      // Item below focused (slides up when active)
      return isCarouselActive ? -20 : 100;  // 30px slide distance
    } else {
      // Non-adjacent items slide further away
      return index < activeIndex ? -60 : 60;
    }
  };
  
  // Determine text color for the focused item when hovered
  const getFocusedItemColor = (index: number) => {
    if (index === activeIndex && isFocusedLinkHovered) {
      return 'text-white'; // Purple color when focused item is hovered
    } else if (index === activeIndex) {
      return 'text-white'; // White for focused item (not hovered)
    } else {
      return 'text-white/0'; // Transparent text with stroke for non-focused items
    }
  };

  // Set up listeners for drag events and wheel scrolling
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
    
    // Add the wheel event listener to the window
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalMouseMove as unknown as EventListener);
    document.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalMouseMove as unknown as EventListener);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, items.length, isCarouselActive]); // Added isCarouselActive dependency

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
      className="relative h-60"
      ref={carouselRef}
      onMouseEnter={() => setIsCarouselActive(true)}
      onMouseLeave={() => setIsCarouselActive(false)}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{ touchAction: 'none' }} // Prevents default touch behaviors
    >
      <div 
        className="w-140 transition-transform duration-500 ease-out"
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
              transition-opacity duration-300 ease-out
              ${getItemVisibilityClass(index)}
              ${index === activeIndex || (isAdjacent(index) && isCarouselActive) ? 'cursor-pointer' : 'cursor-default'}
            `}
            style={{ 
              // Apply stroke effect for inactive items
              WebkitTextStroke: index === activeIndex ? 'initial' : '0.2px white',
              // Apply slide offset with transition
              transform: `translateY(${getItemSlideOffset(index)}px)`,
              transition: 'transform 300ms ease-out, opacity 300ms ease-out',
            }}
            onClick={() => handleItemClick(index, item.path)}
            onMouseEnter={() => index === activeIndex && setIsFocusedLinkHovered(true)}
            onMouseLeave={() => index === activeIndex && setIsFocusedLinkHovered(false)}
          >
            <span 
              className={`block text-6xl leading-normal transition-colors duration-300 ${getFocusedItemColor(index)}`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalCarousel;