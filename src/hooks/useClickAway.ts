import { useEffect, useEffectEvent, useRef } from 'react';

export default function useClickAway(callback: () => void) {
  /**
   * @description
   * Attach this returned domNodeRef to the element you want identified as clicked away from.
   */
  const domElementRef = useRef<HTMLDivElement>(null);

  const onClickAway = useEffectEvent(callback);

  useEffect(() => {
    const detectElementClickAway = (e: MouseEvent) => {
      if (!domElementRef.current?.contains(e.target as Node)) {
        onClickAway();
      }
    };

    document.addEventListener('mouseup', detectElementClickAway);

    return () => document.removeEventListener('mouseup', detectElementClickAway);
  }, []);

  return domElementRef;
}
