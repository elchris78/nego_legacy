import { useState, useEffect } from 'react';

const useUserType = (key: string): string | null => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    // Verifica si el código se ejecuta en el cliente (navegador)
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      setValue(storedValue);
    }
  }, [key]);

  return value;
};

export default useUserType;
