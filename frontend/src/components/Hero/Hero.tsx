import React from 'react';
import { Link } from 'react-router-dom';
import NavLink from '../Header/NavLink';

const Hero: React.FC = () => {
  return (
      <div className="h-screen items-center relative overflow-hidden pt-20 flex">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Video element with overlay */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            {/* For a real implementation, you would replace this with your actual video file */}
            <source src="/video0.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mx-auto flex flex-col justify-between h-full w-full">
          {/* Text and watch */}
          <div className="flex-grow flex items-center justify-between relative z-20 mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl md:w-4/5 lg:w-3/4 xl:w-2/3">
          {/* Hero content */}
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-watch font-bold tracking-tight text-white">
                  <span className="block text-white/40">I: DAY AIN'T OVER</span>
                  <span className="block text-white">III: SIGN UP</span>
                  <span className="block text-white/40">V: STORE</span>
                </h1>
              </div>

              {/* Hero product showcase */}
              <div className="relative z-10 animate-slide-up hidden lg:block mx-auto">
                <div>
                  <img
                    src="/watch.png"
                    alt="Fashion collection showcase"
                    className=" max-h-[60vh] w-auto object-contain"
                  />
                </div>
              </div>
          </div>
          <div className="z-20 mt-auto h-8 mx-auto flex gap-x-3">
            <p className="font-nav">
              &copy; {new Date().getFullYear()} Daynova. All rights reserved.
            </p>
            <NavLink to="/products" className='text-white hover:text-white/80'>Terms</NavLink>
            <NavLink to="/products" className='text-white hover:text-white/80'>Privacy</NavLink>
            <NavLink to="/products" className='text-white hover:text-white/80'>Cookies</NavLink>
          </div>

        </div>
      </div>
  );
};

export default Hero;