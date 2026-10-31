import { useState, type PropsWithChildren } from 'react';
import { API_GATEWAY_URL, API_URLS } from '@src/common/constants';
import { parseJson } from '@src/common/utils/parseJson';
import { SseClient, SseConnectionStatus, type SseConnectionStatusValues } from '@src/lib/SseClient';
import { refreshSession } from './logic/utils/refreshSession';
import { ServerSentEventsContext } from './ServerSentEventsContext';
import type { ServerSentEventsContextValue, StatusListener, SubscribeToEventProps } from './types';

type ServerSentEventsProviderProps = PropsWithChildren;

export default function ServerSentEventsProvider(props: ServerSentEventsProviderProps) {
  const { children } = props;

  const [connectionStatus, setConnectionStatus] = useState<SseConnectionStatusValues>(SseConnectionStatus.Idle);

  const [statusListeners] = useState(() => new Set<StatusListener>());

  const [sseClient] = useState(() => {
    function onStatusChange(status: SseConnectionStatusValues) {
      setConnectionStatus(status);

      statusListeners.forEach((listener) => listener(status));
    }

    const client = new SseClient({ url: `${API_GATEWAY_URL}${API_URLS.sse}`, refreshSession, onStatusChange });

    return client;
  });

  function subscribeToStatus(listener: StatusListener) {
    statusListeners.add(listener);

    function unsubscribe() {
      statusListeners.delete(listener);
    }

    return unsubscribe;
  }

  function subscribe<T = any>(subscribeProps: SubscribeToEventProps<T>) {
    const { eventName, listener } = subscribeProps;

    function onEvent(event: MessageEvent) {
      const data = parseJson<T>(event.data) ?? event.data;

      listener(data);
    }

    const unsubscribe = sseClient.subscribe({ eventName, listener: onEvent });

    return unsubscribe;
  }

  const value: ServerSentEventsContextValue = {
    connectionStatus,
    isConnected: connectionStatus === SseConnectionStatus.Open,
    isConnecting: connectionStatus === SseConnectionStatus.Connecting,
    isReconnecting: connectionStatus === SseConnectionStatus.Reconnecting,
    connect: () => sseClient.connect(),
    disconnect: () => sseClient.disconnect(),
    subscribe,
    subscribeToStatus,
  };

  return <ServerSentEventsContext value={value}>{children}</ServerSentEventsContext>;
}
