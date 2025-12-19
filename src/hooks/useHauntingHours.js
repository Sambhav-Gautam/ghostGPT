import { useState, useEffect } from 'react';

const useHauntingHours = () => {
  const [isHaunting, setIsHaunting] = useState(false);
  // Default haunting hours: 00:00 (12 AM) to 03:00 (3 AM)
  // For debugging, we can verify manually or add a toggle override later
  
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      // Check if time is between 0 (midnight) and 3 AM
      const isNight = hours >= 0 && hours < 3;
      setIsHaunting(isNight);
    };

    checkTime(); // Initial check
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return isHaunting;
};

export default useHauntingHours;
