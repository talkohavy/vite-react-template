import { useState } from 'react';
import { WsConnectionStatus, type WsConnectionStatusValues } from '../constants';

export function useWebsocketState() {
  const [connectionStatus, setConnectionStatus] = useState<WsConnectionStatusValues>(WsConnectionStatus.Idle);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const isConnected = connectionStatus === WsConnectionStatus.Open;
  const isConnecting = connectionStatus === WsConnectionStatus.Connecting;
  const isReconnecting = connectionStatus === WsConnectionStatus.Reconnecting;
  const isConnectionAcknowledged = connectionStatus === WsConnectionStatus.ConnectionAcknowledged;

  return {
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
  };
}
