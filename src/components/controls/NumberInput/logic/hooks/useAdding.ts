import { useRef, useState } from 'react';
import { DELAY_BETWEEN_STEPS, DELAY_START_RUNNING } from '../constants';

type UseAddingProps = {
  value: number;
  setValue: (value: any) => void;
  step: number;
  max?: number;
};

export function useAdding(props: UseAddingProps) {
  const { value, setValue, step, max } = props;

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isAddingRef = useRef(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const iterationRef = useRef(1);

  const incrementValue = (iteration: number) => {
    const newValue = value + step * iteration;
    const updateValue = max !== undefined && newValue > max ? max : newValue;
    setValue(updateValue);
  };

  const startAdding = () => {
    iterationRef.current = 1;
    incrementValue(iterationRef.current);

    isAddingRef.current = true;
    timeoutIdRef.current = setTimeout(() => {
      setIntervalId(
        setInterval(() => {
          iterationRef.current += 1;
          incrementValue(iterationRef.current);
        }, DELAY_BETWEEN_STEPS),
      );
    }, DELAY_START_RUNNING);
  };

  const stopAdding = () => {
    isAddingRef.current = false;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return { startAdding, stopAdding };
}
