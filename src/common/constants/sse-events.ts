export const SSEEventNames = {
  /**
   * Sent once per connection, as soon as it is live. Its data is `{ socketId }`.
   */
  Connected: 'connected',
  TopicMessage: 'topic-message',
  UserMessage: 'user-message',
} as const;

export type SSEEventNameValues = (typeof SSEEventNames)[keyof typeof SSEEventNames];
