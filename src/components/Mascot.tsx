
import React, { useState, useEffect } from 'react';

type MascotProps = {
  message?: string;
  animated?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ message = "Hi there! Let's create something awesome!", animated = true }) => {
  const [isWaving, setIsWaving] = useState(false);
  
  useEffect(() => {
    if (animated) {
      // Wave occasionally
      const waveInterval = setInterval(() => {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1000);
      }, 8000);
      
      return () => clearInterval(waveInterval);
    }
  }, [animated]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Bear Face */}
        <div className="w-28 h-28 bg-kidsYellow rounded-full flex flex-col justify-center items-center shadow-lg">
          {/* Eyes */}
          <div className="flex justify-center space-x-7 -mt-2">
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
          
          {/* Nose */}
          <div className="w-5 h-4 bg-pink-900 rounded-full mt-2"></div>
          
          {/* Mouth */}
          <div className="mt-2 w-8 h-3 border-b-4 border-black rounded-b-full"></div>
          
          {/* Ears */}
          <div className="absolute -top-5 -left-3 w-8 h-8 bg-kidsYellow rounded-full"></div>
          <div className="absolute -top-5 -right-3 w-8 h-8 bg-kidsYellow rounded-full"></div>
          
          {/* Arm */}
          <div 
            className={`absolute -right-7 top-10 w-8 h-4 bg-kidsYellow rounded-full transform ${isWaving ? 'rotate-45 -translate-y-2' : 'rotate-0'} transition-transform duration-300`}
          ></div>
        </div>
      </div>
      
      {/* Speech bubble */}
      <div className="mt-4 bg-white p-4 rounded-xl relative shadow-md max-w-xs">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
        <p className="text-center text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Mascot;
