import { useEffect, useRef, useState } from 'react';
import { SocketIOEvents } from '@src/common/constants';
import type { StreamingPayload } from '../../types';

type UseStreamingProps = {
  emit: (eventName: string, data?: unknown) => void;
};

export function useStreaming(props: UseStreamingProps) {
  const { emit } = props;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsStreaming(false);
        timeoutRef.current = null;
      }
    };
  }, [emit]);

  const startStreamingTo = (topic: string) => {
    setIsStreaming(true);

    const scheduleNextMessage = () => {
      timeoutRef.current = setTimeout(() => {
        const payload: StreamingPayload = {
          topic,
          data: { message: `Hello: ${Date.now()}` },
        };

        emit(SocketIOEvents.SendMessageToTopic, payload);

        scheduleNextMessage();
      }, 4000);
    };

    scheduleNextMessage();
  };

  function stopStreaming() {
    if (!timeoutRef.current) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    setIsStreaming(false);
  }

  return { startStreamingTo, stopStreaming, isStreaming };
}
