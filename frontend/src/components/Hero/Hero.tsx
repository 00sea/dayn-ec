import NavLink from '../Header/NavLink';
import ClockHands from './ClockHands';


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
          <div className="flex-grow flex items-center justify-between relative z-20 mx-auto w-full max-w-7xl md:w-4/5 lg:w-3/4 xl:w-2/3">
          {/* Hero content */}
              <div className="space-y-5 animate-fade-in">
                <h1 className="space-y-7 md:text-5xl lg:text-6xl font-watch font-bold tracking-tight text-white">
                  <span className="block text-6xl text-white/0" style={{ WebkitTextStroke: '0.2px white' }}>I: DAY AIN'T OVER</span>
                  <span className="block text-6xl text-white/0" style={{ WebkitTextStroke: '0.2px white' }}>II: WELCOME</span>
                  <span className="block text-6xl text-white">III: SIGN UP</span>
                  <span className="block text-6xl text-white/0" style={{ WebkitTextStroke: '0.2px white' }}>IIII: PREVIOUS</span>
                  <span className="block text-6xl text-white/0" style={{ WebkitTextStroke: '0.2px white' }}>V: STORE</span>
                </h1>
              </div>

              {/* Clock Face with Hands */}
              <div className="relative z-10 animate-slide-up hidden lg:block mx-auto">
                <div className="relative">
                  <img
                    src="/watch.png"
                    alt="Clock"
                    className="h-110 w-auto object-contain"
                  />
                  {/* Clock hands overlay */}
                  <ClockHands />
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