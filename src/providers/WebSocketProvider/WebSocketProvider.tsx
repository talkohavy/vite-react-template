import { useCallback, useEffect, useMemo, useRef, type PropsWithChildren } from 'react';
import { useSubscribeMessages } from './logic/hooks/useSubscribeMessages';
import { useWebsocketConnect } from './logic/hooks/useWebsocketConnect';
import { useWebsocketState } from './logic/hooks/useWebsocketState';
import { WebSocketContext, type WebSocketContextValue } from './WebSocketContext';
import { WsConnectionStatus } from './wsConnectionStatus';
import type { WebSocketClient } from '@src/lib/WebSocketClient';

type WebSocketProviderProps = PropsWithChildren;

export default function WebSocketProvider(props: WebSocketProviderProps) {
  const { children } = props;

  const wsClientRef = useRef<WebSocketClient | null>(null);

  const {
    connectionStatus,
    connectionError,
    retryCount,
    isConnected,
    isConnecting,
    isReconnecting,
    isConnectionAcknowledged,
    setConnectionStatus,
    setConnectionError,
    setRetryCount,
  } = useWebsocketState();

  const { subscribeMessages, notifyMessageListeners } = useSubscribeMessages();

  const disconnect = useCallback(() => {
    const wsClient = wsClientRef.current;

    if (!wsClient) return;

    wsClient.disconnect();

    wsClientRef.current = null;
    setConnectionStatus(WsConnectionStatus.Closed);
  }, [setConnectionStatus]);

  const { connect } = useWebsocketConnect({
    wsClientRef,
    setConnectionStatus,
    setConnectionError,
    setRetryCount,
    notifyMessageListeners,
    disconnect,
  });

  const send = useCallback((data: string) => {
    const wsClient = wsClientRef.current;

    if (!wsClient?.isConnected()) return;

    wsClient.send(data);
  }, []);

  // Server implementation required! Server sends a connection_acknowledged message when the connection is established.
  useEffect(() => {
    return subscribeMessages((data) => {
      if (data.type === WsConnectionStatus.ConnectionAcknowledged) {
        setConnectionStatus(WsConnectionStatus.ConnectionAcknowledged);
      }
    });
  }, [subscribeMessages, setConnectionStatus]);

  const value: WebSocketContextValue = useMemo(
    () => ({
      getSocket: () => wsClientRef.current?.getSocket() ?? null,
      connectionStatus,
      connectionError,
      retryCount,
      isConnected,
      isConnectionAcknowledged,
      isConnecting,
      isReconnecting,
      connect,
      disconnect,
      send,
      subscribeMessages,
    }),
    [
      connectionStatus,
      connectionError,
      retryCount,
      isConnected,
      isConnectionAcknowledged,
      isConnecting,
      isReconnecting,
      connect,
      disconnect,
      send,
      subscribeMessages,
    ],
  );

  return <WebSocketContext value={value}>{children}</WebSocketContext>;
}
