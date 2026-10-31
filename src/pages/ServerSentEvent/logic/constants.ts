import { SseConnectionStatus, type SseConnectionStatusValues } from '@src/lib/SseClient';

export const EventLogEntryKinds = {
  Status: 'status',
  Connected: 'connected',
  TopicMessage: 'topic-message',
  UserMessage: 'user-message',
  Sent: 'sent',
} as const;

export type EventLogEntryKindValues = (typeof EventLogEntryKinds)[keyof typeof EventLogEntryKinds];

export const MAX_LOG_ENTRIES = 200;

/**
 * A user from the backend's Postgres seed (every seed user has the password `1111`).
 */
export const DEFAULT_EMAIL = 'john.doe@example.com';
export const DEFAULT_PASSWORD = '1111';

export const STATUS_DESCRIPTIONS: Record<SseConnectionStatusValues, string> = {
  [SseConnectionStatus.Idle]: 'Not connected yet.',
  [SseConnectionStatus.Connecting]: 'Opening the stream.',
  [SseConnectionStatus.Open]: 'The stream is live.',
  [SseConnectionStatus.Reconnecting]:
    'The stream dropped. Reconnecting (after refreshing the session, if the access token expired).',
  [SseConnectionStatus.Closed]: 'The stream is closed, and will not reconnect on its own.',
};
