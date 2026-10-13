import { useEffect, useEffectEvent, useState } from 'react';
import { wrapInDebounce } from '@talkohavy/lodash';

type UseWidthHeightResizeProps = {
  wrapperRef: any;
  fnToRun?: (value?: any) => void;
  /**
   * @default true
   */
  shouldExecute?: boolean;
  ms?: number;
};

export function useWidthHeightResize(props: UseWidthHeightResizeProps) {
  const { wrapperRef, fnToRun, ms = 300, shouldExecute = true } = props;

  const [size, setSize] = useState(() => ({ width: 0, height: 0 }));

  const onResize = useEffectEvent(() => {
    const wrapperElement = wrapperRef.current;

    // The debounced call can land after unmount, when the element is already gone.
    if (!wrapperElement) return;

    const { width, height } = wrapperElement.getBoundingClientRect();
    const newSize = { width, height };
    setSize(newSize);
    fnToRun?.(newSize);
  });

  useEffect(() => {
    if (!shouldExecute) return;

    const handleResize = wrapInDebounce(() => onResize(), ms);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [ms, shouldExecute]);

  return size;
}
