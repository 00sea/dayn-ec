import React from 'react';

interface NavCarouselLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const NavCarouselLink: React.FC<NavCarouselLinkProps> = ({
  to,
  children,
  isActive,
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <a
      href={isActive ? to : '#'}
      onClick={(e) => {
        if (!isActive) {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      className={`block cursor-pointer ${className}`}
      style={style}
    >
      {children}
    </a>
  );
};

export default NavCarouselLink;