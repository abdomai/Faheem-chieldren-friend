import React, { useState, useEffect } from 'react';

type MascotProps = {
  message?: string;
  animated?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ message = "مرحبًا! هيا نبدع معًا!", animated = true }) => {
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
        {/* Bear Image */}
        <img 
          src="/bear.jpg" 
          alt="Bear Mascot" 
          className="w-28 h-28 object-contain rounded-full shadow-lg bg-white" 
        />
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
