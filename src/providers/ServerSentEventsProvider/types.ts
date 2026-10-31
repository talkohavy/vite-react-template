import { SseConnectionStatusValues } from '@src/lib/SseClient';

export type ServerSentEventsContextValue = {
  // - Connection Status:
  connectionStatus: SseConnectionStatusValues;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  // - Actions:
  connect: () => void;
  disconnect: () => void;
  /**
   * Subscribe to one event name; its data is JSON-parsed when possible. Call the returned function to unsubscribe.
   * Subscriptions can be made before connecting, and survive reconnects.
   * Use inside useEffect when a component needs to react to events (e.g. setState).
   */
  subscribe: <T = any>(props: SubscribeToEventProps<T>) => () => void;
  /**
   * Calls the listener on every status change (unlike `connectionStatus`, no change is missed between renders).
   * Call the returned function to unsubscribe.
   */
  subscribeToStatus: (listener: StatusListener) => () => void;
};

export type StatusListener = (status: SseConnectionStatusValues) => void;

export type SubscribeToEventProps<T = any> = {
  eventName: string;
  listener: (data: T) => void;
};
