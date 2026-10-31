import type { SseConnectionStatusValues } from './logic/constants';

export type SseEventListener = (event: MessageEvent) => void;

export type SseClientConstructorProps = {
  url: string;
  /**
   * Called when the browser gives up reconnecting (e.g. a 401 once the access token expired).
   *
   * @returns whether the session is still alive.
   */
  refreshSession: () => Promise<boolean>;
  onStatusChange?: (status: SseConnectionStatusValues) => void;
};

export type SubscribeProps = {
  eventName: string;
  listener: SseEventListener;
};
