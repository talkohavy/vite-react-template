export const SseConnectionStatus = {
  Idle: 'idle',
  Connecting: 'connecting',
  Open: 'open',
  /**
   * The connection dropped: the browser is reconnecting, or the client is refreshing the session to reconnect.
   */
  Reconnecting: 'reconnecting',
  Closed: 'closed',
} as const;

export type SseConnectionStatusValues = (typeof SseConnectionStatus)[keyof typeof SseConnectionStatus];

/**
 * A refreshed session should connect on the first try, so failing again and again means something else is wrong.
 */
export const MAX_RECONNECTS_IN_A_ROW = 3;
