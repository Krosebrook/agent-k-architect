
import { useState, useEffect } from 'react';

export const useSystemUptime = () => {
  const [uptime, setUptime] = useState('00:00:00');

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return uptime;
};
