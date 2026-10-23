export const SSEEventNames = {
  Message: 'message',
  Connected: 'connected',
} as const;

export type SSEEventNameValues = (typeof SSEEventNames)[keyof typeof SSEEventNames];
