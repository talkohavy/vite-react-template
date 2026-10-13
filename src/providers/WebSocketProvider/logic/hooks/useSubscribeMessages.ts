import { useRef } from 'react';
import { parseJson } from '@src/common/utils/parseJson';

export function useSubscribeMessages() {
  const messageListenersRef = useRef(new Set<(message: any) => void>());

  const notifyMessageListeners = (message: string) => {
    const parsedMessage = parseJson(message) ?? message;

    messageListenersRef.current.forEach((listener) => {
      try {
        listener(parsedMessage);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const subscribeMessages = <T = any>(listener: (message: T) => void) => {
    messageListenersRef.current.add(listener);

    return () => {
      messageListenersRef.current.delete(listener);
    };
  };

  return { subscribeMessages, notifyMessageListeners };
}
