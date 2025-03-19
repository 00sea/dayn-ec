import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className = '' }) => {
  return (
    <Link 
      to={to} 
      className={`transition-colors duration-300 font-medium font-nav ${
        className.includes('text-white') 
          ? className 
          : `text-gray-700 hover:text-primary ${className}`
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;