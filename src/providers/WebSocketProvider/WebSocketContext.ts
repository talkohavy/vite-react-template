import { createContext, use } from 'react';
import type { WsConnectionStatusValues } from './logic/constants';
import type { ConnectOptions } from './types';

export type WebSocketContextValue = {
  getSocket: () => WebSocket | null;
  connectionError: Error | null;
  retryCount: number;
  // - Connection Status:
  connectionStatus: WsConnectionStatusValues;
  isConnected: boolean;
  isConnectionAcknowledged: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  // - Actions:
  connect: (targetUrl: string, options?: ConnectOptions) => void;
  disconnect: () => void;
  send: (data: string) => void;
  /**
   * Subscribe to all incoming text messages. Call the returned function to unsubscribe.
   * Use inside useEffect when a component needs to react to messages (e.g. setState).
   */
  subscribeMessages: <T = any>(listener: (message: T) => void) => () => void;
};

const INITIAL_STATE = null;

export const WebSocketContext = createContext<WebSocketContextValue | null>(INITIAL_STATE);
export const useWebSocket = (): WebSocketContextValue => {
  const ctx = use(WebSocketContext);

  if (!ctx) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return ctx;
};
