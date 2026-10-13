import { WebSocketClient } from '@src/lib/WebSocketClient';
import { WsConnectionStatus, type WsConnectionStatusValues } from '../constants';
import type { ConnectOptions } from '../../types';

type UseWebsocketConnectProps = {
  wsClientRef: any;
  setConnectionStatus: (status: WsConnectionStatusValues) => void;
  setConnectionError: (error: Error | null) => void;
  setRetryCount: (count: number) => void;
  notifyMessageListeners: (message: string) => void;
  disconnect: () => void;
};

export function useWebsocketConnect(props: UseWebsocketConnectProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';

  const { wsClientRef, setConnectionStatus, setConnectionError, setRetryCount, notifyMessageListeners, disconnect } =
    props;

  const clearErrorAndRetryCount = () => {
    setConnectionError(null);
    setRetryCount(0);
  };

  const handleOpen = (onConnectionOpen?: () => void) => {
    setConnectionStatus(WsConnectionStatus.Open);
    clearErrorAndRetryCount();
    onConnectionOpen?.();
  };

  const handleClose = (context: { shouldRetry: boolean }, onConnectionClose?: () => void) => {
    if (context.shouldRetry) {
      setConnectionStatus(WsConnectionStatus.Reconnecting);
    } else {
      wsClientRef.current = null;
      setConnectionStatus(WsConnectionStatus.Closed);
      setRetryCount(0);
    }

    setConnectionError(null);
    onConnectionClose?.();
  };

  const handleRetry = (count: number) => {
    setRetryCount(count);
  };

  const handleMessage = (event: MessageEvent<string | Blob>) => {
    const data: string = typeof event.data === 'string' ? event.data : `[Blob ${event.data.size} bytes]`;

    notifyMessageListeners(data);
  };

  const handleError = () => {
    setConnectionError(new Error('WebSocket error'));
  };

  const connect = (targetUrl: string, options?: ConnectOptions) => {
    const { onConnectionOpen, onConnectionClose } = options ?? {};

    disconnect();
    clearErrorAndRetryCount();

    const trimmedUrl = targetUrl.trim();

    if (!trimmedUrl) {
      setConnectionError(new Error('WebSocket URL is empty'));
      return;
    }

    setConnectionStatus(WsConnectionStatus.Connecting);

    let wsClient: WebSocketClient;

    try {
      wsClient = new WebSocketClient(trimmedUrl, {
        onOpen: () => handleOpen(onConnectionOpen),
        onClose: (context) => handleClose(context, onConnectionClose),
        onError: handleError,
        onMessage: handleMessage,
        onRetry: handleRetry,
        retryStrategy: {
          maxRetries: 5,
          retryDelayMs: 2000,
        },
      });

      wsClient.connect().catch((err: unknown) => {
        setConnectionStatus(WsConnectionStatus.Closed);
        setConnectionError(err instanceof Error ? err : new Error(String(err)));
      });
    } catch (err) {
      setConnectionStatus(WsConnectionStatus.Closed);
      setConnectionError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    wsClientRef.current = wsClient;
  };

  return { connect };
}
