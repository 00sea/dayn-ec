import React, { useState, useEffect } from 'react';

const ClockHands: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  // Static rotation offset for the entire clock (if face is rotated)
  const clockRotationOffset = 9; // degrees clockwise - adjust as needed
  
  useEffect(() => {
    // For smooth movement, update more frequently
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second for smoother motion
    
    return () => {
      clearInterval(timerId);
    };
  }, []);
  
  // Get current seconds as well for smooth movement
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // For smooth movement, include seconds in the calculation
  // Hour hand makes a full 30° rotation in 60 minutes (0.5° per minute)
  // and very slight movement for seconds (0.5/60 = 0.00833° per second)
  const hourRotation = (hours * 30) + (minutes * 0.5) + (seconds * 0.00833) + clockRotationOffset;
  
  // Minute hand makes a full 6° rotation in 60 seconds (0.1° per second)
  const minuteRotation = (minutes * 6) + (seconds * 0.1) + clockRotationOffset;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ 
      transform: 'translateX(-5%)',
      transition: 'transform 0.2s ease-out' // Add slight smoothing to position changes
    }}>
      {/* Hour Hand */}
      <div 
        className="absolute"
        style={{ 
          transform: `rotate(${hourRotation}deg)`,
          transformOrigin: 'center bottom',
          bottom: '50%',
          left: '50%',
          width: '2.9%',
          marginLeft: '-1.5%',
          transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)' // Watch-like smooth motion
        }}
      >
        <img 
          src="/hourhand.png" 
          alt="Hour Hand" 
          className="w-full h-auto"
          style={{ 
            transformOrigin: 'center bottom',
            maxHeight: '25%'
          }}
        />
      </div>
      
      {/* Minute Hand */}
      <div 
        className="absolute"
        style={{ 
          transform: `rotate(${minuteRotation}deg)`,
          transformOrigin: 'center bottom',
          bottom: '50%',
          left: '50%',
          width: '2.5%',
          marginLeft: '-1%',
          transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)' // Watch-like smooth motion
        }}
      >
        <img 
          src="/minutehand.png" 
          alt="Minute Hand" 
          className="w-full h-auto"
          style={{ 
            transformOrigin: 'center bottom',
            maxHeight: '35%'
          }}
        />
      </div>
      
      {/* Center point */}
      <div className="absolute" style={{ 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '6%'
      }}>
        <img 
          src="/center.png" 
          alt="Clock Center" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ClockHands;