import { useRef, useState } from 'react';
import { DELAY_BETWEEN_STEPS, DELAY_START_RUNNING } from '../constants';

type UseSubtractingProps = {
  value: number;
  setValue: (value: any) => void;
  step: number;
  min?: number;
};

export function useSubtracting(props: UseSubtractingProps) {
  const { value, setValue, step, min } = props;

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isSubtractingRef = useRef(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const iterationRef = useRef(1);

  const decrementValue = (iteration: number) => {
    const newValue = value - step * iteration;
    const updateValue = min !== undefined && newValue < min ? min : newValue;
    setValue(updateValue);
  };

  const startSubtracting = () => {
    iterationRef.current = 1;
    decrementValue(iterationRef.current);

    isSubtractingRef.current = true;
    timeoutIdRef.current = setTimeout(() => {
      setIntervalId(
        setInterval(() => {
          iterationRef.current += 1;
          decrementValue(iterationRef.current);
        }, DELAY_BETWEEN_STEPS),
      );
    }, DELAY_START_RUNNING);
  };

  const stopSubtracting = () => {
    isSubtractingRef.current = false;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return { startSubtracting, stopSubtracting };
}
