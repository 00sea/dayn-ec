import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import { HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi2';
// import { HiOutlineSearch } from "react-icons/hi";
// import { PiInstagramLogoThin } from "react-icons/pi";


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black shadow-md' : 'bg-transparent'}`}>
      <div className="mx-auto px-4 sm:px-1 lg:px-8">

        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-15">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className={`pb-2 text-3xl font-bold transition-colors duration-300 font-coronet ${isScrolled ? 'text-primary' : 'text-white'}`}>
                  Daynova
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/store" className={isScrolled ? '' : 'text-white hover:text-white/80'}>Store</NavLink>
              <NavLink to="/about" className={isScrolled ? '' : 'text-white hover:text-white/80'}>ABOUT</NavLink>
              <NavLink to="/faq" className={isScrolled ? '' : 'text-white hover:text-white/80'}>Faq</NavLink>
            </nav>
          </div>

          {/* Right side icons (desktop) */}
          <div className="hidden md:flex items-center space-x-5">
            <NavLink to="/" className={isScrolled ? '' : 'text-white hover:text-white/80'}>CAD $</NavLink>
            <NavLink to="/faq" className={`mr-7 ${isScrolled ? '' : 'text-white hover:text-white/80'}`}>EN</NavLink>
            {/* <Link to="/profile" className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}>
              <PiInstagramLogoThin xmlns="http://www.w3.org/2000/svg" fill="white" strokeWidth={2} stroke="currentColor" className="size-6"/>
            </Link> */}
            {/* <Link to="/language" className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}>
              <HiOutlineGlobeAlt xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={0.8} stroke="currentColor" className="size-6"/>
            </Link> */}
            {/* <Link to="/search" className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}>
              <HiOutlineSearch xmlns="http://www.w3.org/2000/svg" fill="none"  strokeWidth={1.5} stroke="currentColor" className="size-6"/>
            </Link> */}
            <Link to="/profile" className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}>
              <HiOutlineUser xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1} stroke="currentColor" className="size-6"/>
            </Link>
            <Link to="/cart" className={`transition-colors duration-300 relative ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}>
              <HiOutlineShoppingBag xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={0.9} stroke="currentColor" className="size-6"/>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/80'}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 py-2 shadow-md">
          <div className="px-4 py-2 space-y-1">
            <NavLink to="/" className="block py-2">Home</NavLink>
            <NavLink to="/products" className="block py-2">Products</NavLink>
            <NavLink to="/categories" className="block py-2">Categories</NavLink>
            <NavLink to="/about" className="block py-2">About</NavLink>
            <NavLink to="/contact" className="block py-2">Contact</NavLink>
            
            {/* Mobile actions */}
            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-around">[]
              <Link to="/search" className="text-gray-600 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
              <Link to="/cart" className="text-gray-600 hover:text-primary relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;