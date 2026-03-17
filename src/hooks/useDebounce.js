import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the user types again BEFORE the delay finishes, clear the timer and start over!
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}