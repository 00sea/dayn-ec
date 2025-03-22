import React from 'react';

interface CarouselProgressProps {
  totalItems: number;
  activeIndex: number;
  onChange?: (index: number) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const CarouselProgress: React.FC<CarouselProgressProps> = ({
  totalItems,
  activeIndex,
  onChange,
  orientation = 'vertical',
  className = '',
}) => {
  // Generate array of indices for mapping
  const indices = Array.from({ length: totalItems }, (_, i) => i);
  
  // Handle click on indicator dot
  const handleIndicatorClick = (index: number) => {
    if (onChange) {
      onChange(index);
    }
  };

  // Determine container classes based on orientation
  const containerClasses = orientation === 'vertical'
    ? 'flex flex-col space-y-3'
    : 'flex flex-row space-x-3';

  return (
    <div className={`${containerClasses} ${className}`}>
      {indices.map((index) => (
        <button
          key={`progress-${index}`}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${index === activeIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}
            ${onChange ? 'cursor-pointer' : ''}
          `}
          onClick={() => handleIndicatorClick(index)}
          aria-label={`Go to item ${index + 1}`}
          aria-current={index === activeIndex ? 'true' : 'false'}
        />
      ))}
    </div>
  );
};

export default CarouselProgress;