export const WsConnectionStatus = {
  Idle: 'idle',
  Connecting: 'connecting',
  Open: 'open',
  Reconnecting: 'reconnecting',
  ConnectionAcknowledged: 'connection_acknowledged',
  Closing: 'closing',
  Closed: 'closed',
} as const;

export type WsConnectionStatusValues = (typeof WsConnectionStatus)[keyof typeof WsConnectionStatus];
