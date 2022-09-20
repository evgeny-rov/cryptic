import { useRef, useEffect } from 'react';

export default <T extends HTMLElement>(callback: () => void, shouldListen = true) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      console.log('click');
      if (!ref.current) return;
      const target = event.target as Node;
      const isClickedOutside = !ref.current.contains(target);

      if (isClickedOutside) {
        // request prevents issues with outside buttons toggling same state
        requestAnimationFrame(callback);
      }
    };

    if (shouldListen) document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [shouldListen]);

  return ref;
};
