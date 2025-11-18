import { useState } from 'react';

export const useHomePage = () => {
  const [count, setCount] = useState(0);

  return {
    count,
    setCount,
  };
};
